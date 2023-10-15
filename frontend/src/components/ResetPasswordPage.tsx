import React, { useState } from 'react';
import styles from './ResetPasswordPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const ResetPasswordPage: React.FC = () => {
  const [email, setResetEmail] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const [validatedEmail,] = useState(false);

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
        if(data.success) 
        {
          console.log('Correct email:', data.success);
        }
        else
        {
          console.log('Correct email:', data.fail);
        }
      });
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
    </>
  );
};

export default ResetPasswordPage;
