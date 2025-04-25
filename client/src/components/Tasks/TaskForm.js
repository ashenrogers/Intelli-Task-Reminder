import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskForm.css"; // Import the new CSS file
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addTask } from "../../actions/task";
import { addDays } from "date-fns";
import moment from "moment";

const TaskForm = ({ addTask }) => {
  const [formData, setFormData] = useState({
    description: "",
    due_at: "",
    time: "",
    toBeReminded: "",
    priority: "Medium",
    category: ""
  });

  const onSubmit = e => {
    e.preventDefault();
    addTask(formData);
    setFormData({
      description: "",
      due_at: "",
      time: "",
      toBeReminded: "",
      priority: "Medium",
      category: ""
    });
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onChangeDate = date => {
    setFormData({ ...formData, due_at: moment(date).format("MM-DD-YYYY") });
  };

  const { description, due_at, time, priority, category } = formData;

  return (
    <div className="task-form-container">
      <h1 className="task-form-title">New Task</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <label htmlFor="descr">Description:</label>
          <input
            type="text"
            id="descr"
            placeholder="Task Description"
            name="description"
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="due_date">Due Date for Task:</label>
          <DatePicker
            minDate={addDays(new Date(), 1)}
            id="due_date"
            name="due_at"
            selected={due_at ? new Date(due_at) : null}
            onChange={date => onChangeDate(date)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label>Set Reminder:</label>
          <div>
            <input
              type="radio"
              id="yes"
              name="toBeReminded"
              value="true"
              onChange={e => onChange(e)}
            />
            <label htmlFor="yes" className="radio-label">Yes</label>
            <input
              type="radio"
              id="no"
              name="toBeReminded"
              value="false"
              onChange={e => onChange(e)}
            />
            <label htmlFor="no" className="radio-label">No</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select id="priority" name="priority" value={priority} onChange={e => onChange(e)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" value={category} onChange={e => onChange(e)}>
            <option value="">Select a Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
          </select>
        </div>
        <input type="submit" className="btn btn-dark" value="Submit" />
        <Link className="btn go-back" to="/tasks"> 
          <i className="fas fa-arrow-left"></i> Go Back 
        </Link>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  addTask: PropTypes.func.isRequired
};

export default connect(null, { addTask })(TaskForm);