import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import VideoUploader from '../components/VideoUploader';
import VideoPlayer from '../components/VideoPlayer';
import { API_URL, getDuration, getFileName } from '../utils/inedx';
import { post } from '../utils/request';
const TTI = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const handleData = (data) => {
    console.log("输出", data.name)
    setVideoUrl(data.url);
  };

  // 模拟AI生成视频请求
  const handleAIGenerate = async() => {
    let url = null
    const response = await post('/admin/video', {
      title: null,
      description: null,
      videoUrl: url,
      coverUrl: null,
      duration: null,
      fileSize: null,
      tags: 1,
      status: 2
    })
  };

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
        {videoUrl && <VideoPlayer src={videoUrl} options={{}} className="video-player" style={{ width: '100%', height: '100%' }} />}
      </div>
    </Col>
  </Row>
    </>
  );
};

export default TTI;
