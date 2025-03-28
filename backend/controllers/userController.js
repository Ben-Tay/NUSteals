import users from '../models/usersModel.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// Create a single user
const createUser = async (req, res) => {
    const { name, email, password, role, address } = req.body;

    // Validate input (400 - invalid data)
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
            role,
            photo: null // default photo url null by default
        });

        // Return safe user data (exclude password & photo [cuz not needed])
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
}


// Get a single user
const getSingleUser = async (req, res) => {
    
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "Invalid userId"});
    }

    const user = await users.findById(id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
    
} 


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find({}).sort({createdAt: -1}); // Fetch all users from DB from most recent
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "Invalid userId"});
    }

    const deletedUser = await users.findOneAndDelete({_id: id});

    if (!deletedUser) {
        return res.status(404).json({error: "User not found"});
    }

    // Send response back to postman for verification
    res.status(200).json({ message: "User deleted successfully", user: deletedUser})
}

// Edit a user
const editUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password, role } = req.body;
    const { id } = req.params;
  
    try {
      const updatedUser = await users.findByIdAndUpdate(
        id,
        { name, email, password, role },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the updated user back
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};

// Export the user handler methods to the routes page
export { createUser, getAllUsers, getSingleUser, deleteUser, editUser } 