import React, { useEffect, useState } from 'react';
import { Form, Button } from 'antd';
import { post, get } from '../utils/request';

const MyWork = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVideoList = async () => {
    try {
      const response:any = await get('/admin/video');
      setVideoList(response); 
    } catch (error) {
      console.error('获取视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 使用 useEffect 钩子，在组件挂载时执行 getVideoList 函数
  useEffect(() => {
    getVideoList();
  }, []);

  return (
    <div>
      {loading ? (
        <p>正在加载视频列表...</p>
      ) : videoList.length === 0 ? (
        <p>没有找到视频。</p>
      ) : (
        <ul>
          {videoList.map((video, index) => (
            <li key={index}>
              {video.title} 
            </li>
          ))}
        </ul>
      )}
      <Button>提交</Button>
    </div>
  );
};

export default MyWork;