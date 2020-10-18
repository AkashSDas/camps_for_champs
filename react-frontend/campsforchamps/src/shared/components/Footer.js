import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="contact-info">
        <Link to="/about-us">About us</Link>
        <Link to="/contact-us">Contact us</Link>
      </div>

      <hr />

      <div className="follow">
        <h3>Follow Us</h3>
        <div className="social-media">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-whatsapp"></i>
        </div>
      </div>

      <hr />

      <div className="source-code">
        <h3>Source Code</h3>
        <i className="fab fa-github"></i>
      </div>
    </footer>
  );
};
