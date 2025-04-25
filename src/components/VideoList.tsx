import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Button, Avatar, Empty, Tabs, Input } from 'antd';  // 添加 Tabs
import { CheckCircleOutlined, TagsOutlined, HeartOutlined, UserOutlined, PlayCircleOutlined, LikeOutlined, StarOutlined, SearchOutlined } from '@ant-design/icons';  // 添加 SearchOutlined
import { post, get } from '../utils/request';
import { useNavigate } from 'react-router-dom';
import '../assets/css/videolist.css';
import defaultImage from '../assets/image/empty-box.png';  // 添加默认图片导入
import { formatDuration } from '../utils/inedx';

const VideoList = ({ getListParams, isHome }) => {
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isHom, setIsHom] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [searchText, setSearchText] = useState('');

    const navList = [
        { key: 'A', label: '全部' },
        { key: 'R', label: '热门' },
        { key: '0', label: '音乐' },
        { key: '1', label: '美食' },
        { key: '2', label: '游戏' },
        { key: '3', label: '影视' },
        { key: '4', label: '知识' },
        { key: '5', label: '体育' },
        { key: '6', label: '旅行' },
        { key: '7', label: '亲子' },
        { key: '8', label: '美妆' },
        { key: '9', label: '其他' },
    ]

    const navigate = useNavigate();
    const getVideoList = async (type: number, tags?: string) => {
        setLoading(true);
        getListParams.type = type;
        getListParams.isHot = false;
        getListParams.title = searchText || null;  // 添加搜索关键词
        if(tags) {
            if (tags == 'R') getListParams.isHot = true;
            else getListParams.tags = tags;
        }else {
            getListParams.tags = null;
        }
  
        try {
            const response: any = await post('/admin/video/list', getListParams);
            setVideoList(response.result.data);
            if(getListParams.type == '0') {
                setUserInfo({
                    worksNum: response.result.data.length,
                    likesNum: response.result.data.reduce((total, video) => total + (video.likeCount || 0), 0)
                })
            }
        } catch (error) {
            console.error('获取视频列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHom(isHome);
        getVideoList(0);
    }, [getListParams]);

    const handleCardClick = async (id) => {
        await post('/admin/video/play', { videoId: id });
        navigate(`/play?id=${id}`);
    };

    const onTabChange = (key) => {
        // 根据 key 切换不同的视频列表
        switch (key) {
            case 'works':
                getVideoList(0);
                break;  
            case 'likes':
                getVideoList(1);
                break;
            case 'collected':
                getVideoList(2);
                break;
        }   
    }

    const handleSearch = (value) => {
        setSearchText(value);
        getVideoList(getListParams.type || 0);
    };

    return (
        <div className='list-container'>
            {isHom ? (
                <>
                    <div className='home-nav'>
                        <div className="nav-wrapper">
                            <Tabs
                                defaultActiveKey="A"
                                items={navList}
                                onChange={(key) => {
                                    if (key === 'A') {
                                        getVideoList(0);
                                    } else if (key === 'R') {
                                        getVideoList(0, 'R');
                                    } else {
                                        getVideoList(0, `${key}`);
                                    }
                                }}
                            />
                            <div className="search-container">
                                <Input.Search
                                    placeholder="搜索视频"
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={handleSearch}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='user-show-container'>
                    <div className='user-info'>
                        <div className='user-avatar'>
                            <Avatar size={80} icon={<UserOutlined />} />
                        </div>
                        <div className='user-details'>
                            <h2 className='username'>@{videoList[0]?.accountUsername || '用户名'}</h2>
                            <div className='user-stats'>
                                <div className='stat-item'>
                                    <div className='stat-value'>{userInfo['worksNum']}</div>
                                    <div className='stat-label'>作品</div>
                                </div>
                                <div className='stat-item'>
                                    <div className='stat-value'>{userInfo['likesNum']}</div>
                                    <div className='stat-label'>获赞</div>
                                </div>
                                {/* <div className='stat-item'>
                                    <div className='stat-value'>0</div>
                                    <div className='stat-label'>粉丝</div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <Tabs
                        defaultActiveKey="works"
                        items={[
                            { key: 'works', label: '作品' },
                            { key: 'likes', label: '喜欢' },
                            { key: 'collected', label: '收藏' },
                        ]}
                        onChange={onTabChange}
                    />
                </div>
            )}
            
            <Spin spinning={loading} tip="加载中">
                {videoList.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无视频数据"
                        style={{ margin: '40px 0' }}
                    />
                ) : (
                    <Row gutter={[24, 24]}>  {/* 增加栅格间距 */}
                        {videoList.map((video, index) => (
                            <Col
                                key={index}
                                xs={24}
                                sm={12}
                                md={12}  
                                lg={8}   
                                xl={6}   
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
                                                        <span className="stat"><HeartOutlined />{video.likeCount}</span>
                                                        <span className="stat"><StarOutlined />{video.favoriteCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="video-duration">{ formatDuration(video.duration) }</div>
                                            {!isHom && (
                                                <div className="video-tags-overlay">
                                                    {video.tags === 0 && <span className="tag">AI生成</span>}
                                                </div>
                                            )}
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
