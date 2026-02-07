import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hrms-lite-jap7.onrender.com";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [attendance, setAttendance] = useState({
    employee_id: "",
    status: "Present",
  });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch employees failed:", err);
      alert("Failed to fetch employees. Check console.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/employees`, form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      await fetchEmployees(); // refresh list
      alert("Employee added successfully!");
    } catch (err) {
      console.error("Add employee failed:", err);
      alert("Add failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API}/employees/${id}`);
      await fetchEmployees();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check console.");
    }
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/attendance`, attendance);
      setAttendance({ employee_id: "", status: "Present" });
      alert("Attendance marked!");
    } catch (err) {
      console.error("Attendance failed:", err);
      alert("Attendance failed. Check console.");
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h2>HRMS Lite Dashboard</h2>
        <span>Welcome 👋</span>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h4>Total Employees</h4>
          <p>{employees.length}</p>
        </div>
        <div className="stat-card">
          <h4>Today</h4>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Add Employee */}
      <div className="card">
        <h3>Add Employee</h3>
        <form onSubmit={addEmployee} className="form-row">
          <input
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
            required
          />
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Employees List */}
      <div className="card">
        <h3>Employees</h3>
        <ul>
          {employees.map((e) => (
            <li key={e.id} className="list-item">
              <span>
                {e.employee_id} - {e.full_name} ({e.department})
              </span>
              <button className="secondary" onClick={() => deleteEmployee(e.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Attendance */}
      <div className="card">
        <h3>Mark Attendance</h3>
        <form onSubmit={markAttendance} className="form-row">
          <input
            placeholder="Employee ID"
            value={attendance.employee_id}
            onChange={(e) =>
              setAttendance({ ...attendance, employee_id: e.target.value })
            }
            required
          />
          <select
            value={attendance.status}
            onChange={(e) =>
              setAttendance({ ...attendance, status: e.target.value })
            }
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
          <button type="submit">Mark</button>
        </form>
      </div>
    </div>
  );
}

export default App;
