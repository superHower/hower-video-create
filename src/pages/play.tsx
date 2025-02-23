// play.tsx
import React from 'react';
import { Form, Button } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';

const Play: React.FC = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');

  return (
    <div>
      <h1>播放视频 ID: {id}</h1>
    </div>
  );
};

export default Play;