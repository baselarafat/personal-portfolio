import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import headshot from '../assets/images/headshot.jpeg';

function Main() {
  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={headshot} alt="Basil Arafat Headshot" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/basil-arafat" target="_blank" rel="noreferrer">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/basil-arafat/" target="_blank" rel="noreferrer">
              <LinkedInIcon />
            </a>
          </div>
          <h1>Basil Arafat</h1>
          <p>Software Engineer</p>
          <div className="mobile_social_icons">
            <a href="https://github.com/basil-arafat" target="_blank" rel="noreferrer">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/basil-arafat/" target="_blank" rel="noreferrer">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;