import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DataManagement from './pages/DataManagement';
import BlockchainManagement from './pages/BlockchainManagement';
import LearnMore from './pages/LearnMore';
import './output.css';


function App() {
  console.log("App component rendering");
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data" element={<DataManagement />} />
            <Route path="blockchain" element={<BlockchainManagement />} />
            <Route path="learn-more" element={<LearnMore />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;