import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Button, Empty } from 'antd';
import { post, get } from '../utils/request';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const MyWork = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getVideoList = async () => {
    try {
      const response: any = await get('/admin/video');
      setVideoList(response); 
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
      <Spin spinning={loading} tip="加载中...">
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
                        objectFit: 'cover'
                      }}
                    />
                  }
                  onClick={() => handleCardClick(video.id)} 
                >
                  <Meta
                    title={video.title}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
      
      <div style={{ 
        marginTop: '24px',
        textAlign: 'center'
      }}>
        <Button type="primary" size="large">
          提交作品
        </Button>
      </div>
    </div>
  );
};

export default MyWork;