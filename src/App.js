// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ClientDashboard from './pages/Client/ClientDashboard';
import LiveDashboard from './components/Client/LiveDashboard';
import LiveDetails from './components/Client/LiveDetails';
import './App.css';

function App() {
  return (
    <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute element={<Outlet />} />}>
              <Route path="/client" element={<ClientDashboard />}>
                <Route path="lives" element={<LiveDashboard />} />
                <Route path="lives/:liveId" element={<LiveDetails />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;
