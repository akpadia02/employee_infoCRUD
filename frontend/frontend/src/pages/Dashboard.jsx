// pages/Dashboard.jsx
// Dashboard with Proper Field-Level Validation


/**
 * File: pages/Dashboard.jsx
 *
 * Purpose:
 * - Main dashboard after user login
 * - Displays all employees belonging to logged-in user
 * - Provides full CRUD functionality (Create, Read, Update, Delete)
 * - Implements frontend field-level validation
 * - Filters employees by department
 *
 * Responsibilities:
 * 1. Protect route (only authenticated users allowed)
 * 2. Fetch employees from backend
 * 3. Validate employee form before submission
 * 4. Handle create & update logic
 * 5. Handle delete logic
 * 6. Filter employees dynamically
 *
 * Flow:
 * Login → Dashboard Load → Fetch Employees →
 * Add/Edit/Delete → Re-fetch → Update UI
 */


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";

import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedDept, setSelectedDept] = useState("All");

  // ================= PROTECT ROUTE =================
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    fetchEmployees();
  }, []);

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch {
      alert("Failed to load employees");
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ================= FRONTEND VALIDATION =================
  const validateForm = () => {
    let temp = {};

    // Name
    if (!form.name.trim())
      temp.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(form.name))
      temp.name = "Only letters allowed";

    // Email
    if (!form.email)
      temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    // Department
    if (!form.department)
      temp.department = "Department required";
    else if (!/^[A-Za-z ]+$/.test(form.department))
      temp.department = "Only letters allowed";

    // Designation
    if (!form.designation)
      temp.designation = "Role required";
    else if (!/^[A-Za-z ]+$/.test(form.designation))
      temp.designation = "Only letters allowed";

    // Salary
    if (!form.salary)
      temp.salary = "Salary required";
    else if (isNaN(form.salary))
      temp.salary = "Only numbers allowed";
    else if (Number(form.salary) <= 0)
      temp.salary = "Must be greater than 0";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        await API.put(`/employees/${editId}`, form);
      } else {
        await API.post("/employees", form);
      }

      resetForm();
      fetchEmployees();

    } catch (err) {
      const msg = err.response?.data?.error;

      // Map backend error to correct field
      if (msg?.toLowerCase().includes("email")) {
        setErrors({ email: msg });

      } else if (msg?.toLowerCase().includes("name")) {
        setErrors({ name: msg });

      } else if (msg?.toLowerCase().includes("department")) {
        setErrors({ department: msg });

      } else if (msg?.toLowerCase().includes("role")) {
        setErrors({ designation: msg });

      } else if (msg?.toLowerCase().includes("salary")) {
        setErrors({ salary: msg });

      } else {
        alert(msg || "Something went wrong");
      }
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setErrors({});

    setForm({
      name: "",
      email: "",
      department: "",
      designation: "",
      salary: "",
    });
  };

  // ================= EDIT =================
  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary,
    });

    setEditId(emp._id);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      alert("Delete Failed");
    }
  };

  // ================= FILTER =================
  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean))
  );

  const displayedEmployees =
    selectedDept === "All"
      ? employees
      : employees.filter(
          (e) => e.department === selectedDept
        );

  // ================= UI =================
  return (
    <div>

      <Navbar />

      <div className="container">

        {/* HEADER */}
        <div className="dashboard-header">

          <h2>Employees</h2>

          <button
            className="btn"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add Employee
          </button>

        </div>

        {/* FORM */}
        {showForm && (
          <div className="form-wrapper">

            <div
              className="card"
              style={{ width: "450px" }}
            >

              <h3
                style={{
                  textAlign: "center",
                  color: "#1565c0",
                }}
              >
                {editId
                  ? "Edit Employee"
                  : "Add Employee"}
              </h3>

              <form onSubmit={handleSubmit}>

                {/* NAME */}
                <input
                  className={`input ${
                    errors.name
                      ? "input-error"
                      : ""
                  }`}
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <p className="error-text">
                    <FaExclamationCircle />
                    {errors.name}
                  </p>
                )}

                {/* EMAIL */}
                <input
                  className={`input ${
                    errors.email
                      ? "input-error"
                      : ""
                  }`}
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <p className="error-text">
                    <FaExclamationCircle />
                    {errors.email}
                  </p>
                )}

                {/* DEPARTMENT */}
                <input
                  className={`input ${
                    errors.department
                      ? "input-error"
                      : ""
                  }`}
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                />

                {errors.department && (
                  <p className="error-text">
                    <FaExclamationCircle />
                    {errors.department}
                  </p>
                )}

                {/* DESIGNATION */}
                <input
                  className={`input ${
                    errors.designation
                      ? "input-error"
                      : ""
                  }`}
                  name="designation"
                  placeholder="Role"
                  value={form.designation}
                  onChange={handleChange}
                />

                {errors.designation && (
                  <p className="error-text">
                    <FaExclamationCircle />
                    {errors.designation}
                  </p>
                )}

                {/* SALARY */}
                <input
                  className={`input ${
                    errors.salary
                      ? "input-error"
                      : ""
                  }`}
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={form.salary}
                  onChange={handleChange}
                />

                {errors.salary && (
                  <p className="error-text">
                    <FaExclamationCircle />
                    {errors.salary}
                  </p>
                )}

                {/* BUTTONS */}
                <button
                  className="btn"
                  style={{ width: "100%" }}
                >
                  {editId
                    ? "Update"
                    : "Save"}
                </button>

                <button
                  type="button"
                  className="btn btn-gray"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </form>

            </div>

          </div>
        )}

        {/* FILTER */}
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: 600 }}>
            Filter Dept:
          </label>

          <select
            className="input"
            value={selectedDept}
            onChange={(e) =>
              setSelectedDept(e.target.value)
            }
            style={{ width: "200px" }}
          >
            <option value="All">All</option>

            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="card table-card">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Dept</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {displayedEmployees.length === 0 ? (

                <tr>
                  <td colSpan="6" align="center">
                    No Employees
                  </td>
                </tr>

              ) : (

                displayedEmployees.map((emp) => (

                  <tr key={emp._id}>

                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>₹{emp.salary}</td>

                    <td>

                      <FaEdit
                        style={{
                          cursor: "pointer",
                          color: "#1e88e5",
                          marginRight: "12px",
                        }}
                        onClick={() =>
                          handleEdit(emp)
                        }
                      />

                      <FaTrash
                        style={{
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() =>
                          handleDelete(emp._id)
                        }
                      />

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;


















































