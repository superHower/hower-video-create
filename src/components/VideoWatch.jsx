import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Card } from 'antd';


const VideoWatch = ({
  src,
  className,
  style
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef();

  // 初始化播放器
  useEffect(() => {
    if (!videoRef.current) return;

    // 合并默认配置和自定义配置
    const mergedOptions = {
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: '16:9', // 固定宽高比
      preload: 'auto',
      sources: Array.isArray(src) ? src : [],
    };

    // 创建播放器实例
    playerRef.current = videojs(videoRef.current, mergedOptions, () => {
      console.log('Player is ready');
    });

    // 单独处理字符串类型的 src
    if (typeof src === 'string') {
      playerRef.current.src(src);
    }

    return () => {
      // 销毁播放器
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  // 监听 src 变化
  useEffect(() => {
    if (playerRef.current) {
      if (typeof src === 'string') {
        playerRef.current.src(src);
      } else {
        playerRef.current.src(src);
      }
    }
  }, [src]);

  return (
    <div
      className={className}
      style={{
        borderRadius: '8px',
        ...style
      }}
      styles={{
        body: {
          padding: 0
        }
      }}
    >
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          style={{
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

export default VideoWatch;