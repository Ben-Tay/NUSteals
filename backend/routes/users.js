import express from 'express';
import { createUser, getUserByLogin, getAllUsers, getSingleUser, deleteUser, editUser, requireAuthJWT} from '../controllers/userController.js';

import validateUser from '../controllers/validateUser';

const router = express.Router();

// Get all users
router.get('/', requireAuthJWT, getAllUsers);

// Login a user
router.post('/login', getUserByLogin)

// Get a single user
router.get('/:id', requireAuthJWT, getSingleUser);

// Create a new user
router.post('/', validateUser, createUser);

// Delete a user
router.delete('/:id', requireAuthJWT,  deleteUser)

// Edit a user profile based on parameters
router.patch('/:id', validateUser, editUser);


export default router;