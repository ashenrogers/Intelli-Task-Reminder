import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccountAndProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardEdit from "./DashboardEdit";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './Dashboard.css';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  task: { tasks },
  deleteAccountAndProfile
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  // Calculate completed and incomplete tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const data = [
    { name: "Completed", value: completedTasks },
    { name: "Incomplete", value: incompleteTasks }
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  // Calculate profile completion percentage (example logic)
  const profileProgress = profile ? 80 : 0; // Example value, adjust based on your requirements

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && profile === null) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back, {user && user.name}</p>
        </div>
        <div className="user-avatar">
          {user && getInitials(user.name)}
        </div>
      </div>

      {profile !== null ? (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>Task Overview</h2>
              <Link to="/tasks" className="card-action">
                View All <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={data} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {data.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="chart-stat">
                <div className="total">{tasks.length}</div>
                <div className="label">Total Tasks</div>
              </div>
            </div>
            
            <div className="task-summary">
              <div className="summary-item">
                <div className="summary-value completed">{completedTasks}</div>
                <div className="summary-label">Completed</div>
              </div>
              <div className="summary-item">
                <div className="summary-value incomplete">{incompleteTasks}</div>
                <div className="summary-label">Incomplete</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{completionPercentage}%</div>
                <div className="summary-label">Completion Rate</div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>Profile</h2>
              <Link to="/edit-profile" className="card-action">
                Edit <i className="fas fa-pen"></i>
              </Link>
            </div>
            
            <div className="profile-progress">
              <div className="progress-bar" style={{ width: `${profileProgress}%` }}></div>
            </div>
            <div className="profile-status">
              <span>Profile completion</span>
              <span>{profileProgress}%</span>
            </div>
            
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/add-task" className="btn btn-primary">
                  <i className="fas fa-plus"></i> New Task
                </Link>
                <Link to="/edit-profile" className="btn btn-outline">
                  <i className="fas fa-user-edit"></i> Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    deleteAccountAndProfile();
                  }
                }}
              >
                <i className="fas fa-trash-alt"></i> Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-profile-container">
          <p>You haven't set up your profile yet. Tell us more about yourself to get started.</p>
          <Link to="/create-profile" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccountAndProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  task: state.task
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccountAndProfile })(Dashboard);