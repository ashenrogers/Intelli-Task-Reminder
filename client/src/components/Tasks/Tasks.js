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
    const [filterType, setFilterType] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false);



    useEffect(() => {
        getTasks();
    }, [getTasks]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTasks = tasks
    .filter(task => 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => {
        if (!filterType || !filterValue) return true;

        if (filterType === 'priority') {
            return task.priority?.toLowerCase() === filterValue.toLowerCase();
        } else if (filterType === 'category') {
            return task.category?.toLowerCase() === filterValue.toLowerCase();
        } else if (filterType === 'status') {
            if (filterValue.toLowerCase() === 'completed') {
                return task.status === 'completed';
            } else if (filterValue.toLowerCase() === 'incomplete') {
                return task.status !== 'completed';
            }
        }
        return true;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));



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
                
<div className="filter-container">
    <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
        {showFilterOptions ? 'Close Filter' : 'Filter Tasks'}
    </button>

    {showFilterOptions && (
        <div className="filter-panel">
            <select
                value={filterType}
                onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterValue('');
                }}
                className="filter-select"
            >
                <option value="">Select Filter Type</option>
                <option value="priority">Priority</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
            </select>

            {filterType && (
                <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="filter-select"
                >
                    {filterType === 'priority' && (
                        <>
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </>
                    )}
                    {filterType === 'category' && (
                        <>
                            <option value="">Select Category</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                        </>
                    )}
                    {filterType === 'status' && (
                        <>
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </>
                    )}
                </select>
            )}
        </div>
    )}
</div>


                
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