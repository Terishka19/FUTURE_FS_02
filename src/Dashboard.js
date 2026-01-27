import "./App.css";
import { useEffect, useState } from "react";

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [activeLead, setActiveLead] = useState(null);
  const [noteText, setNoteText] = useState("");

  // 🔹 Fetch leads
  useEffect(() => {
    fetch("http://localhost:5000/api/leads")
      .then(res => res.json())
      .then(data => setLeads(data));
  }, []);

  // 🔹 Metrics
  const totalLeads = leads.length;
  const contacted = leads.filter(l => l.status === "contacted").length;
  const converted = leads.filter(l => l.status === "converted").length;
  const conversionRate = totalLeads
    ? Math.round((converted / totalLeads) * 100)
    : 0;

  // 🔹 Update lead status (NO reload)
  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/api/leads/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(() => {
      setLeads(prev =>
        prev.map(lead =>
          lead._id === id ? { ...lead, status } : lead
        )
      );
    });
  };

  // 🔹 Add note
  const addNote = () => {
    if (!noteText.trim()) return;

    fetch(`http://localhost:5000/api/leads/${activeLead._id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText })
    })
      .then(res => res.json())
      .then(updatedLead => {
        setLeads(prev =>
          prev.map(l =>
            l._id === updatedLead._id ? updatedLead : l
          )
        );
        setActiveLead(updatedLead);
        setNoteText("");
      });
  };

  return (
    <div className="container">
      <h1>Your Leads Overview</h1>

      {/* 🔹 STATS */}
      <div className="stats">
        <div className="card"><h3>Total Leads</h3><p>{totalLeads}</p></div>
        <div className="card"><h3>Contacted</h3><p>{contacted}</p></div>
        <div className="card"><h3>Converted</h3><p>{converted}</p></div>
        <div className="card"><h3>Conversion</h3><p>{conversionRate}%</p></div>
      </div>

      {/* 🔹 TABLE */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 && (
            <tr><td colSpan="5">No leads yet</td></tr>
          )}

          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.source}</td>

              <td>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateStatus(lead._id, e.target.value)
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </td>

              <td>
                <button onClick={() => setActiveLead(lead)}>
                  Notes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 NOTES PANEL */}
      {activeLead && (
        <div className="notes-panel">
          <h3>Notes for {activeLead.name}</h3>

          <div className="notes-list">
            {activeLead.notes.length === 0 && (
              <p className="empty">No notes yet</p>
            )}

            {activeLead.notes.map((note, index) => (
              <div key={index} className="note">
                <small>{new Date(note.date).toLocaleString()}</small>
                <p>{note.text || "⚠️ Old note (no text saved)"}</p>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Add a follow-up note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <button onClick={addNote}>Add Note</button>
          <button className="close" onClick={() => setActiveLead(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
