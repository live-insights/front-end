// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext"
import PrivateRoute from './components/PrivateRoute';
import ClientDashboard from './pages/Client/ClientDashboard';
import AnalysisGrid from './pages/Client/AnalysisGrid';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
            />
            <Route
              path="/client"
              element={<PrivateRoute element={<ClientDashboard />} />}
            >
              <Route path="catalog" element={<AnalysisGrid />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
