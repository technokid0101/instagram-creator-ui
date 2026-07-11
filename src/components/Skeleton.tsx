import React from 'react';
import './Skeleton.css';

const Skeleton = () => {
    return (
        <div className="skeleton-wrapper">
            <div className="skeleton-line" style={{ width: '80%' }}></div>
            <div className="skeleton-line" style={{ width: '90%' }}></div>
            <div className="skeleton-line" style={{ width: '85%' }}></div>
            <div className="skeleton-line" style={{ width: '70%' }}></div>
        </div>
    );
};

export default Skeleton;