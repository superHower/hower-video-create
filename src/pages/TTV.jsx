import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import VideoUploader from '../components/VideoUploader';
import VideoPlayer from '../components/VideoPlayer';
import { post } from '../utils/request';
import '../assets/css/TTV.css'

const TTV = () => {
  const [videoData, setVideoData] = useState(null);
  const [coverBase64, setCoverBase64] = useState(null);

  const handleData = async(data) => {
    setVideoData(data);
  };

  // 模拟AI生成视频请求
  const handleAIGenerate = async() => {
    message.warning('没有钱购买 智谱API key')
    // let url = null
    // const response = await post('/admin/video', {
    //   title: null,
    //   videoUrl: url,
    //   tags: 1,
    //   status: 2
    // })
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
    <div className="ttv-container">
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <div className="upload-section">
            <div className="section-title">AI生成视频</div>
            <Input className="ai-input" placeholder="输入文字描述" />
            <Button className="generate-btn" onClick={handleAIGenerate}>AI生成</Button>
            
            <div className="section-title">上传我的视频</div>
            <VideoUploader onSendData={handleData} />
          </div>
        </Col>
        
        <Col span={18}>
          <div className="preview-section">
            {videoData?.videoUrl && (
              <div className="video-container">
                <VideoPlayer 
                  src={videoData?.videoUrl}
                  onFirstFrame={setCoverBase64}
                  options={{ controls: true }}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TTV;
