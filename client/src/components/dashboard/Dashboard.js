import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccountAndProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardEdit from "./DashboardEdit";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

  const data = [
    { name: "Completed", value: completedTasks },
    { name: "Incomplete", value: incompleteTasks }
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">Welcome, {user && user.name}</p>
      {profile !== null ? (
        <Fragment>
          <DashboardEdit />
          
          <div className="chart-container">
            <h2>Task Completion Overview </h2> 
            <h4> Total Tasks= {tasks.length} </h4> 
            <PieChart width={400} height={300}>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccountAndProfile()}>
              Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>Please tell us more about yourself</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
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
  task: state.task // Make sure 'tasks' are inside 'task' in Redux state
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccountAndProfile })(Dashboard);
