import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Rent<span className="logo-accent">Ledger</span>
          </Link>
          <p className="footer-tagline">
            Property Management, Perfectly Balanced
          </p>
        </div>

        <div className="footer-links-section">
          <div className="footer-column">
            <h4>App</h4>
            <Link to="/">Home</Link>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} RentLedger. All rights reserved.</p>
        <div className="footer-legal">
          <span>Built with the MERN Stack</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
