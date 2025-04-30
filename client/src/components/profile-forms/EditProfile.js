import React, { useState, Fragment, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";
import "./ProfileForms.css";

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

  const [touched, setTouched] = useState({
    location: false,
    age: false,
    bio: false,
    twitter: false,
    facebook: false,
    instagram: false
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile data
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  // Set form data from profile when available
  useEffect(() => {
    if (!loading && profile) {
      const profileData = {
        location: profile.location || "",
        age: profile.age || "",
        bio: profile.bio || "",
        twitter: profile.twitter || "",
        facebook: profile.facebook || "",
        instagram: profile.instagram || ""
      };
      
      setFormData(profileData);
      setOriginalData(profileData);
      
      // If social links exist, display social inputs section
      if (profile.twitter || profile.facebook || profile.instagram) {
        toggleSocialInputs(true);
      }
    }
  }, [loading, profile]);

  // Check if form data has changed from original
  useEffect(() => {
    if (Object.keys(originalData).length > 0) {
      const hasChanged = Object.keys(formData).some(
        key => formData[key] !== originalData[key]
      );
      setIsDataChanged(hasChanged);
    }
  }, [formData, originalData]);

  // Validate the entire form whenever formData or errors change
  useEffect(() => {
    const requiredFields = ['location', 'age', 'bio'];
    const hasRequiredFields = requiredFields.every(field => formData[field].trim() !== '');
    const hasNoErrors = Object.values(errors).every(error => error === '');
    
    setIsFormValid(hasRequiredFields && hasNoErrors);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let error = "";

    switch(name) {
      case "age":
        if (!value.trim()) {
          error = "Age is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Age must be a number";
        } else if (parseInt(value) < 13 || parseInt(value) > 120) {
          error = "Age must be between 13 and 120";
        }
        break;
        
      case "location":
        if (!value.trim()) {
          error = "Location is required";
        } else if (value.trim().length < 2) {
          error = "Location must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Location cannot exceed 50 characters";
        }
        break;
        
      case "bio":
        if (!value.trim()) {
          error = "Bio is required";
        } else if (value.trim().length < 10) {
          error = "Bio must be at least 10 characters";
        } else if (value.trim().length > 250) {
          error = "Bio cannot exceed 250 characters";
        }
        break;
        
      case "twitter":
      case "facebook":
      case "instagram":
        if (value && !/^(https?:\/\/)?(www\.)?.+\..+/.test(value)) {
          error = "Enter a valid URL";
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

    // Live validation
    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleBlur = e => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name, formData[name]);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return "";
    return errors[fieldName] ? "is-invalid" : "is-valid";
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(allTouched);
    
    // Final validation of all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (!hasErrors) {
      setIsSaving(true);
      
      try {
        await createProfile(formData, history, true);
        
        // Show success popup
        setSuccessMessage("Profile updated successfully! 🎉");
        setOriginalData({...formData});
        setIsDataChanged(false);
        
        // Hide after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
          history.push("/dashboard");
        }, 2000);
      } catch (error) {
        setSuccessMessage("Failed to update profile. Please try again.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const { location, age, bio, twitter, facebook, instagram } = formData;

  // If still loading profile data
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-form-container">
      {/* Success Message Popup */}
      {successMessage && (
        <div className={`popup-message ${successMessage.includes("Failed") ? "popup-error" : "popup-success"}`}>
          <i className={`fas ${successMessage.includes("Failed") ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
          {successMessage}
        </div>
      )}

      <div className="profile-header">
        <h1>Edit Your Profile</h1>
        <p>Update your information and customize your profile</p>
      </div>

      <form className="profile-form" onSubmit={onSubmit}>
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-group">
            <label htmlFor="age">
              Age <span className="required-asterisk">*</span>
            </label>
            <div className="input-with-icon">
              <i className="fas fa-birthday-cake"></i>
              <input
                type="text"
                id="age"
                className={`form-control ${getFieldStatus("age")}`}
                placeholder="Your age"
                name="age"
                value={age}
                onChange={onChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.age && errors.age && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.age}
              </div>
            )}
            {touched.age && !errors.age && (
              <div className="valid-message">
                <i className="fas fa-check-circle"></i> Looks good!
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Location <span className="required-asterisk">*</span>
            </label>
            <div className="input-with-icon">
              <i className="fas fa-map-marker-alt"></i>
              <input
                type="text"
                id="location"
                className={`form-control ${getFieldStatus("location")}`}
                placeholder="City, Province/State"
                name="location"
                value={location}
                onChange={onChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.location && errors.location && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.location}
              </div>
            )}
            {touched.location && !errors.location && (
              <div className="valid-message">
                <i className="fas fa-check-circle"></i> Looks good!
              </div>
            )}
            <small className="form-text">
              e.g., San Francisco, CA or Toronto, Ontario
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="bio">
              Bio <span className="required-asterisk">*</span>
            </label>
            <div className="textarea-with-counter">
              <textarea
                id="bio"
                className={`form-control ${getFieldStatus("bio")}`}
                placeholder="Tell us about yourself"
                name="bio"
                value={bio}
                onChange={onChange}
                onBlur={handleBlur}
              ></textarea>
              <div className="character-counter">
                {bio.length}/250 characters
                {bio.length > 200 && bio.length <= 250 && (
                  <span className="warning"> (approaching limit)</span>
                )}
                {bio.length > 250 && (
                  <span className="exceeded"> (limit exceeded)</span>
                )}
              </div>
            </div>
            {touched.bio && errors.bio && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.bio}
              </div>
            )}
            {touched.bio && !errors.bio && (
              <div className="valid-message">
                <i className="fas fa-check-circle"></i> Looks good!
              </div>
            )}
            <small className="form-text">Share a brief introduction about yourself</small>
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
                <label htmlFor="twitter">Twitter</label>
                <div className="input-with-icon">
                  <i className="fab fa-twitter"></i>
                  <input
                    type="text"
                    id="twitter"
                    className={`form-control ${getFieldStatus("twitter")}`}
                    placeholder="Twitter URL"
                    name="twitter"
                    value={twitter}
                    onChange={onChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.twitter && errors.twitter && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.twitter}
                  </div>
                )}
              </div>

              <div className="social-input social-facebook">
                <label htmlFor="facebook">Facebook</label>
                <div className="input-with-icon">
                  <i className="fab fa-facebook"></i>
                  <input
                    type="text"
                    id="facebook"
                    className={`form-control ${getFieldStatus("facebook")}`}
                    placeholder="Facebook URL"
                    name="facebook"
                    value={facebook}
                    onChange={onChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.facebook && errors.facebook && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.facebook}
                  </div>
                )}
              </div>

              <div className="social-input social-instagram">
                <label htmlFor="instagram">Instagram</label>
                <div className="input-with-icon">
                  <i className="fab fa-instagram"></i>
                  <input
                    type="text"
                    id="instagram"
                    className={`form-control ${getFieldStatus("instagram")}`}
                    placeholder="Instagram URL"
                    name="instagram"
                    value={instagram}
                    onChange={onChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.instagram && errors.instagram && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.instagram}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <Link className="btn btn-light" to="/dashboard">
            <i className="fas fa-arrow-left"></i> Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isFormValid || !isDataChanged || isSaving}
          >
            {isSaving ? (
              <>
                <div className="button-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            )}
          </button>
        </div>

        {isDataChanged && (
          <div className="unsaved-changes-alert">
            <i className="fas fa-info-circle"></i> You have unsaved changes
          </div>
        )}
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