import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";
import "./EditProfile.css";

const EditProfile = ({
  createProfile,
  getCurrentProfile,
  profile: { profile, loading },
  history
}) => {
  const [formData, setFormData] = useState({
    location: "",
    age: "",
    bio: "",
    twitter: "",
    facebook: "",
    instagram: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  // Once profile is loaded, update the formData once (only if profile exists)
  useEffect(() => {
    if (!loading && profile) {
      setFormData({
        location: profile.location || "",
        age: profile.age || "",
        bio: profile.bio || "",
        twitter: profile.social?.twitter || "",
        facebook: profile.social?.facebook || "",
        instagram: profile.social?.instagram || ""
      });

      if (
        profile.social?.twitter ||
        profile.social?.facebook ||
        profile.social?.instagram
      ) {
        toggleSocialInputs(true);
      }
    }
  }, [loading, profile]);

  const onChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "age":
        if (value && !/^\d+$/.test(value)) error = "Age must be a number";
        else if (value < 13 || value > 120) error = "Age must be between 13 and 120";
        break;
      case "location":
        if (!value) error = "Location is required";
        else if (value.length < 2) error = "Location must be at least 2 characters";
        break;
      case "bio":
        if (value.length > 200) error = "Bio must be less than 200 characters";
        break;
      case "twitter":
      case "facebook":
      case "instagram":
        if (value && !/^https?:\/\/.+$/.test(value))
          error = "Please enter a valid URL (http or https)";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) isValid = false;
      newErrors[field] = error;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = { ...formData };

      ["twitter", "facebook", "instagram"].forEach(field => {
        if (formattedData[field] && !/^https?:\/\//.test(formattedData[field])) {
          formattedData[field] = `https://${formattedData[field]}`;
        }
      });

      createProfile(formattedData, history, true);
      setSuccessMessage("Profile updated successfully! 🎉");

      setTimeout(() => {
        setSuccessMessage("");
        history.push("/dashboard");
      }, 2000);
    }
  };

  const { location, age, bio, twitter, facebook, instagram } = formData;

  return (
    <div className="edit-profile-container">
      {successMessage && <div className="popup-success">{successMessage}</div>}

      <div className="profile-header">
        <h1>Edit Your Profile</h1>
        <p>Let others know more about you</p>
        <small>* = required field</small>
      </div>

      <form className="profile-form" onSubmit={onSubmit}>
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-group">
            <label>Age</label>
            <input
              type="text"
              name="age"
              value={age}
              onChange={onChange}
              className={`form-control ${errors.age ? "is-invalid" : ""}`}
              placeholder="Your age"
            />
            {errors.age && <small style={{ color: "red" }}>{errors.age}</small>}
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={onChange}
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              placeholder="City & province (e.g., Colombo, Western)"
            />
            {errors.location && <small style={{ color: "red" }}>{errors.location}</small>}
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={onChange}
              className={`form-control ${errors.bio ? "is-invalid" : ""}`}
              placeholder="Tell us about yourself"
            />
            {errors.bio && <small style={{ color: "red" }}>{errors.bio}</small>}
            {!errors.bio && bio && (
              <small className="text-muted">{bio.length}/200 characters</small>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Social Media Profiles</h2>
          <button
            type="button"
            className="btn btn-social"
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
          >
            {displaySocialInputs ? "Hide Social Links" : "Add Social Links"}
          </button>

          {displaySocialInputs && (
            <div className="social-inputs">
              {[["twitter", twitter], ["facebook", facebook], ["instagram", instagram]].map(
                ([name, value]) => (
                  <div key={name} className={`social-input social-${name}`}>
                    <i className={`fab fa-${name} fa-2x`}></i>
                    <input
                      type="text"
                      name={name}
                      value={value}
                      onChange={onChange}
                      className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                      placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} URL`}
                    />
                    {errors[name] && <small style={{ color: "red" }}>{errors[name]}</small>}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="button-group">
          <Link to="/dashboard" className="btn btn-light">
            <i className="fas fa-arrow-left"></i> Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-save"></i> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
