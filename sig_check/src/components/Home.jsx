import { MdDriveFolderUpload } from "react-icons/md";
import BannerImage from "../Assets/BannerImage.png"
// import BannerBackground from "../Assets/home-banner-background.png"

export default function Home(){
    return (
    <div className="home-container">
        <div className="home-banner-container">
            {/* <div className="home-bannerImage-Container">
                <img src={BannerImage} alt="Bck"/> 
            </div> */}
            <div className="home-text-section">
                <h1 className="primary-heading">
                    SIG-CHECK FILE UPLOAD
                </h1>
                <p className="primary-text">
                    Upload your files to get them checked
                    to ensure intergrity in your files.
                </p>
                <button className="secondary-button">
                    Upload Now < MdDriveFolderUpload /> {""}
                </button>
            </div>
            <div className="home-image-section">
                <img src={BannerImage} alt="" />
            </div>
        </div>
    </div>
    );
};

