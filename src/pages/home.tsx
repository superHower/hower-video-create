import React from 'react';
import VideoList from '../components/VideoList';

const Home = () => {
    return <VideoList getListParams={{ status: 0}} isHome={true}/>;
};

export default Home;