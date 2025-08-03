'use client';

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { User } from '@/types';

interface MongoUser extends User {
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export default function ViewData() {
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [mongoDbData, setMongoDbData] = useState<MongoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string>('');
  
  useEffect(() => {
    // Get all localStorage data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setLocalStorageData(JSON.stringify(parsedData, null, 2));
      } catch (e) {
        setLocalStorageData('Error parsing data');
      }
    }

    // Fetch MongoDB data
    const fetchMongoData = async () => {
      const searchParams = new URLSearchParams();
      if (search) {
        searchParams.append('search', search);
      }
      try {
        const response = await fetch(`/api/users?${searchParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setMongoDbData(data.users);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchMongoData();
  }, [search]);

  const handleExport = () => {
    // Export to CSV
    const headers = ['Name', 'Email', 'Phone', 'Date of Birth', 'Time of Birth', 'Place of Birth', 'Created At'];
    const csvData = mongoDbData.map(user => [
      user.name,
      user.email,
      user.phoneNumber,
      user.dateOfBirth,
      user.timeOfBirth,
      user.placeOfBirth,
      new Date(user.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'users.csv');
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeleteLoading(userId);
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the data
      const fetchMongoData = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setMongoDbData(data.users);
      };
      await fetchMongoData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete user');
    } finally {
      setDeleteLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 via-pink-300 via-purple-400 to-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Stored Data</h1>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Search and Export Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1 max-w-md">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                  <input
                    type="text"
                    id="search"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by name, email, or place of birth"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleExport}
                  disabled={mongoDbData.length === 0}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Export to CSV
                </button>
              </div>
            </div>
          
            {/* Local Storage Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Local Storage Data</h2>
              {localStorageData ? (
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                  {localStorageData}
                </pre>
              ) : (
                <p className="text-gray-500">No data found in localStorage</p>
              )}
            </div>

            {/* MongoDB Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">MongoDB Data</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : mongoDbData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mongoDbData.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={deleteLoading === user._id}
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                            >
                              {deleteLoading === user._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No users found in database</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
