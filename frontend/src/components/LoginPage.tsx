import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const apiUrl = 'http://localhost:8080/login';

    const requestBody = {
      email: email,
      password: password,
    };
    console.log(requestBody)
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Login successful:', data);
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <>
    <div className='container'>
      <div className="login-page">
        <div className="login-container">
          <h1>Zaloguj się</h1>
            <div className="form-group">
              <label htmlFor="username">Adres e-mail</label><br />
              <input
                placeholder=' example@mail.com'
                type="text"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Hasło</label><br />
              <input
                placeholder=' password'
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button onClick={handleLogin} className='logIn'>Zaloguj się</button>
        </div>
        <div className='plusButton'>
          <div>Zapomniałeś hasła? <Link to="/reset">Zresetuj hasło</Link></div>
          <div>Nie masz konta? <Link to="/registration">Zarejestruj się</Link></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
