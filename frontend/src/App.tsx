import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NewPasswordPage from './components/NewPasswordPage';
import WelcomePage from './components/welcomePage';
import UserSettings from './components/UserSettingsPage';
import ConfirmEmail from './components/ConfirmEmailPage';
import AddNewInvoice from './components/AddNewInvoicePage';
import Invoice from './components/InvoicePage';



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
      <Route path="userSettings" element={<UserSettings/>} />
      <Route path="confirmEmail" element={<ConfirmEmail/>} />
      <Route path="addInvoice" element={<AddNewInvoice/>} />
      <Route path="invoice" element={<Invoice/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
