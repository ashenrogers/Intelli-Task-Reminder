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

  const [successMessage, setSuccessMessage] = useState("");
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    setFormData({
      location: loading || !profile.location ? "" : profile.location,
      age: loading || !profile.age ? "" : profile.age,
      bio: loading || !profile.bio ? "" : profile.bio,
      twitter: loading || !profile.twitter ? "" : profile.twitter,
      facebook: loading || !profile.facebook ? "" : profile.facebook,
      instagram: loading || !profile.instagram ? "" : profile.instagram
    });
  }, [loading, getCurrentProfile]);

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);

    // Show success popup
    setSuccessMessage("Profile updated successfully! 🎉");

    // Hide after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
      history.push("/dashboard");
    }, 2000);
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      </div>

      <form className="profile-form" onSubmit={e => onSubmit(e)}>
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              id="age"
              className="form-control"
              placeholder="Your age"
              name="age"
              value={age}
              onChange={e => onChange(e)}
            />
            <small className="form-text">How old are you?</small>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              className="form-control"
              placeholder="Your location"
              name="location"
              value={location}
              onChange={e => onChange(e)}
            />
            <small className="form-text">
              City & province suggested (eg. Colombo, Western)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="form-control textarea-control"
              placeholder="Tell us about yourself"
              name="bio"
              value={bio}
              onChange={e => onChange(e)}
            ></textarea>
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
                <i className="fab fa-twitter fa-2x"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Twitter URL"
                  name="twitter"
                  value={twitter}
                  onChange={e => onChange(e)}
                />
              </div>

              <div className="social-input social-facebook">
                <i className="fab fa-facebook fa-2x"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Facebook URL"
                  name="facebook"
                  value={facebook}
                  onChange={e => onChange(e)}
                />
              </div>

              <div className="social-input social-instagram">
                <i className="fab fa-instagram fa-2x"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Instagram URL"
                  name="instagram"
                  value={instagram}
                  onChange={e => onChange(e)}
                />
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