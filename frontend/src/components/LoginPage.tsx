import React, { useState } from 'react';
import './HomePage.css';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const apiUrl = 'http://localhost:8080/login';

    const requestBody = {
      username: username,
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
      <div className="login-page">
        <div className="login-container">
          <h1>Zaloguj się</h1>
            <div className="form-group">
              <label htmlFor="username">Adres e-mail</label><br />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Hasło</label><br />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button onClick={handleLogin}>Zaloguj się</button>
        </div>
        <div>
          <span>
            Nie masz konta? <Link to="/registration">Zarejestruj się</Link>
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
