import React from 'react';
import './Banner.css';

interface InfoBannerProps {
  message: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ message }) => {
  return (
    <section className="info-banner">
      <p>{message}</p>
    </section>
  );
};

export default InfoBanner;