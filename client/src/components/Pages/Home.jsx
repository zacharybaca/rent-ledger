import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>
            <span className="hero-accent">The Unified Platform for Landlords and Tenants</span>
          </h1>
        </div>
      </section>

      <div className="page-content">
        <section className="all-companies-section">
          <h2>This Component Wraps Around All Your Other Components</h2>
        </section>
      </div>
    </div>
  );
};

export default Home;
