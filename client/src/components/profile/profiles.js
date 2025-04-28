import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import './profiles.css'; // Import the new CSS file

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  // Filter profiles based on search term (name, skill, location)
  const filteredProfiles = profiles.filter((profile) => {
    const nameMatch = profile.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    const skillsMatch = profile.skills && profile.skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return nameMatch || locationMatch || skillsMatch;
  });

  return (
    <Fragment>
      {loading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className="profiles-container">
          <div className="page-header">
            <h1 className="large text-primary">Users</h1>
            <p className="subtitle">Browse and connect with other professionals</p>
          </div>

          <div className="filter-section">
            <input 
              type="text" 
              className="search-box" 
              placeholder="Search users by name, skill or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="profiles-grid">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <div className="empty-state">
                <div className="icon">👥</div>
                <h4>No User Profiles found!</h4>
                <p>Be the first to create a profile and join our community.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
