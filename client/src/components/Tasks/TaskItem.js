import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteTask, moveToRecycleBin } from "../../actions/task";

const TaskItem = ({
  deleteTask,
  moveToRecycleBin,
  task: { _id, due_at, time, date, description, completed, toBeReminded, priority, category }
}) => {
  // ✅ useState must be inside the component
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="task">
      <p className="my-1">
        <b><h2>Description:</h2></b> {description}
      </p>
      <p className="task-date">
        <b>Created on:</b> <Moment format="DD/MM/YYYY">{date}</Moment>
      </p>
      <p>
        <b>Due by:</b> <Moment format="DD/MM/YYYY">{due_at}</Moment> at {time}
      </p>
      <p>
        <b>Priority:</b> <span className={`priority-${priority?.toLowerCase()}`}>{priority}</span>
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
        <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
          Delete 🗑️
        </button>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure?</h2>
            <p>Do you really want to move this task to the Recycle Bin?</p>
            <div className="modal-buttons">
              <button
                className="btn btn-success"
                onClick={() => {
                  moveToRecycleBin(_id);
                  setShowConfirm(false);
                }}
              >
                Yes, Move to Recycle Bin
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  moveToRecycleBin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteTask, moveToRecycleBin })(TaskItem);
