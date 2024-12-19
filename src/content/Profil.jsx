import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profilCSS from './Profil.module.css';

function Profil() {
  const [profile, setProfile] = useState({
    name: '',
    nim: '',
    contact: '',
    email: '',
    photo_url: ''
  });
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [photo, setPhoto] = useState(null); // State to store new photo
  const [base64Photo, setBase64Photo] = useState(''); // State for Base64 photo data
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup visibility

  // Retrieve user ID from localStorage
  const userId = localStorage.getItem('userId');
  const userType = parseInt(localStorage.getItem('type'));

const nim_nrp = () => {
  if (userType === 1) {
    return "NRP:";
  } else {
    return "NIM:";
  }
};
  
  
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/profile/${userId}`)
        .then((response) => {
          // Save profile data to state
          setProfile(response.data);
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    } else {
      console.error('User ID not found in localStorage');
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    
    // If a photo is selected, append it to the FormData
    if (photo) {
      formData.append('photo', photo);
    }
  
    formData.append('name', profile.name);
    formData.append('nim', profile.nim);
    formData.append('contact', profile.contact);
    formData.append('email', profile.email);
    formData.append('id', userId);
  
    axios.post('http://localhost:5000/update-profile', formData)
      .then((response) => {
        console.log('Profile updated successfully:', response.data);
        setShowSuccessPopup(true); // Show the success popup
        setIsEditing(false);
        setTimeout(() => {
          setShowSuccessPopup(false); // Hide the popup after 3 seconds
        }, 3000);
      })
      .catch((error) => {
        console.error('Error saving profile data:', error);
      });
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file); // Save file to state if a photo is selected
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Photo(reader.result.split(',')[1]); // Save Base64 string of image
    };
    reader.readAsDataURL(file); // Convert image file to Base64 string
  };

  return (
    <div className={profilCSS.profil}>
      <h1 className={profilCSS.textprofil}>Profile</h1>
      <form className={profilCSS.formprofile}>
      <div className={profilCSS.atas}>
        <label htmlFor="photo">Profile Photo:</label>
        {profile.photo_url && (
          <img src={profile.photo_url} alt="Profile" className={profilCSS.fotoprof} />
        )}
        <br />
        {isEditing && (
          <>
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handlePhotoChange}
              accept="image/*"
            />
            <br />
          </>
        )}
        </div>
        <div className={profilCSS.allinpute}>
          <div className={profilCSS.kiri}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            className={profilCSS.inpute}
            value={profile.name}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <br />

          <label htmlFor="nim">{nim_nrp()}</label>
          <input
            type="text"
            name="nim"
            id="nim"
            className={profilCSS.inpute}
            value={profile.nim}
            onChange={handleChange}
            readOnly
          />
          <br />
          {userType !== 1 && (
              <>
                <label htmlFor="fakultas">Fakultas:</label>
                <input
                  type="text"
                  name="fakultas"
                  id="fakultas"
                  className={profilCSS.inpute}
                  value={profile.fakultas}
                  onChange={handleChange}
                  readOnly
                />
                <br />
              </>
            )}
          <br />
          </div>
          <div className={profilCSS.kanan}>
          {userType !== 1 && (
            <>
              <label htmlFor="prodi">Prodi</label>
                <input
                  type="text"
                  name="prodi"
                  id="prodi"
                  className={profilCSS.inpute}
                  value={profile.prodi}
                  onChange={handleChange}
                  readOnly
                />
              <br />
            </>
          )}
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            name="contact"
            id="contact"
            className={profilCSS.inpute}
            value={profile.contact}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            className={profilCSS.inpute}
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <br />
          </div>
        </div>
      </form>

      {isEditing ? (
        <button onClick={handleSaveClick} className={profilCSS.saveBtn}>Save</button>
      ) : (
        <button onClick={handleEditClick} className={profilCSS.editBtn}>Edit Profile</button>
      )}
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className={profilCSS.successPopup}>
          <p>Profile updated successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)} className={profilCSS.closePopup}></button>
        </div>
      )}
    </div>
  );
}

export default Profil;
