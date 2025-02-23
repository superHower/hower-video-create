import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import VideoUploader from '../components/VideoUploader';
import VideoPlayer from '../components/VideoPlayer';
import { post } from '../utils/request';

const TTI = () => {
  const [videoData, setVideoData] = useState(null);
  const [coverBase64, setCoverBase64] = useState(null);

  const handleData = async(data) => {
    setVideoData(data);
  };

  // 模拟AI生成视频请求
  const handleAIGenerate = async() => {
    let url = null
    const response = await post('/admin/video', {
      title: null,
      videoUrl: url,
      tags: 1,
      status: 2
    })
  };
  useEffect(() => {
    if (videoData?.videoUrl && coverBase64) {
      const submitData = async () => {
        await post('/admin/video', {
          ...videoData,
          videoUrl: videoData?.videoUrl,
          coverUrl: coverBase64,
          tags: 0,
          status:0
        });
      };
      submitData();
    }
  }, [videoData?.videoUrl, coverBase64]);
  return (
    <>
  <Row gutter={16}>
    <Col span={6}>
        <div>AI生成视频</div>
        <Input placeholder="输入文字描述" />
        <Button onClick={handleAIGenerate}>AI生成</Button>

        <div>上传我的视频</div>
        <VideoUploader onSendData={handleData} />
    </Col>

    <Col span={18}>
      <div style={{ 
        border: '1px solid #ddd',
        height: '70vh',
        padding: 16 
      }}>
        {videoData?.videoUrl && (
          <VideoPlayer 
            src={videoData?.videoUrl} 
            onFirstFrame={setCoverBase64} 
            options={{}} 
            className="video-player" 
            style={{ width: '100%', height: '100%' }} 
          />
        )}
      </div>
    </Col>
  </Row>
    </>
  );
};

export default TTI;
