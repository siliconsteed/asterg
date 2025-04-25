import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Create MongoDB Memory Server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Memory Server');

    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' });

    // Create test user
    const user = await User.create({
      email: 'test@example.com',
      password: 'test123456',
      name: 'Test User'
    });

    console.log('Test user created successfully:', {
      email: user.email,
      _id: user._id
    });

    // Disconnect and stop MongoDB Memory Server
    await mongoose.disconnect();
    await mongod.stop();

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
