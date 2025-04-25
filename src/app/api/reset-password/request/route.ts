import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

// In a real app, you'd use a proper SMS service
const mockSendSMS = async (phoneNumber: string, code: string) => {
  console.log(`Sending SMS to ${phoneNumber} with code: ${code}`);
  return true;
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this phone number' },
        { status: 404 }
      );
    }

    // Generate reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset code to user
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // Send SMS with reset code (mock)
    await mockSendSMS(phoneNumber, resetCode);

    return NextResponse.json({ 
      message: 'Reset code sent successfully',
      expiresIn: '15 minutes'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Error processing password reset request' },
      { status: 500 }
    );
  }
}
