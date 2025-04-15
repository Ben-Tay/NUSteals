import React, { useState, useEffect } from "react";
import "./StudentStyle.css";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const API_URL = "https://nusteals-express.onrender.com"; // Replace with your API URL

const StudentProfile = () => {
  const navigate = useNavigate();
  
  // State variables for the profile
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [profilePicture, setProfilePicture] = useState(""); // Stored URL in database
  const [previewUrl, setPreviewUrl] = useState(""); // Temporary URL for preview
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.uid;

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch user data");
          setIsLoading(false);
          return;
        }

        const userData = await response.json();
        setUser(userData);
        setUsername(userData.name);
        setEmail(userData.email);
        setProfilePicture(userData.photo || ""); // Set the stored URL
        setPreviewUrl(userData.photo || ""); // Initialize preview with stored URL
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle file to URL conversion
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert file to URL string
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Update preview with base64 URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !user) {
      setError("Not authenticated");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: user.password,
          role: user.role,
          address: user.address || "",
          photo: previewUrl // Save the preview URL to database
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const updatedUser = await response.json();
      setUser(updatedUser);
      setUsername(updatedUser.name);
      setEmail(updatedUser.email);
      setProfilePicture(updatedUser.photo || ""); // Update stored URL
      setPreviewUrl(updatedUser.photo || ""); // Update preview to match stored URL
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div>
        {/* Profile Picture */}
        <div className="profile-picture-container">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">
              <span>{username ? username[0].toUpperCase() : "?"}</span>
            </div>
          )}
        </div>
        <label className="upload-button">
          Upload Profile Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Username */}
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      {/* School Email */}
      <div>
        <label>School Email</label>
        <input type="email" value={email} readOnly />
        <p>Your school email cannot be changed.</p>
      </div>

      {/* Update Button */}
      <button onClick={handleUpdateProfile}>Update Profile</button>

      {/* Display any error messages */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StudentProfile;