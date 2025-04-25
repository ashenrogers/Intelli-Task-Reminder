import React, { Fragment } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { updateTask, getTaskById } from "../../actions/task";

class EditTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      due_at: "",
      time: "",
      toBeReminded: "",
      completed: "",
      priority: "",
      category: ""
    };
  }

  componentWillMount() {
    this.props.getTaskById(this.props.match.params.id);
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.Task && this.props.Task.task) {
        this.setState({
          description: this.props.Task.task.description || "",
          due_at: this.props.Task.task.due_at
            ? moment(this.props.Task.task.due_at).format("MM-DD-YYYY")
            : "",
          time: this.props.Task.task.time || "",
          completed: this.props.Task.task.completed ? "true" : "false",
          toBeReminded: this.props.Task.task.toBeReminded ? "true" : "false",
          priority: this.props.Task.task.priority || "",
          category: this.props.Task.task.category || "",
        });
      }
    }, 300);
  }
  

  onSubmit = e => {
    e.preventDefault();
    this.props.updateTask(this.props.Task.task._id, this.state);
    this.setState({ description: "", due_at: "", time: "", priority: "", category: "" });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeDate = date => {
    this.setState({ due_at: moment(date).format("MM-DD-YYYY") });
  };

  render() {
    return (
      <Fragment>
        <h1 className="large text-primary">Edit Task</h1>
        <form className="form" onSubmit={e => this.onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="descr">Description:</label>
            <input
              type="text"
              placeholder="Task Description"
              name="description"
              value={this.state.description}
              onChange={e => this.onChange(e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="due_date">Due Date:</label>
            <DatePicker
              minDate={addDays(new Date(), 1)}
              id="due_date"
              name="due_at"
              value={this.state.due_at}
              onChange={date => this.onChangeDate(date)}
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={this.state.time}
              onChange={e => this.onChange(e)}
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select name="priority" value={this.state.priority} onChange={e => this.onChange(e)}>
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              placeholder="Enter Category"
              name="category"
              value={this.state.category}
              onChange={e => this.onChange(e)}
            />
          </div>

          <div className="form-group">
            <label>Set Reminder:</label>
            <input
              type="radio"
              id="yesR"
              name="toBeReminded"
              value="true"
              checked={this.state.toBeReminded === "true"}
              onChange={e => this.onChange(e)}
            />
            <label htmlFor="yesR">Yes</label>
            <input
              type="radio"
              id="noR"
              name="toBeReminded"
              value="false"
              checked={this.state.toBeReminded === "false"}
              onChange={e => this.onChange(e)}
            />
            <label htmlFor="noR">No</label>
          </div>

          <div className="form-group">
            <label>Status:</label>
            <input
              type="radio"
              id="completed"
              name="completed"
              value="true"
              checked={this.state.completed === "true"}
              onChange={e => this.onChange(e)}
            />
            <label htmlFor="completed">Completed</label>
            <input
              type="radio"
              id="pending"
              name="completed"
              value="false"
              checked={this.state.completed === "false"}
              onChange={e => this.onChange(e)}
            />
            <label htmlFor="pending">Pending</label>
          </div>

          <div>
            <small>
              * Reminder won't be sent if task status is <b>Completed</b>.
            </small>
          </div>

          <input type="submit" className="btn btn-primary my-1" />
          <Link className="btn btn-light my-1" to="/tasks">
          <i className="fas fa-arrow-left"></i> Go Back 
          </Link>
        </form>
      </Fragment>
    );
  }
}

EditTask.propTypes = {
  updateTask: PropTypes.func.isRequired,
  getTaskById: PropTypes.func.isRequired,
  Task: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  Task: state.task
});

export default connect(mapStateToProps, { updateTask, getTaskById })(withRouter(EditTask));
