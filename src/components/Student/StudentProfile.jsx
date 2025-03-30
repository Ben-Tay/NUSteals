import React, { useState } from "react";
import "./StudentStyle.css"; // Import the CSS file

const StudentProfile = () => {
  // State variables for the profile
  const [username, setUsername] = useState("JohnDoe123"); // Default username
  const [email] = useState("e1234567@u.nus.edu"); // Registered school email (read-only)
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture file
  const [previewUrl, setPreviewUrl] = useState(null); // Preview URL for the uploaded image

  // Handle profile picture upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Handle profile update (e.g., save changes to the backend)
  const handleUpdateProfile = () => {
    console.log({
      username,
      email,
      profilePicture,
    });
    alert("Profile updated successfully!");
  };

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
    </div>
  );
};

export default StudentProfile;
