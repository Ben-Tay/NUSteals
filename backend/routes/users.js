import express from 'express';

const router = express.Router();

// Get all users [triggerd when we do /api/users/]
router.get('/', (req, res) => {
    res.json({msg: 'GET ALL USERS'})
})

// Get a single user
router.get('/:id', (req, res) => {
    res.json({msg: req.params.id});
})

// Create a new user
router.post('/', (req, res) => {
    res.json({msg: "create a new user"})
})

// Edit a user profile [allow to update profile fields]
router.patch('/:id', (req, res) => {
    res.json({msg: 'update a user'})
})


export default router;