import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_TASK,
  GET_TASKS,
  TASK_ERROR,
  UPDATE_TASK,
  DELETE_TASK,
  ADD_TASK,
  MOVE_TO_RECYCLE_BIN,
  RECOVER_TASK,
  PERMANENTLY_DELETE_TASK
} from "./types";

// Move task to recycle bin (soft delete)
export const moveToRecycleBin = (taskId) => dispatch => {
  dispatch({
    type: MOVE_TO_RECYCLE_BIN,
    payload: taskId
  });
};

// Recover task from recycle bin
export const recoverTask = (taskId) => dispatch => {
  dispatch({
    type: RECOVER_TASK,
    payload: taskId
  });
};

// Permanently delete task (hard delete, from backend)
export const permanentlyDeleteTask = (taskId) => async dispatch => {
  try {
    await axios.delete(`/api/tasks/${taskId}`);
    dispatch({
      type: PERMANENTLY_DELETE_TASK,
      payload: taskId
    });
    dispatch(setAlert("Task Permanently Deleted", "success"));
  } catch (error) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
    dispatch(setAlert("Operation Failed", "danger"));
  }
};


//get a single task by id
export const getTaskById = taskId => async dispatch => {
  try {
    const res = await axios.get(`/api/tasks/${taskId}`);
    dispatch({
      type: GET_TASK,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Get Tasks
export const getTasks = () => async dispatch => {
  try {
    const res = await axios.get("/api/tasks");
    dispatch({
      type: GET_TASKS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Update Task
export const updateTask = (taskId, formData) => async dispatch => {
  try {
    const res = await axios.patch(`/api/tasks/${taskId}`, formData);
    dispatch({
      type: UPDATE_TASK,
      payload: res.data
    });
    dispatch(setAlert("Task Updated", "success"));
    //history.push("/tasks"); //can't use redirect in an action
  } catch (error) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Delete Task
export const deleteTask = taskId => async dispatch => {
  try {
    console.log("1");
    await axios.delete(`/api/tasks/${taskId}`);
    console.log("2");
    dispatch({
      type: DELETE_TASK,
      payload: taskId
    });
    dispatch(setAlert("Task Removed", "success"));
  } catch (error) {
    console.log("Inside catch");
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Add a task
export const addTask = (formData, history) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    console.log(1);
    const res = await axios.post(`/api/tasks/`, formData, config);
    console.log(2);
    dispatch({
      type: ADD_TASK,
      payload: res.data
    });
    console.log(3);
    dispatch(setAlert("Task Added", "success"));

    //history.push("/tasks");
  } catch (error) {
    //console.log('Inside catch')
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
    dispatch(setAlert("Operation Failed", "danger"));
  }
};
