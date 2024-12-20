import React, { useState, useEffect, useRef } from 'react';
import './Resources.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Notification from '../../components/Notification/Notification';
import PermissionPopup from '../../components/PermissionPopup/PermissionPopup';
import line from '../../assets/svgs/Line.svg';
import download from '../../assets/images/download-icon.png';
import filtera from '../../assets/svgs/ascending.svg';
import upload from '../../assets/svgs/upload.svg';
import pd from '../../assets/images/pdf.png';
import excel from '../../assets/images/excel.png';
import docs from '../../assets/images/docs.png';
import jpg from '../../assets/images/jpg.png';
import mp4 from '../../assets/images/mp4.png';
import UploadPopup from '../../subcomponents/UploadResource/Upload-popup';

const fileTypeIcons = {
  pdf: pd,
  xls: excel,
  xlsx: excel,
  doc: docs,
  docx: docs,
  jpg: jpg,
  jpeg: jpg,
  png: jpg,
  gif: 'path/to/image-icon.png',
  mp4: mp4,
  webm: 'path/to/video-icon.png',
  ogg: 'path/to/video-icon.png',
  mp3: 'path/to/audio-icon.png',
  wav: 'path/to/audio-icon.png',
};

const Resources = () => {
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const fileInputRef = useRef(null);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/resources');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        showNotification('Error fetching resources', 'error');
        console.error('Error fetching resources:', error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await response.json();
          if (userData.role === 1) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchResources();
    fetchUserData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
  };

  const closeNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  const handleUploadButtonClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to upload resources', 'error');
      navigate("/login");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      if (!userData.canUpload) {
        setShowPermissionPopup(true);
        return;
      }

      setShowUploadPopup(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      showNotification('An error occurred while checking permissions', 'error');
    }
  };

  const handleRequestPermission = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/request-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showNotification('Permission request sent successfully', 'success');
        setShowPermissionPopup(false);
      } else {
        showNotification('Failed to send permission request', 'error');
      }
    } catch (error) {
      console.error('Error sending permission request:', error);
      showNotification('An error occurred while sending permission request', 'error');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleTitleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!file || !title) {
      showNotification('Please select a file and enter a title', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        showNotification('File uploaded successfully and pending for review', 'success');
        const updatedResources = await fetch('http://localhost:5000/resources');
        const data = await updatedResources.json();
        setResources(data);
        setShowUploadPopup(false);
        setTitle('');
        setFile(null);
      } else {
        showNotification('File upload failed', 'error');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      showNotification('An error occurred during file upload', 'error');
    }
  };

  const handleSort = () => {
    const sortedResources = [...resources].sort((a, b) => {
      if (isAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setResources(sortedResources);
    setIsAscending(!isAscending);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/resources/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        showNotification('Resource deleted successfully', 'success');
        const updatedResources = await fetch('http://localhost:5000/resources');
        const data = await updatedResources.json();
        setResources(data);
      } else {
        showNotification('Resource deletion failed', 'error');
      }
    } catch (error) {
      console.error('Error during resource deletion:', error);
      showNotification('An error occurred during resource deletion', 'error');
    }
  };

  const renderPreview = (resource) => {
    const fileExtension = resource.imageUrl.split('.').pop().toLowerCase();

    // Default to showing the file type icon if no specific preview is available
    const fileTypeIcon = fileTypeIcons[fileExtension] || 'path/to/default-icon.png';
    return <img src={fileTypeIcon} alt={resource.title} />;
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={closeNotification}
      />
      <div className="heading-resources">
        <h1 className="heading-resources-text">Elevate your knowledge with Our Resources</h1>
        <img className='resources-line' src={line} alt="Line" />
        <p className="heading-p">One solution for your Learning Preparation</p>
      </div>
      <div className="resources">
        <div className="search-filter">
          <input
            className="resources-search"
            type="text"
            placeholder="Search Resources"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="resource-button">
            <button
              className="upload"
              onClick={handleUploadButtonClick}
            >
              <img src={upload} alt="Upload" />
            </button>
            <button className="filter" onClick={handleSort}>
              <img src={filtera} alt="Filter" />
            </button>
          </div>
        </div>

        {showUploadPopup && (
          <UploadPopup
            file={file}
            setFile={setFile}
            title={title}
            setTitle={setTitle}
            handleFileChange={handleFileChange}
            handleTitleSubmit={handleTitleSubmit}
            setShowUploadPopup={setShowUploadPopup}
          />
        )}

        <div className="resource-grid">
          {filteredResources.map((resource) => (
            <div key={resource._id}>
              {renderPreview(resource)}
              <div className='title-resources'>
                <h3 className='title-resource-h3'>{resource.title}</h3>
                <div className="download-resources">
                  <img
                    className="download-btn"
                    src={download}
                    alt="Download"
                    onClick={() => window.open(resource.imageUrl, '_blank')}
                  />
                  {isAdmin && <button className='delete-btn-resource' onClick={() => handleDelete(resource._id)}>Delete</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPermissionPopup && (
        <PermissionPopup
          onRequestPermission={handleRequestPermission}
          onClose={() => setShowPermissionPopup(false)}
        />
      )}
      <Footer />
    </>
  );
};

export default Resources;