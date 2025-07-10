import React from "react";
import "./Footer.css";
import icon from "../../assets/icon.png";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">개인정보처리방침</a>
        <a href="#">이용약관</a>
        <span>Copyright © CATCH. All rights reserved.</span>
        <Link to="/supportlist" className="highlight">
          문의하기
        </Link>
        <Link to="/corpregister">기업제휴</Link>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
          <img src={icon} height="150px" />
          <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
