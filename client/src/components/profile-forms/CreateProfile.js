import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    age: "",
    bio: "",
    twitter: "",
    facebook: "",
    instagram: ""
  });

  const [errors, setErrors] = useState({});
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const { location, age, bio, twitter, facebook, instagram } = formData;

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
        if (!value) {
          error = "Location is required";
        } else if (value.length < 2) {
          error = "Location must be at least 2 characters";
        } else if (value.length > 50) {
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
        if (
          value &&
          !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
            value
          )
        ) {
          error = "Please enter a valid URL";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        formIsValid = false;
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return formIsValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedData = { ...formData };

      ["twitter", "facebook", "instagram"].forEach((field) => {
        if (formattedData[field] && !formattedData[field].match(/^https?:\/\//)) {
          formattedData[field] = `https://${formattedData[field]}`;
        }
      });

      createProfile(formattedData, () => navigate("/dashboard"));
    } else {
      const firstErrorField = document.querySelector(".form-group small[style*='color: red']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Tell us more about yourself</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Age"
            name="age"
            value={age}
            onChange={onChange}
            className={errors.age ? "is-invalid" : ""}
          />
          <small className="form-text">Age</small>
          {errors.age && <small style={{ color: "red" }}>{errors.age}</small>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location *"
            name="location"
            value={location}
            onChange={onChange}
            className={errors.location ? "is-invalid" : ""}
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
            className={errors.bio ? "is-invalid" : ""}
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
                className={errors.twitter ? "is-invalid" : ""}
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
                className={errors.facebook ? "is-invalid" : ""}
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
                className={errors.instagram ? "is-invalid" : ""}
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

export default connect(null, { createProfile })(CreateProfile);
