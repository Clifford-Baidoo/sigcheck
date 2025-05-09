import { MdDriveFolderUpload } from "react-icons/md";
import BannerImage from "../Assets/BannerImage.png";
import { useState, useRef } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/verify-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setUploadSuccess(true); // Set upload success on successful response
      setTimeout(() => setUploadSuccess(false), 3000); // Hide after 3 seconds
    } catch (error) {
      setResult({ status: 'Uploaded', message: `File has been uploaded` });
    }
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
            SIG-CHECK FILE UPLOAD
          </h1>
          <p className="primary-text">
            Upload your files to get them checked
            to ensure integrity in your files.
          </p>
          <button className="secondary-button" onClick={handleButtonClick}>
            Upload Now <MdDriveFolderUpload /> {""}
          </button>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          {uploadSuccess && (
            <div
              className="upload-success-box"
              style={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: 'rgba(0, 128, 0, 0.1)',
                border: '1px solid green',
                borderRadius: '5px',
                color: 'green',
                textAlign: 'center',
              }}
            >
              File uploaded successfully!
            </div>
          )}
          {result && (
            <div className="result-section" style={{ marginTop: '20px' }}>
              <p style={{ color: result.status === 'verified' ? 'green' : 'red' }}>
                status: {result.status}
              </p>
              <p style={{ color: result.status === 'verified' ? 'green' : 'red' }}>
                message: {result.message}
              </p>
            </div>
          )}
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
}