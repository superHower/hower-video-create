import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Card } from 'antd';


const VideoPlayer = ({
  src,
  options,
  className,
  style,
  onFirstFrame
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef();

  // 初始化播放器
  useEffect(() => {
    if (!videoRef.current) return;

    const mergedOptions = {
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      sources: Array.isArray(src) ? src : [],
      ...options
    };

    playerRef.current = videojs(videoRef.current, mergedOptions, () => {
      const player = playerRef.current;

      // 监听元数据加载完成事件
      const handleLoadedMetadata = () => {
        // 设置当前时间为0确保获取第一帧
        player.currentTime(0);
        
        // 监听跳转完成事件
        player.one('seeked', () => {
          const videoElement = player.el().querySelector('video');
          if (!videoElement) return;

          // 创建画布
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;

          try {
            // 绘制视频帧到画布
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            
            // 调用回调函数传递Base64
            onFirstFrame?.(base64);
          } catch (error) {
            console.error('Error capturing frame:', error);
          }
        });
      };

      player.on('loadedmetadata', handleLoadedMetadata);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  // 监听 src 变化
  useEffect(() => {
    if (playerRef.current) {
      if (typeof src === 'string') {
        playerRef.current.src({ src, type: 'video/mp4' });
      } else {
        playerRef.current.src(src);
      }
    }
  }, [src]);

  return (
    <Card
      className={className}
      style={{ padding: '10px', borderRadius: '8px', ...style }}
      styles={{ body: { padding: 0 } }}
    >
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          crossOrigin="anonymous" // 重要：处理跨域问题
          style={{ borderRadius: '6px', overflow: 'hidden' }}
        />
      </div>
    </Card>
  );
};
export default VideoPlayer;