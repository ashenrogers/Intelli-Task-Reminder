import React from 'react';
import { Link } from 'react-router-dom';

// ProfileItem component displays individual user profile info
const ProfileItem = ({
  profile: {
    user: { _id, name }, // Destructuring user id and name from the profile prop
    location,            // Destructuring location from the profile prop
  },
}) => {
  return (
    <div className="profile bg-light">
      <div>
        <h2>{name}</h2> {/* Displaying user name */}
        <p className="my-1">
          {location && <span>{location}</span>} {/* Conditionally displaying location if it exists */}
        </p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View User Profile {/* Link to the user's detailed profile page */}
        </Link>
      </div>
    </div>
  );
};

export default ProfileItem; // Exporting the component for use in other parts of the app
