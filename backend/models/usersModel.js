import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'; // Use import instead of require
const { Schema } = mongoose; // Destructure Schema from mongoose


// Create schema
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    address: { type: String },
    photo: { type: String, required: false }, // store the image path, not required unless user wants
}, {
    timestamps: true,
});

// Apply the uniqueValidator plugin to the schema
// userSchema.plugin(uniqueValidator);

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;