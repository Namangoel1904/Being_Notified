import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/AppLayout';
import ChatRooms from './pages/ChatRooms';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppLayout>
          <Routes>
            <Route path="/chat" element={<ChatRooms />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;