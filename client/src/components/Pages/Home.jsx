import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>
            The Unified Platform for <span className="hero-accent">Landlords</span> and <span className="hero-accent">Tenants</span>
          </h1>
          <div className="hero-ctas">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="all-companies-section placeholder-card">
          <h2>Dashboard Overview</h2>
          <p>This Component Wraps Around All Your Other Components.</p>
        </section>
      </div>
    </div>
  );
};

export default Home;
