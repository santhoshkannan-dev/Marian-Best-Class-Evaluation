'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-premium-container">
      <div className="footer-premium-grid">
        <div className="footer-brand">
          <h3>Marian Best Class</h3>
          <p>
            An advanced evaluation, analytics, and tracking dashboard celebrating classroom collaboration, leadership, and academic excellence.
          </p>
        </div>
        <div className="footer-links-col">
          <h4>Useful Links</h4>
          <div className="footer-links">
            <Link href="/policy">Policy Criteria</Link>
            <Link href="/login">Portal Login</Link>
            <a href="#core-analytics-section">Live Rankings</a>
            <a href="#core-analytics-section">Notice Board</a>
          </div>
        </div>
        <div className="footer-dev">
          <h4>Developed By</h4>
          <div className="footer-dev-info">
            <span className="footer-author">MCA 2025</span><br />
            Santhosh Kannan<br />
            Amal Thomas
          </div>
        </div>
      </div>
      <div className="footer-meta-row">
        <span>&copy; {new Date().getFullYear()} Marian College Kuttikkanam. All rights reserved.</span>
        <span>Version 1.0</span>
      </div>
    </footer>
  );
};
