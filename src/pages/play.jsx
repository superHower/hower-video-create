import React, { useEffect, useState, memo, useCallback, useMemo,useRef  } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { post, get } from '../utils/request';
import VideoWatch from '../components/VideoWatch';
import { CheckCircleOutlined, TagsOutlined, HeartOutlined, PlayCircleOutlined, LikeOutlined } from '@ant-design/icons';
import { message } from 'antd';
import '../assets/css/play.css'
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
        <div className="username">{comment.username}</div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-footer">
          <span className="comment-time">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {!comment.parentId && (<Button 
            onClick={() => {
              setReplyingTo(comment.id);
              setShowReplyModal(true); // 显示回复弹窗
            }}
            icon={<LikeOutlined />}
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
    ));

    // const commentTree = useMemo(() => buildCommentTree(commentData), [commentData]);

    // 递归渲染评论及其回复的函数
    const renderComments = (comments) => {
      return comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ));
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    if (error) {
        return <div>加载失败: {error.message}</div>;
    }

    return (
        <div className="container">
            {/* 左半边 - 视频相关 */}
            <div className="left-panel">
                <div className="video-container">
                    <h1 className="video-title">{videoData.title}</h1>
                    <div className="video-wrapper">
                        {videoData && <VideoWatch src={videoData.videoUrl} className="video-player" style={{}} />}
                    </div>
                    <div className="video-actions">
                        <div className="action-item">
                            <PlayCircleOutlined className="text-blue" />
                            <span>播放量: {videoData.playCount}</span>
                        </div>
                        <div className="action-item" onClick={handleLike}>
                            <LikeOutlined className="text-yellow" />
                            <span>{videoData.likeCount}</span>
                        </div>
                        <div className="action-item" onClick={handleFavorite}>
                            <HeartOutlined className="text-red" />
                            <span>{videoData.favoriteCount}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="回复评论"
                open={showReplyModal}
                onOk={() => {
                    if (!replyContent.trim()) {
                        message.error('回复内容不能为空');
                        return;
                    }
                    sendComment({ content: replyContent }, replyingTo);
                    setShowReplyModal(false);
                    setReplyContent('');
                    setReplyingTo(null);
                }}
                onCancel={() => {
                    setShowReplyModal(false);
                    setReplyContent('');
                    setReplyingTo(null);
                }}
            >
                <Input.TextArea
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="请输入回复内容"
                />
            </Modal>
            {/* 右半边 - 评论相关 */}
            <div className="right-panel">
                <div className="comments-section">
                    <h2>评论</h2>
                    <div className="comment-form">
                        <Form onFinish={(values) => sendComment(values, null)}>
                            <Form.Item name="content" className='comment-form-item'>
                                <Input.TextArea rows={2} placeholder="写下你的评论..." />
                            </Form.Item>
                            <div className='send-comment-btn'><Button type="primary" htmlType="submit">提交评论</Button></div>
                        </Form>
                    </div>
                    <div className="comments-list">
                        {commentData && renderComments(commentData)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;