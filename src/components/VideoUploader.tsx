import { Upload, Button, Progress, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../utils/file-upload'
import { useState } from 'react';
import { API_URL, getDuration, getFileName } from '../utils/inedx';
interface UploadState {
  fileList: any[];
  uploading: boolean;
  uploadProgress: number;
}
interface VideoUploaderProps {
  onSendData: (data: { name: string; videoUrl: string, duration: number,size: number }) => void;
}
const VideoUploader: React.FC<VideoUploaderProps> = ({ onSendData }) => {
  const [state, setState] = useState<UploadState>({
    fileList: [],
    uploading: false,
    uploadProgress: 0,
  });

  // 自定义上传处理
  const handleCustomRequest = async (options: any) => {
    
    const { file, onSuccess, onError } = options;
    
    try {
      setState(prev => ({ ...prev, uploading: true }));

      const result = await uploadFile(
        file,
        5 * 1024 * 1024, // 基础分片大小 5MB
        3, // 最大重试次数
        1000, // 重试延迟
        (progress) => {
          setState(prev => ({ ...prev, uploadProgress: progress }));
        }
      );

      if (result.success) {
        if(result.exit){
          message.warning(`${file.name} 已存在`)
        }else {
          let videoUrl = API_URL + result.filePath
          const duration = await getDuration(file);          

          onSuccess(result, file);
          onSendData({
            videoUrl,
            name: getFileName(file.name),
            duration,
            size:file.size
          });
          message.success(`${file.name} 上传成功`)
        }
      } else {
        message.error(result.message || '上传失败');
        onError(new Error(result.message));
      }
    } catch (error) {
      message.error('上传失败');
      onError(error);
    } finally {
      setState(prev => ({
        ...prev,
        uploading: false,
        uploadProgress: 0
      }));
    }
  };

  // 处理文件变化
  const handleChange = (info: any) => {
    let newFileList = [...info.fileList];

    // 限制只能上传一个文件
    newFileList = newFileList.slice(-1);

    // 过滤掉已完成的文件
    newFileList = newFileList.map(file => {
      if (file.status === 'done') {
        return file;
      }
      return {
        ...file,
        status: state.uploading ? 'uploading' : 'error',
      };
    });

    setState(prev => ({ ...prev, fileList: newFileList }));
  };

  return (
    <div>
      <Upload
        accept="video/*"
        multiple={false}
        fileList={state.fileList}
        onChange={handleChange}
        customRequest={handleCustomRequest}
        disabled={state.uploading}
      >
        <Button
          icon={<UploadOutlined />}
          disabled={state.uploading}
        >
          选择视频文件
        </Button>
      </Upload>

      {state.uploading && (
        <div style={{ marginTop: 16 }}>
          <Progress
            percent={Math.round(state.uploadProgress)}
            status="active"
            format={(percent) => `上传中 ${percent}%`}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUploader;