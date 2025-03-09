import React from 'react';

const ChatBot = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">AI Study Assistant</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Coming soon! Your personal AI study assistant will help you with:</p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>Answering academic questions</li>
          <li>Creating study plans</li>
          <li>Providing learning resources</li>
          <li>Offering motivation and support</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatBot;