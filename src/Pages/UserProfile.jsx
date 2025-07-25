import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCloudSun,
  FaStore,
  FaLandmark,
  FaCog,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    district: "",
    phone: "",
    email: "",
    about: "",
    profileImage: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);

  const districts = ["Beed", "Pune", "Nashik", "Nagpur", "Aurangabad"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData((prev) => ({ ...prev, ...docSnap.data() }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageURL = userData.profileImage;
      if (selectedImage && userId) {
        const storageRef = ref(storage, `profileImages/${userId}`);
        await uploadBytes(storageRef, selectedImage);
        imageURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", userId), {
        ...userData,
        profileImage: imageURL,
      });

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-logo">
          <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
        </div>
        <nav className="profile-icons">
          <Link to="/dashboard"><FaTachometerAlt /></Link>
          <Link to="/weather"><FaCloudSun /></Link>
          <Link to="/MandiPrices"><FaStore /></Link>
          <Link to="/GovSchemes"><FaLandmark /></Link>
          <FaCog className="active" />
        </nav>
      </aside>

      {/* Main Profile Content */}
      <main className="profile-content">
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="profile-pic">
            <label htmlFor="profileImage" className="profile-circle">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt="Profile" />
              ) : (
                <span>Upload</span>
              )}
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Input Grid */}
          <div className="profile-grid">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userData.firstName}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={handleChange}
            />
            <select
              name="district"
              value={userData.district}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              {districts.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="phone"
              placeholder="Mobile No."
              value={userData.phone}
              readOnly
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          {/* Save Button */}
          <button type="submit">Save Changes</button>
        </form>

      </main>
    </div>
  );
};

export default UserProfile;
