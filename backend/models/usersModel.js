import mongoose from 'mongoose';
const { Schema } = mongoose; // Destructure Schema from mongoose


// Create schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    address: { type: String },
    photo: { type: String, required: false }, // store the image path, not required unless user wants
}, {
    timestamps: true,
});



// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;