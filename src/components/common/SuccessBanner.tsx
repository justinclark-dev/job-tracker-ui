import React from 'react';
import './Banner.css';

interface SuccessBannerProps {
  message: string;
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({ message }) => {
  return (
    <section className="success-banner">
      <p>{message}</p>
    </section>
  );
};

export default SuccessBanner;