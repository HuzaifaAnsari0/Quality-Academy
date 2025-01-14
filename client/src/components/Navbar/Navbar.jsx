import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/svgs/Quality-Academy.svg";
import userIcon from "../../assets/images/catLogo.png";
import notification from "../../assets/svgs/Home/notification.svg"; 
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRequests, setAdminRequests] = useState(0);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking a token in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      // Fetch user data to check if the user is an admin
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await response.json();
          if (userData.role === 1) {
            setIsAdmin(true);
            fetchAdminRequests();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }

    // Add event listener to detect clicks outside the menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAdminRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pending-resources`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      const show = data.filter(items => items.category.toLowerCase() !== 'quiz');
      setAdminRequests(show.length); // Assuming the response is an array of requests
    } catch (error) {
      console.error("Error fetching admin requests:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <div className="nav-container" ref={menuRef}>
      <div className="logo">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>

      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation Links */}
      <ul className={`list ${isMenuOpen ? "active" : ""}`}>
        <Link to="/"><li>Home</li></Link>
        <Link to="/resources"><li>Resources</li></Link>
        <Link to="/quizzes/create"><li>Create Questionnaire</li></Link>
        {isLoggedIn && <Link to="#" onClick={handleLogout} className=""><li>Logout</li></Link>}
      </ul> 

      {/* Call to Action Buttons */}
      <div className="cta">
        {isLoggedIn ? (
          <div className="user-section">
            {isAdmin && (
              <div className="admin-icon-container">
                <Link to="/admin/requests">
                  <img src={notification} alt="Admin Icon" className="admin-icon" />
                  {adminRequests > 0 && <span className="admin-requests-badge">{adminRequests}</span>}
                </Link>
              </div>
            )}
            <Link to="/user"><img src={userIcon} alt="User Icon" className="user-icon" /></Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-decoration-none"><button className="btn-login">Login</button></Link>
            <Link to="/signup" className="text-decoration-none"><button className="btn-signup">Signup</button></Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;