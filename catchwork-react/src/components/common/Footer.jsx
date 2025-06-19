import React from 'react';
import './Footer.css';
import icon from '../../assets/icon.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">개인정보처리방침</a>
        <a href="#">이용약관</a>
        <span>Copyright © CATCH. All rights reserved.</span>
        <a href="#">문의하기</a>
        <a href="#">기업제휴</a>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
            <img src={icon} height="150px"/>
            <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;