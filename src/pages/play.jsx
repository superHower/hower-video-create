import React, { useEffect, useState, memo  } from 'react';
import { Form, Button, Input } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { post, get } from '../utils/request';
import VideoWatch from '../components/VideoWatch';
import { CheckCircleOutlined, TagsOutlined, HeartOutlined, PlayCircleOutlined, LikeOutlined } from '@ant-design/icons';
import { message } from 'antd';
import '../assets/css/play.css'

const Play = () => {
    const [searchParams] = useSearchParams();
    const [videoData, setVideoData] = useState(null);
    const [commentData, setCommentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const id = parseInt(searchParams.get('id'));

    const fetchVideoData = async () => {
        try {
            const videoResponse = await get(`/admin/video/${id}`);
            setVideoData(videoResponse);
            const commentResponse = await post('/admin/video/comment/list', {
                videoId: id
            });
            let datatree = buildCommentTree(commentResponse.data)
            setCommentData(datatree);
            console.log("输出", datatree, commentResponse.data)
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [id]);

    function buildCommentTree(comments) {
      const commentMap = {};
      const rootComments = [];
  
      // 第一步：将所有评论存入 commentMap 中，并初始化 replies 数组
      comments.forEach(comment => {
          comment.replies = [];
          commentMap[comment.id] = comment;
      });
  
      // 第二步：遍历评论，将子评论添加到其父评论的 replies 数组中
      comments.forEach(comment => {
          const parentId = comment.parentId || null;
          if (parentId === null) {
              // 如果没有父评论 ID，说明是根评论
              rootComments.push(comment);
          } else {
              const parentComment = commentMap[parentId];
              if (parentComment) {
                  // 如果父评论存在，将当前评论添加到父评论的 replies 数组中
                  parentComment.replies.push(comment);
              }
          }
      });
  
      return rootComments;
  }

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

    const sendComment = async (values) => {
        try {
            await post('/admin/video/comment', {
                videoId: id,
                content: values.content
            });
            message.success('评论成功');
            fetchVideoData();
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
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          <span>回复</span>
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

            {/* 右半边 - 评论相关 */}
            <div className="right-panel">
                <div className="comments-section">
                    <h2>评论（{commentData?.length}）</h2>
                    <div className="comment-form">
                        <Form onFinish={sendComment}>
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