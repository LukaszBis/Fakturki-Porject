import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NewPasswordPage from './components/NewPasswordPage';
import WelcomePage from './components/welcomePage';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<WelcomePage />} />
      <Route path="login" element={<LoginPage/>} /> 
      <Route path="registration" element={<RegistrationPage/>} /> 
      <Route path="reset" element={<ResetPasswordPage/>} />
      <Route path="newPassword" element={<NewPasswordPage/>} />
      <Route path="welcome" element={<WelcomePage/>} />
      <Route path="homePage" element={<HomePage/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
