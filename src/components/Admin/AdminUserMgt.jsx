import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const AdminUserMgt = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      setAuthToken(token);
      if (!token) {
        navigate('/login');
      }
    
      try {
        const response = await fetch("https://nusteals-express.onrender.com/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
      
    };

    fetchUsers();
  }, []);

  const handleSaveChanges = async () => {
    if (!editingUser) return;

    try {
      // Check for duplicate name or email
      const existingUser = users.find(
        (user) =>
          (user.name === editingUser.name && user._id !== editingUser._id) ||
          (user.email === editingUser.email && user._id !== editingUser._id)
      );

      if (existingUser) {
        if (existingUser.name === editingUser.name) {
          setNameError("Name is already taken.");
        }
        if (existingUser.email === editingUser.email) {
          setEmailError("Email is already taken.");
        }
        return;
      }

      // Proceed with saving the changes if no duplicates
      const response = await fetch(
        `https://nusteals-express.onrender.com/api/users/${editingUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            password: editingUser.password,
            address: editingUser.address,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      setShowModal(false);
      setEmailError(""); // Reset error on success
      setNameError(""); // Reset error on success
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setShowModal(true);
    setEmailError(""); // Reset email error on edit
    setNameError(""); // Reset name error on edit
  };

  const handleUserDelete = async (userId) => {
    try {
      const response = await fetch(`https://nusteals-express.onrender.com/api/users/${userId}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",             
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery)
  );

  return (
    <Container>
      <h2 className="my-4">User Management</h2>
      <Form.Control
        type="text"
        placeholder="Search by username"
        className="mb-3"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.address}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(user)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <Form>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
                {nameError && <div className="text-danger">{nameError}</div>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
                {emailError && <div className="text-danger">{emailError}</div>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="">Select a role</option>
                  <option value="student">Student</option>
                  <option value="merchant">Merchant</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser.address}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, address: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{userToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleUserDelete(userToDelete._id)}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUserMgt;