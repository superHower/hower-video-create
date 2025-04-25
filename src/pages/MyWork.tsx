import React from 'react';
import VideoList from '../components/VideoList';
import { useParams, useLocation } from 'react-router-dom';

const MyWork = () => {
    const location = useLocation();
    const userId = location.pathname.split('/').pop();
    const { id } = JSON.parse(localStorage.getItem('user'));
    
    const targetId = userId && userId !== 'my' ? userId : id;
    
    return <VideoList getListParams={{ accountId: targetId, status: 0 }} isHome={false}/>;
};

export default MyWork;