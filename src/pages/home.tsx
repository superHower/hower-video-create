import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Button, Empty } from 'antd';
import { CheckCircleOutlined, TagsOutlined, HeartOutlined, PlayCircleOutlined, LikeOutlined } from '@ant-design/icons';
import { post, get } from '../utils/request';
import { useNavigate } from 'react-router-dom';
import '../assets/css/play.css'; // 导入自定义 CSS 文件

const { Meta } = Card;

const Home = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getVideoList = async () => {
    try {
      const response: any = await post('/admin/video/list');
      setVideoList(response.data);
    } catch (error) {
      console.error('获取视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideoList();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/play?id=${id}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading} tip="加载中">
        {videoList.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无视频数据"
            style={{ margin: '40px 0' }}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {videoList.map((video, index) => (
              <Col
                key={index}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                style={{ textAlign: 'center' }}
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={video.title}
                      src={video.coverUrl}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  }
                  onClick={() => handleCardClick(video.id)}
                  className="video-card hover:shadow-lg transition-shadow duration-300"
                >
                  <Meta
                    title={video.title}
                    style={{ marginTop: '8px' }}
                  />
                  <div className="video-info">
                    <div className="video-status">
                      <CheckCircleOutlined className="text-green" />
                      <span className="ml-1">状态: {video.status}</span>
                    </div>
                    <div className="video-tags">
                      <TagsOutlined className="text-purple" />
                      <span className="ml-1">类型: {video.tags}</span>
                    </div>
                    <div className="video-stats">
                      <div className="stat-item">
                        <HeartOutlined className="text-red" />
                        <span className="ml-1">收藏量: {video.favoriteCount}</span>
                      </div>
                      <div className="stat-item">
                        <PlayCircleOutlined className="text-blue" />
                        <span className="ml-1">播放量: {video.playCount}</span>
                      </div>
                      <div className="stat-item">
                        <LikeOutlined className="text-yellow" />
                        <span className="ml-1">点赞量: {video.likeCount}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
      
    </div>
  );
};

export default Home;