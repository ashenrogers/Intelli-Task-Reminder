import React, { useState, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
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

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const { location, age, bio, twitter, facebook, instagram } = formData;

  const validateField = (name, value) => {
    let error = "";

    if (name === "age") {
      if (!/^\d*$/.test(value)) {
        error = "Age must be a number";
      }
    }

    if (name === "location") {
      if (value.length < 2) {
        error = "Location must be at least 2 characters";
      }
    }

    if (name === "bio") {
      if (value.length > 200) {
        error = "Bio must be less than 200 characters";
      }
    }

    if (["twitter", "facebook", "instagram"].includes(name)) {
      if (value && !/^https?:\/\/.+\..+/.test(value)) {
        error = "Enter a valid URL";
      }
    }

    return error;
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Tell us more about yourself</h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Age"
            name="age"
            value={age}
            onChange={onChange}
          />
          <small className="form-text">Age</small>
          {errors.age && <small style={{ color: "red" }}>{errors.age}</small>}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            City & state suggested (eg. Ghaziabad, U.P)
          </small>
          {errors.location && <small style={{ color: "red" }}>{errors.location}</small>}
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={onChange}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
          {errors.bio && <small style={{ color: "red" }}>{errors.bio}</small>}
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={onChange}
              />
              {errors.twitter && <small style={{ color: "red" }}>{errors.twitter}</small>}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={onChange}
              />
              {errors.facebook && <small style={{ color: "red" }}>{errors.facebook}</small>}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={onChange}
              />
              {errors.instagram && <small style={{ color: "red" }}>{errors.instagram}</small>}
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
