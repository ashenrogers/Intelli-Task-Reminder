import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteTask } from "../../actions/task";
import { moveToRecycleBin } from "../../actions/task";

const TaskItem = ({
  deleteTask,
  task: { _id, due_at, time, date, description, completed, toBeReminded, priority, category }
}) => {
  return (
    <div className="task">
      <p className="my-1"><b><h2>Description:</h2></b> {description}</p>
      <p className="task-date">
        <b>Created on:</b> <Moment format="DD/MM/YYYY">{date}</Moment>
      </p>
      <p>
        <b>Due by:</b> <Moment format="DD/MM/YYYY">{due_at}</Moment> at {time}
      </p>
      <p>
        <b>Priority:</b> <span className={`priority-${priority.toLowerCase()}`}>{priority}</span>
      </p>
      <p>
        <b>Category:</b> {category}
      </p>
      <p>
        <b>Status:</b> {completed ? "Completed ✅" : "Pending ⏳"}
      </p>
      <p>
        <b>Reminder:</b> {toBeReminded ? "Yes 🔔" : "No ❌"}
      </p>
      <div>
        {!completed && (
          <Link to={`/edit-task/${_id}`} className="btn btn-primary">
            Update
          </Link>
        )}
        <button className="btn btn-danger" onClick={() => moveToRecycleBin(_id)}>
         Delete 🗑️
        </button>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteTask, moveToRecycleBin })(TaskItem);

