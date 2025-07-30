import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mandiData from "../data/maharashtra-mandi-full.json";
import { FaTachometerAlt, FaCloudSun, FaStore, FaLandmark, FaCog, } from "react-icons/fa";
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
  const navigate = useNavigate();

  const districts = Array.from(
    new Set(mandiData.map(item => item.District).filter(Boolean))
  ).sort();
  console.log("Loaded districts from JSON:", districts);

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
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setUserData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageURL = userData.profileImage;
      // Upload image to Cloudinary if a new one is selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "kisan_unsigned"); // preset
        formData.append("cloud_name", "dgve1t8bu"); // cloud name

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dgve1t8bu/image/upload",
          formData
        );
        imageURL = res.data.secure_url; // Get the uploaded image URL
      }

      const updatedData = {
        ...userData,
        profileImage: imageURL,
      };

      await setDoc(doc(db, "users", userId), updatedData);
      setUserData(updatedData);
      setSelectedImage(null);

      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error uploading to Cloudinary or saving profile:", err);
      toast.error("Something went wrong, Check console for details.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-logo">
          <img
            src="src/assets/Hd Logo normal.png"
            alt="Logo"
            className="logo-img"
          />
        </div>
        <nav className="profile-icons">
          <Link to="/dashboard" data-label="Dashboard"><FaTachometerAlt /></Link>
          <Link to="/weather" data-label="Weather"><FaCloudSun /></Link>
          <Link to="/MandiPrices" data-label="Mandi Prices"><FaStore /></Link>
          <Link to="/GovSchemes" data-label="Schemes"><FaLandmark /></Link>
          <Link to="/userprofile" data-label="Profile"><FaCog className="active" /></Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="profile-pic">
            <label htmlFor="profileImage" className="profile-circle">
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
              ) : userData.profileImage ? (
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
              key={selectedImage ? selectedImage.name : ""}
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

          {/* Button Row */}
          <div className="button-row">
            <button type="submit">Save Changes</button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
};

export default UserProfile;
