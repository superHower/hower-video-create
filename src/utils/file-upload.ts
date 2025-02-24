import { post } from './request';
import SparkMD5 from 'spark-md5'; // 需要安装 spark-md5 库

interface IApiRes {
  code: string;
  message?: string;
  data?: any;
}

interface IUploadFileRes {
  success: boolean;
  filePath?: string;
  message?: string;
  exit?: boolean;
}

/** 
 * 上传文件（主线程分片方案）
 */
export async function uploadFile(
  file: File,
  baseChunkSize: number,
  maxRetries: number = 3,
  retryDelay: number = 1000,
  progress_cb?: (progress: number) => void
): Promise<IUploadFileRes> {
  try {
    // 生成文件哈希
    const fileHash = await calculateFileHash(file, baseChunkSize);
    
    // 获取分片列表
    const chunks = sliceFile(file, baseChunkSize);
    console.log("分片列表", chunks)
    
    // 处理上传流程
    return await handleUploadProcess(file, chunks, fileHash, maxRetries, retryDelay, progress_cb);
  } catch (error: any) {
    return { success: false, message: error.message || '文件上传失败' };
  }
}

/** 
 * 计算文件哈希（主线程计算）
 */
async function calculateFileHash(file: File, chunkSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let currentChunk = 0;

    fileReader.onload = (e) => {
      if (!e.target?.result) return;
      spark.append(e.target.result as ArrayBuffer);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNextChunk();
      } else {
        resolve(spark.end());
      }
    };

    fileReader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    const loadNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(file.slice(start, end));
    };

    loadNextChunk();
  });
}

/** 
 * 文件分片
 */
function sliceFile(file: File, chunkSize: number): Blob[] {
  console.log("输出", file)
  const chunks = [];
  let start = 0;
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  return chunks;
}

/** 
 * 处理上传流程
 */
async function handleUploadProcess(
  file: File,
  chunks: Blob[],
  fileHash: string,
  maxRetries: number,
  retryDelay: number,
  progress_cb?: (progress: number) => void
): Promise<IUploadFileRes> {
  const extname = file.name.split('.').pop() || '';
  let neededChunks: number[] = [];

  // 1. 验证文件状态
  try {
    const res = await post<IApiRes>('/upload/verify', {fileHash,totalCount: chunks.length,extname});
    if (res.data.code === 'FILE_EXIST') {
      return { success: true, filePath: res.data.data.filePath, exit: true };
    } else if (res.data.code === 'ALL_CHUNK_UPLOAD') {
      return await mergeFile(fileHash, extname);
    } else if (res.data.code === 'SUCCESS') {
      neededChunks = res.data.data.neededFileList;
    }
  } catch (error: any) {
    throw new Error(error.message || '文件验证失败');
  }
  // 2. 上传分片
  let uploadedCount = chunks.length - neededChunks.length;
  const updateProgress = () => {
    const progress = (uploadedCount / chunks.length) * 100;
    progress_cb?.(Math.min(progress, 100));
  };

  for (const chunkIndex of neededChunks) {
    const index = chunkIndex - 1; // 转换为从0开始的索引
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        const formData = new FormData();
        let newchunk = new File([chunks[index]], `chunk-${chunkIndex}`, {
          type: 'application/octet-stream' // 明确指定 MIME 类型
        })
        console.log("输出", newchunk)
        formData.append('chunk', newchunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('fileHash', fileHash);
        formData.append('extname', extname);

        const res = await post<IApiRes>('/upload/chunk', formData);
        if (res.data.code === 'SUCCESS') {
          success = true;
          uploadedCount++;
          updateProgress();
        } else {
          throw new Error('分片上传失败');
        }
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          throw new Error(`分片 ${chunkIndex} 上传失败`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  // 3. 合并文件
  return await mergeFile(fileHash, extname);
}

/** 
 * 请求合并文件
 */
async function mergeFile(fileHash: string, extname: string): Promise<IUploadFileRes> {
  try {
    const mergeRes = await post<IApiRes>('/upload/merge', { fileHash, extname });
    return mergeRes.data.code === 'SUCCESS'
      ? { success: true, filePath: mergeRes.data.data.filePath }
      : { success: false, message: '文件合并失败' };
  } catch (error: any) {
    throw new Error(error.message || '合并请求失败');
  }
}