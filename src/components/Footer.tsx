import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/baselarafat" target="_blank" rel="noreferrer">
          <GitHubIcon />
        </a>
        <a href="https://www.linkedin.com/in/basil-arafat/" target="_blank" rel="noreferrer">
          <LinkedInIcon />
        </a>
      </div>
      <p>
        A portfolio designed & built by Basil Arafat with <span role="img" aria-label="love">💜</span>
      </p>
    </footer>
  );
}

export default Footer;