import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phoneNumber, code, newPassword } = await req.json();

    if (!phoneNumber || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Phone number, code, and new password are required' },
        { status: 400 }
      );
    }

    // Find user by phone number
    const user = await User.findOne({ 
      phoneNumber,
      resetCode: code,
      resetCodeExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    // Update password
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Password reset verification error:', error);
    return NextResponse.json(
      { error: 'Error resetting password' },
      { status: 500 }
    );
  }
}
