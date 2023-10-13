import React, { useState } from 'react';
import './ResetPasswordPage.css';

const ResetPasswordPage: React.FC = () => {
  const [email, setResetEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        // console.log(data.success)
        // console.log(data.fail)
        if(data.success === "Email znaleziony") {
          console.log('moja stara najebana')
          setShowModal(true);
          //ustawiac validated true albo false blad czy nie
        }else {
          console.log('Brak emaila w bazie danych.');
          setErrorMessage('Brak emaila w bazie danych.');
        }
        // data.errors.email[0]
        // if(data.succes)
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
          <p className="error-message">{errorMessage}</p>
    </div>
    {showModal && (
        <div className="modal">
          <h2>Resetowanie hasła</h2>
          <p>Twoje hasło zostało zresetowane.</p>
          <button onClick={() => setShowModal(false)}>Zamknij</button>
        </div>
      )}
    </>
  );
};

export default ResetPasswordPage;
