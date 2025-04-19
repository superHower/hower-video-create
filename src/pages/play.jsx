import React, { useEffect, useState, memo, useRef } from 'react';
import { Form, Button, Input, Drawer, message, Avatar } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { post, get } from '../utils/request';
import VideoWatch from '../components/VideoWatch';
import { 
    CommentOutlined, 
    HeartOutlined, 
    PlayCircleOutlined, 
    LikeOutlined,
    ShareAltOutlined,
    UserOutlined
} from '@ant-design/icons';
import '../assets/css/play.css';
import { API_URL } from '../utils/inedx';
import io from 'socket.io-client';

const Play = () => {
    const [searchParams] = useSearchParams();
    const [videoData, setVideoData] = useState(null);
    const [commentData, setCommentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showCommentDrawer, setShowCommentDrawer] = useState(false);

    const socketRef = useRef(null);
    const id = parseInt(searchParams.get('id'));

    const fetchVideoData = async () => {
        try {
            const videoResponse = await get(`/admin/video/${id}`);
            setVideoData(videoResponse);
        } catch (err) {setError(err);
        } finally {setLoading(false);
        }
    };

    // 建立WebSocket连接
    useEffect(() => {
        let isMounted = true;
        
        // 初始化数据获取和WebSocket连接
        const initialize = async () => {
            try {
                await fetchVideoData();
                const commentResponse = await post('/admin/video/comment/list', { videoId: id });
                // 构建评论树
                const commentMap = new Map();
                const datatree = [];
              
                commentResponse.result.data.forEach(comment => {// 第一次遍历，将所有评论存储到映射中
                  comment.replies = [];
                  commentMap.set(comment.id, comment);
                });
                commentResponse.result.data.forEach(comment => {
                  if (comment.parentId) {
                    const parentComment = commentMap.get(comment.parentId);
                    if (parentComment) {
                      parentComment.replies.push(comment);
                    }
                  } else {
                      datatree.push(comment);
                  }
                });
        
            
                console.log("评论树：", datatree)
                setCommentData(datatree);

                // 创建新socket连接
                const newSocket = io(API_URL, {
                    query: { videoId: id },
                    transports: ['websocket']
                });

                newSocket.on('connect', () => {
                    if (isMounted) {
                        console.log('WebSocket connected');
                        socketRef.current = newSocket;
                    }
                });

                newSocket.on('new-comment', (newComment) => {
                    console.log('新评论:', newComment);
                  setCommentData(prev => {
                    // 处理嵌套回复
                    if (newComment.parentId) {
                      const updated = prev.map(comment => 
                        comment.id === newComment.parentId 
                          ? { ...comment, replies: [...comment.replies, newComment] }
                          : comment
                      );
                      return updated;
                    }
                    return [...prev, newComment];
                  });
                });

            } catch (err) {
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initialize();

        // 清理函数
        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [id]);

    const handleFavorite = async () => {
        try {
            const response = await get(`/admin/video/${id}/favorite`);
            fetchVideoData();
            message.success(response);
        } catch (err) {
            setError(err);
        }
    };

    const handleLike = async () => {
        try {
            const response = await get(`/admin/video/${id}/like`);
            fetchVideoData();
            message.success(response);
        } catch (err) {
            setError(err);
        }
    };

    const sendComment = async (values, pid) => {
        try {
            await post('/admin/video/comment', {
                videoId: id,
                content: values.content,
                parentId: pid || null
            });
            message.success('评论成功');
        } catch (err) {
            message.error('评论失败');
        }
    }
    const Comment = memo(({ comment }) => (
        <div className="comment-item">
            <Avatar icon={<UserOutlined />} />
            <div className="comment-content-wrapper">
                <div className="username">{comment.username}</div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-footer">
                    <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {!comment.parentId && (
                        <Button 
                            type="text"
                            onClick={() => {
                                setReplyingTo(comment.id);
                                setShowReplyModal(true);
                            }}
                            size='small'
                        >回复</Button>
                    )}
                </div>
                {comment.replies?.length > 0 && (
                    <div className="comment-replies">
                        {comment.replies.map((reply) => (
                            <Comment key={reply.id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    ));

    // Add the missing renderComments function
    const renderComments = (comments) => {
        return comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
        ));
    };

    return (
        <div className="douyin-container">
            <div className="video-section">
                <div className="side"></div>
                {videoData && <VideoWatch src={videoData.videoUrl} className="video-player" style={{}} />}
                <div className="side"></div>
            </div>

            <div className="action-bar">
                <div className="action-item" onClick={handleLike}>
                    <LikeOutlined />
                    <span className="action-count">{videoData?.likeCount || 0}</span>
                </div>
                <div className="action-item" onClick={handleFavorite}>
                    <HeartOutlined />
                    <span className="action-count">{videoData?.favoriteCount || 0}</span>
                </div>
                <div className="action-item" onClick={() => setShowCommentDrawer(true)}>
                    <CommentOutlined />
                    <span className="action-count">{commentData?.length || 0}</span>
                </div>
                <div className="action-item">
                    <ShareAltOutlined />
                    <span className="action-count">分享</span>
                </div>
            </div>

            <div className='video-desc'>
                <div className='author-info'>
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div className='author-detail'>
                        <div className='author-name'>{videoData?.username || '用户名'}</div>
                        <div className='publish-time'>{new Date(videoData?.createTime).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className='video-info-content'>
                    <div className='video-desc-title'>
                        {videoData?.title}
                    </div>
                    <div className='video-desc-content'>
                        {videoData?.description}
                    </div>
                    <div className='video-tags'>
                        {videoData?.tags === 0 && <span className='tag'>AI生成</span>}
                        <span className='tag'>视频</span>
                    </div>
                </div>
            </div>

            <Drawer
                title="评论"
                placement="right"
                width={400}
                onClose={() => setShowCommentDrawer(false)}
                open={showCommentDrawer}
                className="comment-drawer"
            >
                <div className="comments-section">
                    <div className="comment-form">
                        <Form onFinish={(values) => sendComment(values, null)}>
                            <Form.Item name="content" className="comment-form-item">
                                <Input.TextArea 
                                    rows={3} 
                                    placeholder="写下你的评论..." 
                                    bordered={false}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" className="submit-btn">
                                发送
                            </Button>
                        </Form>
                    </div>
                    <div className="comments-list">
                        {commentData && renderComments(commentData)}
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default Play;