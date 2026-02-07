import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000"; // change later when deployed

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

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/employees`, form);
    alert("Employee added successfully!");
    setForm({ employee_id: "", full_name: "", email: "", department: "" });
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`);
    fetchEmployees();
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/attendance`, attendance);
    alert("Attendance marked!");
    setAttendance({ employee_id: "", status: "Present" });
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
          />
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <button type="submit">Add</button>
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
