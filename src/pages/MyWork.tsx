import React from 'react';
import VideoList from '../components/VideoList';

const MyWork = () => {
    const { id } = JSON.parse(localStorage.getItem('user'));
    return <VideoList getListParams={{ accountId: id, status: 0 } } isHome={false}/>;
};

export default MyWork;