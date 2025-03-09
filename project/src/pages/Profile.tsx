import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Your Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <div className="mt-4 space-y-2">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Degree:</strong> {user?.degree}</p>
              <p><strong>Learning Goal:</strong> {user?.goal}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
            <div className="mt-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => {/* TODO: Implement edit profile */}}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;