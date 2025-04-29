import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ProfileItem Component
 * Displays basic user profile information with a link to view more details.
 *
 * Props:
 * - profile: {
 *     user: { _id, name },
 *     location
 *   }
 */
const ProfileItem = ({ profile }) => {
  const {
    user: { _id, name },
    location,
  } = profile;

  return (
    <div className="profile bg-light">
      <div>
        <h2>{name}</h2>
        <p className="my-1">
          {location && <span>{location}</span>}
        </p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View User Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileItem;
