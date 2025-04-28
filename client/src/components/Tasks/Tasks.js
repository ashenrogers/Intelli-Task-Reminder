import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import TaskItem from './TaskItem';
import { getTasks } from '../../actions/task';
import { FaMicrophone, FaPen, FaFilePdf } from 'react-icons/fa';

const Tasks = ({ getTasks, task: { tasks, loading } }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getTasks();
    }, [getTasks]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    


    return (
        loading ? <Spinner /> : (
            <Fragment>
                <h1 className="large text-primary">Tasks</h1>

                <input 
                    type="text" 
                    placeholder="Search tasks by description..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="search-input"
                /> 
                <br />
                <Link className="btn btn-dark my-1" to="/create-task">
                    Create Task <FaPen className="pen-icon" />
                </Link>
                <Link className="btn btn-dark my-1" to="/voice-task">
                    Voice Task <FaMicrophone className="microphone-icon" />
                </Link>

                <Link className="btn btn-report my-1" to="/task-report">
                    Download Report <FaFilePdf />
                </Link>

                {filteredTasks.length > 0 ? (
                    <div className="tasks">
                        {filteredTasks.map(task => (
                            <TaskItem key={task._id} task={task} />
                        ))}
                    </div>
                ) : (
                    <h4>OOpps..No Tasks found!!</h4>
                )}
            </Fragment>
        )
    );
};

Tasks.propTypes = {
    getTasks: PropTypes.func.isRequired,
    task: PropTypes.object.isRequired 
};

const mapStateToProps = state => ({
    task: state.task
});

export default connect(mapStateToProps, { getTasks })(Tasks);