import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

const TaskReport = () => {
    const tasks = useSelector(state => state.task.tasks || []);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const reportRef = useRef(null);

    const selectedTask = tasks.find(task => task._id === selectedTaskId);

    // Ensure proper cleanup and handling of print events
    const handlePrint = useReactToPrint({
        contentRef: reportRef,  // Changed from content: () => reportRef.current to contentRef: reportRef
        documentTitle: selectedTask ? `Task Report - ${selectedTask.description}` : 'Task Report',
        onBeforeGetContent: () => {
            setIsPrinting(true);
            return new Promise(resolve => {
                setTimeout(resolve, 250);
            });
        },
        onAfterPrint: () => {
            setIsPrinting(false);
            console.log('PDF generated successfully');
        },
        onPrintError: (error) => {
            console.error('Print failed', error);
            setIsPrinting(false);
            alert('PDF generation failed. Please try again.');
        },
    });

    useEffect(() => {
        // Reset printing state if component unmounts while printing
        return () => setIsPrinting(false);
    }, []);

    return (
        <div className="task-report-container">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Generate Task Report</h1>

            <div className="bg-white shadow-md rounded p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Select a Task</h3>
                <select 
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                    value={selectedTaskId} 
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                    <option value="">-- Select a Task --</option>
                    {tasks.map(task => (
                        <option key={task._id} value={task._id}>{task.description}</option>
                    ))}
                </select>

                <button
                    className={`py-2 px-4 rounded ${selectedTask 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => {
                        if (!selectedTask) {
                            alert("Please select a task first.");
                            return;
                        }
                        handlePrint();
                    }}
                    disabled={!selectedTask || isPrinting}
                >
                    {isPrinting ? 'Generating...' : 'Download Report'}
                </button>
            </div>

            {/* Printable content - improved visibility with proper styling */}
            <div className="hidden">
                <div ref={reportRef} className="p-8 max-w-2xl mx-auto">
                    {selectedTask ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">Task Report</h2>
                            
                            <table className="w-full border-collapse mb-6">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 text-left" colSpan={2}>Task Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold w-1/3">Description</td>
                                        <td className="border border-gray-300 p-2">{selectedTask.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Created on</td>
                                        <td className="border border-gray-300 p-2">{selectedTask.date}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Due by</td>
                                        <td className="border border-gray-300 p-2">{selectedTask.due_at} at {selectedTask.time}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Priority</td>
                                        <td className="border border-gray-300 p-2">{selectedTask.priority}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Category</td>
                                        <td className="border border-gray-300 p-2">{selectedTask.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Status</td>
                                        <td className="border border-gray-300 p-2">
                                            {selectedTask.completed ? 'Completed ✅' : 'Pending ⏳'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 font-bold">Reminder</td>
                                        <td className="border border-gray-300 p-2">
                                            {selectedTask.toBeReminded ? 'Yes 🔔' : 'No ❌'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div className="text-center text-sm text-gray-500 mt-8">
                                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </div>
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