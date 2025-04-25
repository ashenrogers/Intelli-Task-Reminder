import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

const TaskReport = () => {
    const tasks = useSelector(state => state.task.tasks || []);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const reportRef = useRef();

    const selectedTask = tasks.find(task => task._id === selectedTaskId);

    const handlePrint = useReactToPrint({
        content: () => reportRef.current,
        documentTitle: selectedTask ? `Task Report - ${selectedTask.description}` : 'Task Report',
        onAfterPrint: () => console.log('PDF generated'),
    });

    return (
        <div className="task-report-container">
            <h1 className="large text-primary">Generate Task Report</h1>

            <div className="popup">
                <h3>Select a Task</h3>
                <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
                    <option value="">-- Select a Task --</option>
                    {tasks.map(task => (
                        <option key={task._id} value={task._id}>{task.description}</option>
                    ))}
                </select>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (!selectedTask) {
                            alert("Please select a task first.");
                            return;
                        }
                        handlePrint();
                    }}
                    disabled={!selectedTask}
                >
                    Download Report
                </button>
            </div>

            {/* Always mounted, hidden printable content */}
            <div style={{ display: 'none' }}>
                <div ref={reportRef}>
                    {selectedTask ? (
                        <div>
                            <h2>Task Report</h2>
                            <p><strong>Description:</strong> {selectedTask.description}</p>
                            <p><strong>Created on:</strong> {selectedTask.date}</p>
                            <p><strong>Due by:</strong> {selectedTask.due_at} at {selectedTask.time}</p>
                            <p><strong>Priority:</strong> {selectedTask.priority}</p>
                            <p><strong>Category:</strong> {selectedTask.category}</p>
                            <p><strong>Status:</strong> {selectedTask.completed ? 'Completed ✅' : 'Pending ⏳'}</p>
                            <p><strong>Reminder:</strong> {selectedTask.toBeReminded ? 'Yes 🔔' : 'No ❌'}</p>
                        </div>
                    ) : (
                        <p>No task selected</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskReport;
