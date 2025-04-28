import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import './profiles.css'; // Import the CSS file


const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

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
        <div className="profiles-wrapper">
          <header className="profiles-header">
            <h1 className="title-primary">🌟 Discover Professionals</h1>
            <p className="subtitle">Find users by their name, skills, or location and grow your network!</p>
          </header>

          <section className="search-section">
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔎 Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </section>
          <br></br>

          <section className="profiles-grid">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🚫</div>
                <h2 className="empty-title">No Users Found</h2>
                <p className="empty-text">Try using different search terms to find profiles.</p>
              </div>
            )}
          </section>
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
