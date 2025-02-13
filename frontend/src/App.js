import "./App.css";
import { useEffect, useState } from "react";

function App() {
  // Global state
  const [events, setEvents] = useState([]);

  // Adding an event state
  const [text, setText] = useState("");

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  /*const handleChange = (event) => {
    setEvent({
      ...event,
      text: event.target.value,
    });
  };*/

  // Adding an event
  const addEvent = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      //const eventData = { text: event.target.value };
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const newEvent = await response.json();
      setEvents([newEvent, ...events]);
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete an event
  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Update an event
  /*const updateEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(events.map((event) => (event._id === id ? data : event)));
      } else {
        console.error("Failed to update event", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };*/

  return (
    <div className="App">
      <form onSubmit={addEvent}>
        <input
          name="text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you do or what happened?"
        />
        <button type="submit">Add Event</button>
      </form>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <strong>{new Date(event.date).toLocaleString()}:</strong>
            {event.text}
            <button onClick={() => deleteEvent(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
