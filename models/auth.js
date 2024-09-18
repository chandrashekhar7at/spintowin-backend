import mongoose from 'mongoose';

// Define validation patterns
const phoneRegex = /^[0-9]{10}$/; // 10 digits
const passwordMinLength = 2; // Minimum length for password

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [phoneRegex, 'Phone number must be 10 digits'],
    unique: true // Ensure phone number is unique
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [passwordMinLength, `Password must be at least ${passwordMinLength} characters long`]
  },
  paymentStatus: {
    type: Boolean,
    default: false
  },
  spinleft: {
    type: Number,
    default: 10
  },
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Define and export the model
const userinfoauth = mongoose.model('UserAuth', userSchema);

export default userinfoauth;
