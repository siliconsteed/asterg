import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { User } from '@/types';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  timeOfBirth: Yup.string().required('Time of birth is required'),
  placeOfBirth: Yup.string().required('Place of birth is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function RegistrationForm({ onSubmit }: { onSubmit: (values: User) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Store user data in localStorage for the chat feature
        localStorage.setItem('user', JSON.stringify(data.user));
        onSubmit(values);
      } catch (error) {
        console.error('Registration error:', error);
        alert(error instanceof Error ? error.message : 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} id="register" className="space-y-6 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8 text-dark">Begin Your Cosmic Journey</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          {...formik.getFieldProps('phoneNumber')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          id="dateOfBirth"
          type="date"
          {...formik.getFieldProps('dateOfBirth')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
          <div className="text-red-500 text-sm">{formik.errors.dateOfBirth}</div>
        )}
      </div>

      <div>
        <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700">Time of Birth</label>
        <input
          id="timeOfBirth"
          type="time"
          {...formik.getFieldProps('timeOfBirth')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.timeOfBirth && formik.errors.timeOfBirth && (
          <div className="text-red-500 text-sm">{formik.errors.timeOfBirth}</div>
        )}
      </div>

      <div>
        <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">Place of Birth</label>
        <input
          id="placeOfBirth"
          type="text"
          {...formik.getFieldProps('placeOfBirth')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.placeOfBirth && formik.errors.placeOfBirth && (
          <div className="text-red-500 text-sm">{formik.errors.placeOfBirth}</div>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps('password')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-coffee-300 focus:ring-coffee-200 form-input"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !formik.isValid}
        className={`w-full bg-coffee-200 text-dark font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-300 focus:ring-offset-2 transition-all duration-200 relative overflow-hidden ${isLoading ? 'cursor-not-allowed opacity-80' : 'hover:bg-coffee-300'}`}
      >
        <span className={`flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          Register
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>
    </form>
  );
}
