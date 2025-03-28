import express from 'express';
import users from '../models/usersModel.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const allUsers = await users.find(); // Fetch all users from DB
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Get a single user
router.get('/:id', async (req, res) => {
    try {
        const user = await users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(400).json({ error: "Invalid user ID", details: error.message });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, password, role, address } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["name", "email", "password", "role"]
        });
    }

    try {
        console.log("Creating user:", { name, email, role });

        const newUser = await users.create({
            name,
            address: address || null, // Handle optional field
            email,
            password,
            role
        });

        // Return safe user data (exclude password)
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            address: newUser.address,
            role: newUser.role,
            createdAt: newUser.createdAt
        });

    } catch (error) {
        console.error("User creation failed:", error);
        res.status(400).json({
            error: "User registration failed",
            details: error.message,
            mongooseError: error.name === 'ValidationError' ? error.errors : undefined
        });
    }
});

// Edit a user profile
router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await users.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ error: "Failed to update user", details: error.message });
    }
});

export default router;