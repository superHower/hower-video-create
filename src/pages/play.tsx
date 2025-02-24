import React, {useEffect, useState} from 'react';
import { Form, Button } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { post, get } from '../utils/request';
import VideoWatch from '../components/VideoWatch';

const Play: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [videoData, setVideoData] = useState(null);
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchVideoData = async () => {
      if (id) {
        const response:any = await get(`/admin/video/${id}`);
        setVideoData(response)
      }
    };

    fetchVideoData();
    console.log("输出", videoData)
  }, [id]);

  return (
    <div>
      <h1>播放视频 ID: {id}</h1>
      {videoData && <VideoWatch src={videoData.videoUrl} className="video-player" style={{ width: '100%', height: '100%' }} />}
      </div>
  );
};

export default Play;