const getAPIURL = () => {
  return process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : 'www.example.com';
};
const getDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const blobUrl = URL.createObjectURL(file); // 生成临时 URL

    video.src = blobUrl;

    // 成功获取元数据
    video.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(blobUrl); // 释放内存
      resolve(parseInt(video.duration));
    });

    // 错误处理
    video.addEventListener('error', (e) => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('无法解析视频元数据'));
    });
  });
};

const getFileName = (fileName) => {
  const fileExtension = fileName.split('.').pop();
  return fileName.slice(0, -fileExtension.length - 1);
};

export const API_URL = getAPIURL();
export { getDuration, getFileName }