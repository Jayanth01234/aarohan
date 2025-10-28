import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import VisitorView from './pages/VisitorView';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Simulator from './pages/Simulator';
import Predict from './pages/Predict';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Chatbot />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/booking" element={<MyBookings />} />
          <Route path="/" element={<VisitorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;