import express from 'express';
import { createUser, getAllUsers, getSingleUser, deleteUser, editUser } from '../controllers/userController.js';
import validateUser from '../controllers/validateUser';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get a single user
router.get('/:id', getSingleUser);

// Create a new user
router.post('/', validateUser, createUser);

// Delete a user
router.delete('/:id', deleteUser)

// Edit a user profile based on parameters
router.patch('/:id', validateUser, editUser);


export default router;