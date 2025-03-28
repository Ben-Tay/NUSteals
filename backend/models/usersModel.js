import mongoose from 'mongoose';
const { Schema } = mongoose; // Destructure Schema from mongoose

const userSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, {
    timestamps: true,
});

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User