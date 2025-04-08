import users from '../models/usersModel.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';


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
        console.log("Checking if user already exists:", email);

        // Check if a user with the same email already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        const existingUsername = await users.findOne({ name});
        if (existingUsername) {
            return res.status(409).json({ error: "Username already exists"});
        }

        console.log("Creating user:", { name, email, role });

        const newUser = await users.create({
            name,
            address: address || null, // Handle optional field
            email,
            password,
            role,
            photo: null // default photo URL null by default
        });

        // Return safe user data (exclude password & photo)
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
        res.status(500).json({
            error: "User registration failed",
            details: error.message
        });
    }
};

// Get a single user
const getSingleUser = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid userId" });
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
        const allUsers = await users.find({}).sort({ createdAt: -1 }); // Fetch all users from DB from most recent
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

// Get user by login
const getUserByLogin = async(req, res) => {
    const { email, password} = req.body; // Get email and password from req body
    
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    try {
        const foundUser = await users.findOne({ email }) // Find user by email
        if (foundUser && foundUser.password === password) {
            // handle authentication to sign on found User's id
            const userDetails = { uid: foundUser._id} 
            const accessToken = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: "12h"});
            res.status(200).json({accessToken}); // return user data if credentials correct
        }
        else {
            return res.status(401).json({ message: "Invalid login credentials"});
        }

        
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', details: error.message });    
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid userId" });
    }

    const deletedUser = await users.findOneAndDelete({ _id: id });

    if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
    }

    // Send response back to postman for verification
    res.status(200).json({ message: "User deleted successfully", user: deletedUser })
};

// Edit a user
const editUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, address, photo } = req.body;
    const { id } = req.params;

    try {
        const updatedUser = await users.findByIdAndUpdate(
            id,
            { name, email, password, role, address, photo },
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

const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email input required!"});
    } 

    try {
        // Can use email, as we made sure email is unique
        const findUser = await users.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ message: "User not found!"});
        }

        const updatedUser = await users.findByIdAndUpdate(
            findUser._id,
            { password }, 
            { new: true }
        )
        // Send the updated user back
        res.status(200).json({updatedUser});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
    
}

const getUserSignUps = async(req, res) => {
    
    try {
        const { year, month } = req.query; 
        const match = {};
    
        // Optional filter if year + month provided
        if (year && month) {
          match.createdAt = {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1) // exclusive upper bound
          };
        }
    
        const result = await users.aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
        ]);
    
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        const formatted = result.map(r => ({
          label: `${monthNames[r._id.month - 1]} ${r._id.year}`,
          count: r.count
        }));
    
        res.json(formatted);
      } catch (error) {
        console.error("Error fetching signup stats:", error);
        res.status(500).json({ message: "Server error" });
      }
    
}

const requireAuthJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                //most likely token expired
                res.sendStatus(401);
                return;
            }
        });
    } else { res.sendStatus(401); }
} //end requireAuthJWT

// Export the user handler methods to the routes page
export { createUser, getUserByLogin, getAllUsers, getSingleUser, deleteUser, editUser, resetPassword, getUserSignUps, requireAuthJWT } 