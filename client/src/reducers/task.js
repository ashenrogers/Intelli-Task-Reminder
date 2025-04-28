import {
    GET_TASK,
    GET_TASKS,
    TASK_ERROR,
    UPDATE_TASK,
    DELETE_TASK,
    ADD_TASK
} from '../actions/types';

const initialState = {
    task:null,
    tasks:[],
    deletedTasks: [],
    loading:true,
    error:{}

}

export default function(state=initialState,action) {
    const {type,payload} = action;
    switch(type) {
        case GET_TASKS:
            return {
                ...state,
                tasks:payload,
                loading:false
            };
        case ADD_TASK:
            return {
                ...state,
                tasks:[...state.tasks,payload],
                loading:false
            }
        case GET_TASK:
            return {
                ...state,
                task:payload, 
                loading:false
            }
        case DELETE_TASK:
            return {
                ...state,
                tasks:state.tasks.filter(task=>task._id!==payload),
                loading:false
            }
        case UPDATE_TASK:
            return {
                ...state,
                tasks:state.tasks.map(task=>task._id===payload.id?{...task,description:payload.description}:task),
                loading:false
            }
        case TASK_ERROR:
            return {
                ...state,
                error:payload,
                loading:false
            }

        case 'MOVE_TO_RECYCLE_BIN':
  const taskToDelete = state.tasks.find(task => task._id === action.payload);
  return {
    ...state,
    tasks: state.tasks.filter(task => task._id !== action.payload),
    deletedTasks: [taskToDelete, ...state.deletedTasks]
  };

case 'RECOVER_TASK':
  const recoveredTask = state.deletedTasks.find(task => task._id === action.payload);
  return {
    ...state,
    deletedTasks: state.deletedTasks.filter(task => task._id !== action.payload),
    tasks: [recoveredTask, ...state.tasks]
  };

case 'PERMANENTLY_DELETE_TASK':
  return {
    ...state,
    deletedTasks: state.deletedTasks.filter(task => task._id !== action.payload)
  };

        default:
            return state;
    }
} 