import React, { useState } from 'react';
import styles from './ResetPasswordPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const ResetPasswordPage: React.FC = () => {
  const [email, setResetEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [validatedEmail, ] = useState(false);

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
        if(data.success) {
          console.log('Correct email:', data.success);
          //showmodal
        }else {
          console.log(data.fail);
        }
      });
      //   console.log('Password reset successful:', data);
      //   // console.log(data.success)
      //   // console.log(data.fail)
      //   if(data.success === "Email znaleziony") {
      //     console.log('moja stara najebana')
      //     setShowModal(true);
      //     //ustawiac validated true albo false blad czy nie
      //   }else {
      //     console.log('Brak emaila w bazie danych.');
      //     setErrorMessage('Brak emaila w bazie danych.');
      //   }
      //   // data.errors.email[0]
      //   // if(data.succes)
      // })
      // .catch((error) => {
      //   console.error('Password reset error:', error);
      // });
  };

  return (
    <>
    <div className={styles.container_reset}>
    <h1>Zresetuj hasło</h1><br />
    <div className={styles.resetStyle}>
      <div className={styles.form_container_reset}>
            <label htmlFor="email">Email:</label><br/>
            <InputGroup className={styles.inputText} hasValidation>
              <Form.Control
                type="email"
                id="email"
                placeholder='example@mail.com'
                value={email}
                isInvalid={validatedEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                Wprowadź poprawny email.
              </Form.Control.Feedback>
            </InputGroup><br/>
            <button onClick={handleResetPasswordPage} className={styles.resetButton}>Resetuj hasło</button>
        </div>
            {/* <p className="error-message">{errorMessage}</p> */}
    </div>
      
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
