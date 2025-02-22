import { Upload, message, UploadProps, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import { post } from '../../utils/request';
interface ImageUploaderProps {
  accept?: string;
  maxSize?: number; // 单位 MB
  action?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  accept = 'image/jpg, image/jpeg, image/png',
  maxSize = 5,
  action = '/upload/single', // 默认上传接口
}) => {
  const [previewImage, setPreviewImage] = useState('');

  // 处理上传前校验
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isValidType = accept.split(', ').includes(file.type);
    if (!isValidType) {
      message.error(`仅支持 ${accept} 格式文件`);
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size / 1024 / 1024 <= maxSize;
    if (!isValidSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  // 自定义上传逻辑
  const customRequest: any = async ({ file, onProgress, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const data:any = await post(action, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: (progressEvent) => {
          onProgress?.({
            percent: (progressEvent.loaded / (progressEvent.total || 1)) * 100,
          });
        },
      });
      console.log("输出", data)
      onSuccess?.(data);
    } catch (error) {
      onError?.(error as Error);
      message.error('上传失败，请重试');
    }
  };


  return (
    <>
      <Upload
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        accept={accept}
        listType="picture-card"
        onPreview={(file) => setPreviewImage(file.url || '')}
      >
        <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传图片</div></div>
      </Upload>

      <Image
        width={0}
        style={{ display: 'none' }}
        preview={{
          visible: !!previewImage,
          src: previewImage,
          onVisibleChange: (visible) => !visible && setPreviewImage(''),
        }}
      />
    </>
  );
};

export default ImageUploader;