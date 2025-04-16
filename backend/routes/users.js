import express from 'express';
import { createUser, getUserByLogin, getAllUsers, getSingleUser, 
         deleteUser, editUser, resetPassword, getUserSignUps, requireAuthJWT} from '../controllers/userController.js';

import validateUser from '../controllers/validateUser';
import validateImageSize from '../controllers/validateImageSize';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Login a user
router.post('/login', getUserByLogin)

// Get user signups by month
router.get('/user-signups', getUserSignUps)

// Get a single user
router.get('/:id', requireAuthJWT, getSingleUser);

// Create a new user
router.post('/', validateUser, createUser);

// Allow user to reset password
router.post('/reset', resetPassword)

// Delete a user
router.delete('/:id', requireAuthJWT,  deleteUser)

// Edit a user profile based on parameters
router.patch('/:id', validateImageSize, validateUser, editUser);


export default router;