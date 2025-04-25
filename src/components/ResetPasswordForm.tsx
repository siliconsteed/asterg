import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ResetPasswordFormProps {
  onCancel: () => void;
}

export default function ResetPasswordForm({ onCancel }: ResetPasswordFormProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const requestFormik = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Must be a valid phone number'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/reset-password/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send reset code');
        }

        setPhoneNumber(values.phoneNumber);
        setStep('verify');
      } catch (error) {
        console.error('Reset request error:', error);
        setError(error instanceof Error ? error.message : 'Failed to send reset code');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const verifyFormik = useFormik({
    initialValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required('Reset code is required')
        .matches(/^[0-9]{6}$/, 'Must be a 6-digit code'),
      newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/reset-password/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            code: values.code,
            newPassword: values.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to reset password');
        }

        // Show success message and return to login
        alert('Password reset successfully! Please login with your new password.');
        onCancel();
      } catch (error) {
        console.error('Reset verification error:', error);
        setError(error instanceof Error ? error.message : 'Failed to reset password');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 'request' 
            ? 'Enter your phone number to receive a reset code'
            : 'Enter the code sent to your phone and your new password'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
          {error}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={requestFormik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phoneNumber"
                type="tel"
                {...requestFormik.getFieldProps('phoneNumber')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {requestFormik.touched.phoneNumber && requestFormik.errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{requestFormik.errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !requestFormik.isValid}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyFormik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Reset Code
            </label>
            <div className="mt-1">
              <input
                id="code"
                type="text"
                maxLength={6}
                {...verifyFormik.getFieldProps('code')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {verifyFormik.touched.code && verifyFormik.errors.code && (
                <p className="mt-2 text-sm text-red-600">{verifyFormik.errors.code}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="newPassword"
                type="password"
                {...verifyFormik.getFieldProps('newPassword')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {verifyFormik.touched.newPassword && verifyFormik.errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{verifyFormik.errors.newPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                type="password"
                {...verifyFormik.getFieldProps('confirmPassword')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {verifyFormik.touched.confirmPassword && verifyFormik.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{verifyFormik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep('request')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !verifyFormik.isValid}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
