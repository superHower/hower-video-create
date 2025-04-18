import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Button, Empty } from 'antd';
import { CheckCircleOutlined, TagsOutlined, HeartOutlined, PlayCircleOutlined, LikeOutlined } from '@ant-design/icons';
import { post, get } from '../utils/request';
import { useNavigate } from 'react-router-dom';
import '../assets/css/videolist.css';
import defaultImage from '../assets/image/empty-box.png';  // 添加默认图片导入

const { Meta } = Card;

const VideoList = ({ getListParams, isHome }) => {
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isHom, setIsHom] = useState(false)
    const navigate = useNavigate();
    const getVideoList = async () => {
        try {
            const response: any = await post('/admin/video/list', getListParams);
            setVideoList(response.result.data);
        } catch (error) {
            console.error('获取视频列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHom(isHome);
        getVideoList();
    }, [getListParams]);

    const handleCardClick = async (id) => {
        await post('/admin/video/play', { videoId: id });
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
                            >
                                <div className="video-card-container" onClick={() => handleCardClick(video.id)}>
                                    <div className="video-card-wrapper">
                                        <div className="video-thumbnail">
                                            <img
                                                alt={video.title}
                                                src={video.coverUrl || defaultImage}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null; // 防止循环加载
                                                    target.src = defaultImage;
                                                }}
                                            />
                                            <div className="video-tags-left">
                                                <div className="video-stats">
                                                    <div className="stat-group">
                                                        <span className="stat"><PlayCircleOutlined />{video.playCount}</span>
                                                        <span className="stat"><LikeOutlined />{video.likeCount}</span>
                                                        <span className="stat"><HeartOutlined />{video.favoriteCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="video-duration">03:24</div>
                                            <div className="video-tags-overlay">
                                                {video.tags === 0 && <span className="tag">AI生成</span>}
                                            </div>
                                            {!isHom && (
                                                <div className="video-tags-status">
                                                        <span className="tag">{video.status === 0 ? '正常' : video.status === 1 ? '下架' : '待审核'}</span>
                                                </div>
                                            )}
                                            <div className="video-hover-info">
                                                <PlayCircleOutlined className="play-icon" />
                                            </div>
                                        </div>
                                        <div className="video-content">
                                            <h3 className="video-title">{video.title}</h3>
                                            <div className="video-author">
                                                <div>@ {video.accountUsername}</div>
                                                <div>{video.updatedAt.substring(5, 10)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Spin>
        </div>
    );
};

export default VideoList;