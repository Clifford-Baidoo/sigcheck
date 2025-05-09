import Logo from "../Assets/Logo.png";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6"; 

export default function Footer(){
    return(
        <div className="footer-wrapper">
        <div className="footer-section-one">
          <div className="footer-logo-container">
            <img src={Logo} alt="" />
          </div>
          <div className="footer-icons">
            <FaXTwitter />
            <FaLinkedin />
            <FaYoutube />
            <FaGithub />
          </div>
        </div>
        <div className="footer-section-two">
          <div className="footer-section-columns">
            <span>244-5333-7783</span>
            <span>baidooclifford56@gmail.com</span>
            <span></span>
          </div>
          <div className="footer-section-columns">
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    )
}