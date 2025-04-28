import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { recoverTask, permanentlyDeleteTask } from '../../actions/task'; // we'll write these actions
import PropTypes from 'prop-types';

const RecycleBin = ({ task: { deletedTasks }, recoverTask, permanentlyDeleteTask }) => {
  return (
    <Fragment>
      <h1 className="large text-danger">Recycle Bin 🗑️</h1>
      {deletedTasks.length > 0 ? (
        <div className="tasks">
          {deletedTasks.map(task => (
            <div key={task._id} className="task-card deleted">
              <h3>{task.description}</h3>
              <button className="btn btn-success" onClick={() => recoverTask(task._id)}>
                Recover ♻️
              </button>
              <button className="btn btn-danger" onClick={() => permanentlyDeleteTask(task._id)}>
                Delete Permanently ❌
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h4>No deleted tasks found.</h4>
      )}
    </Fragment>
  );
};

RecycleBin.propTypes = {
  task: PropTypes.object.isRequired,
  recoverTask: PropTypes.func.isRequired,
  permanentlyDeleteTask: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  task: state.task
});

export default connect(mapStateToProps, { recoverTask, permanentlyDeleteTask })(RecycleBin);
