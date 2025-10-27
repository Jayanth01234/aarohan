import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import VisitorView from './pages/VisitorView';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<VisitorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;