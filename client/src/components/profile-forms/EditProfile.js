import React, { useState, Fragment, useEffect } from "react";
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

  const [errors, setErrors] = useState({
    location: "",
    age: "",
    bio: "",
    twitter: "",
    facebook: "",
    instagram: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    setFormData({
      location: loading || !profile.location ? "" : profile.location,
      age: loading || !profile.age ? "" : profile.age,
      bio: loading || !profile.bio ? "" : profile.bio,
      twitter: loading || !profile.social?.twitter ? "" : profile.social.twitter,
      facebook: loading || !profile.social?.facebook ? "" : profile.social.facebook,
      instagram: loading || !profile.social?.instagram ? "" : profile.social.instagram
    });
    
    // Show social inputs if the profile has any social media links
    if (
      !loading &&
      (profile.social?.twitter || profile.social?.facebook || profile.social?.instagram)
    ) {
      toggleSocialInputs(true);
    }
  }, [loading, getCurrentProfile, profile]);

  // Enhanced validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "age":
        if (value && !/^\d+$/.test(value)) {
          error = "Age must be a number";
        } else if (value && (parseInt(value) < 13 || parseInt(value) > 120)) {
          error = "Age must be between 13 and 120";
        }
        break;

      case "location":
        if (value && value.length < 2) {
          error = "Location must be at least 2 characters";
        } else if (value && value.length > 50) {
          error = "Location must be less than 50 characters";
        }
        break;

      case "bio":
        if (value && value.length > 200) {
          error = "Bio must be less than 200 characters";
        }
        break;

      case "twitter":
      case "facebook":
      case "instagram":
        if (value && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(value)) {
          error = "Please enter a valid URL";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  // Validate all fields before submission
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    
    // Check required fields
    if (!location) {
      newErrors.location = "Location is required";
      formIsValid = false;
    } else {
      newErrors.location = validateField("location", location);
      if (newErrors.location) formIsValid = false;
    }

    // Other validations
    if (age) {
      newErrors.age = validateField("age", age);
      if (newErrors.age) formIsValid = false;
    }

    if (bio) {
      newErrors.bio = validateField("bio", bio);
      if (newErrors.bio) formIsValid = false;
    }

    if (twitter) {
      newErrors.twitter = validateField("twitter", twitter);
      if (newErrors.twitter) formIsValid = false;
    }

    if (facebook) {
      newErrors.facebook = validateField("facebook", facebook);
      if (newErrors.facebook) formIsValid = false;
    }

    if (instagram) {
      newErrors.instagram = validateField("instagram", instagram);
      if (newErrors.instagram) formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const onSubmit = e => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (validateForm()) {
      // Format social media URLs to ensure they have http/https
      const formattedData = { ...formData };
      
      ["twitter", "facebook", "instagram"].forEach(field => {
        if (formattedData[field] && !formattedData[field].match(/^https?:\/\//)) {
          formattedData[field] = `https://${formattedData[field]}`;
        }
      });
      
      createProfile(formattedData, history, true);

      // Show success popup
      setSuccessMessage("Profile updated successfully! 🎉");

      // Hide after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        history.push("/dashboard");
      }, 2000);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".form-group small[style*='color: red']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const { location, age, bio, twitter, facebook, instagram } = formData;

  return (
    <div className="edit-profile-container">
      {/* Success Message Popup */}
      {successMessage && (
        <div className="popup-success">
          {successMessage}
        </div>
      )}

      <div className="profile-header">
        <h1>Edit Your Profile</h1>
        <p>Let others know more about you</p>
        <small>* = required field</small>
      </div>

      <form className="profile-form" onSubmit={onSubmit}>
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              id="age"
              className={`form-control ${errors.age ? "is-invalid" : ""}`}
              placeholder="Your age"
              name="age"
              value={age}
              onChange={onChange}
            />
            <small className="form-text">How old are you?</small>
            {errors.age && <small style={{ color: "red" }}>{errors.age}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              placeholder="Your location"
              name="location"
              value={location}
              onChange={onChange}
            />
            <small className="form-text">
              City & province suggested (eg. Colombo, Western)
            </small>
            {errors.location && <small style={{ color: "red" }}>{errors.location}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className={`form-control textarea-control ${errors.bio ? "is-invalid" : ""}`}
              placeholder="Tell us about yourself"
              name="bio"
              value={bio}
              onChange={onChange}
            ></textarea>
            <small className="form-text">Share a brief introduction about yourself (max 200 characters)</small>
            {errors.bio && <small style={{ color: "red" }}>{errors.bio}</small>}
            {!errors.bio && bio && (
              <small className="text-muted">{bio.length}/200 characters</small>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="section-title-container">
            <h2 className="section-title">Social Media Profiles</h2>
            <button
              onClick={() => toggleSocialInputs(!displaySocialInputs)}
              type="button"
              className="btn btn-social"
            >
              <i className={`fas ${displaySocialInputs ? 'fa-minus' : 'fa-plus'}`}></i>
              {displaySocialInputs ? 'Hide Social Links' : 'Add Social Links'}
            </button>
          </div>

          {displaySocialInputs && (
            <div className="social-inputs">
              <div className="social-input social-twitter">
                <i className="fab fa-twitter fa-2x"></i>
                <input
                  type="text"
                  className={`form-control ${errors.twitter ? "is-invalid" : ""}`}
                  placeholder="Twitter URL"
                  name="twitter"
                  value={twitter}
                  onChange={onChange}
                />
                {errors.twitter && <small style={{ color: "red" }}>{errors.twitter}</small>}
              </div>

              <div className="social-input social-facebook">
                <i className="fab fa-facebook fa-2x"></i>
                <input
                  type="text"
                  className={`form-control ${errors.facebook ? "is-invalid" : ""}`}
                  placeholder="Facebook URL"
                  name="facebook"
                  value={facebook}
                  onChange={onChange}
                />
                {errors.facebook && <small style={{ color: "red" }}>{errors.facebook}</small>}
              </div>

              <div className="social-input social-instagram">
                <i className="fab fa-instagram fa-2x"></i>
                <input
                  type="text"
                  className={`form-control ${errors.instagram ? "is-invalid" : ""}`}
                  placeholder="Instagram URL"
                  name="instagram"
                  value={instagram}
                  onChange={onChange}
                />
                {errors.instagram && <small style={{ color: "red" }}>{errors.instagram}</small>}
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <Link className="btn btn-light" to="/dashboard">
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