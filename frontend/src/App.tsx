import { BrowserRouter as Router, Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage/>} /> 
      <Route path="registration" element={<RegistrationPage/>} /> 
    </Routes>
  </BrowserRouter>
  );
}

export default App;
