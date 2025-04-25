const connectDB = require('../src/lib/db').default;
const User = require('../src/models/User').default;
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await connectDB();

    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' });

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    // Create test user
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });

    console.log('Test user created successfully:', {
      email: user.email,
      _id: user._id
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
