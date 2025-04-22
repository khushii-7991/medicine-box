import React from 'react';
import './landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <div className="overlay">
                <div className="content">
                    <h1 className="title">Smart Medical System</h1>
                    <p className="tagline">Your health. Our priority.</p>
                    <p className="sub-tagline">Where technology meets care — because your health matters.</p>
                    <div className="buttons">
                        <a href="/login/patient" className="btn btn-patient">Patient Login</a>
                        <a href="/login/doctor" className="btn btn-doctor">Doctor Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing; 