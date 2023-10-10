import React, { useState } from 'react';
import "./HomePage.css"
import './LoginPage.css';

const RegistrationPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // API
    console.log('Zalogowano jako:', username);
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h2>Zaloguj się</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Nazwa użytkownika:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Hasło:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Zaloguj się</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
