import React from 'react';
import './Banner.css';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  return (
    <section className="error-banner">
      <p>{message}</p>
    </section>
  );
};

export default ErrorBanner;