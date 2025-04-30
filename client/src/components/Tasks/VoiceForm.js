import React, { useState, useEffect } from "react";
import { parse, format, isValid } from "date-fns";
import { addTask } from "../../actions/task";
import { connect } from "react-redux";
import backgroundImage from "../../img/v1.jpg"; // Import the image

const VoiceForm = ({ addTask }) => {
  const [formData, setFormData] = useState({
    description: "",
    due_at: "",
    time: "",
  });

  const [isListening, setIsListening] = useState(false); // To manage animation visibility
  const [fetchedTasks, setFetchedTasks] = useState([]);

  const processVoiceInput = (input) => {
    
    let description = input;
    let due_at = "";
    let time = "";

    const dateMatch = input.match(/\b(?:on\s)?([A-Za-z]+(?:\s\d{1,2}(?:th|st|nd|rd)?))\s?(\d{1,2}:\d{2}\s?(?:am|pm))\b/i);

    if (dateMatch) {
      const dateStr = dateMatch[1];
      const timeStr = dateMatch[2];

      const parsedDate = parse(`${dateStr} ${timeStr}`, "MMMM dd yyyy hh:mm a", new Date());

      if (isValid(parsedDate)) {
        due_at = format(parsedDate, "yyyy-MM-dd");
        time = format(parsedDate, "HH:mm");
        description = input.replace(dateMatch[0], "").trim();
      }

    }

    setFormData({ ...formData, description, due_at, time });
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true); // Start animation when listening begins

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      processVoiceInput(voiceText);
    };

    recognition.onend = () => {
      setIsListening(false); // Stop animation when listening ends
    };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addTask(formData);
    setFormData({ description: "", due_at: "", time: "" });
    fetchTasks();
  };

  const fetchTasks = async () => {
  try {
    // Optional: setLoading(true); if you manage a loading state
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    setFetchedTasks(data);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  } finally {
    
  }
};

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      style={{
        display: "flex", // Enable flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        minHeight: "80vh", // Ensure it covers the entire viewport height
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        padding: "80px",
        backgroundRepeat: "no-repeat",
        width: "100%", // Set the width of the background to 100% of the parent
      }}
    >
      <div
        className="container"
        style={{
          width: "750px",
          backgroundColor: "#A9A9A9",
          padding: "20px",
        }}
      >
        <h1 className="large text-primary">Voice Task  Creation</h1>

        <form className="form my-1" onSubmit={onSubmit}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                readOnly
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Due Date:</label>
              <input type="text" name="due_at" value={formData.due_at} readOnly style={{ width: "100%" }} />
            </div>
          </div>

          {/* New Time Field */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Time:</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                readOnly
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleVoiceInput} className="btn btn-primary">
              {isListening && <i className="fas fa-microphone mic-animation"></i>}
              Speak Task
            </button>
            <button
              type="submit"
              className="btn btn-dark button1"
              style={{ backgroundColor: "#04AA6D" }}
            >
              Submit Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(null, { addTask })(VoiceForm);
