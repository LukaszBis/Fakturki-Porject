import React, { useState } from 'react';
import './ResetPasswordPage.css';


const ResetPasswordPage: React.FC = () => {
  const [email, setResetEmail] = useState('');

  const handleResetPasswordPage = () => {
    const apiUrl = 'http://localhost:8080/resetPassword';

    const requestBody = {
      email: email,
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
          throw new Error('Reset password failed: User not found');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Password reset successful:', data);
      })
      .catch((error) => {
        console.error('Password reset error:', error);
      });

  };

  return (
    <>
    <div className="container-reset">
      <div className="form-container-reset">
          <label htmlFor="email">Email:</label><br/>
          <input
              type="email"
              id="email"
              name="email"
              placeholder=' example@mail.com'
              value={email}
              onChange={(e) => setResetEmail(e.target.value)}
              required
          /><br/>
          <button onClick={handleResetPasswordPage} className='resetButton'>Resetuj hasło</button>
      </div>
    </div>
    </>
  );
};

export default ResetPasswordPage;
