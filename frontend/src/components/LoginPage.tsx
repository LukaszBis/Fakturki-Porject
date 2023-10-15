import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validatedEmail, setValidatedEmail] = useState(false);
  const [validatedPassword, setValidatedPassword] = useState(false);

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
        if(data.success === "") {
          console.log('Login successful:', data);
          //showmodal
        }else {
          console.log(data.fail, setValidatedEmail, setValidatedPassword);
        }
      });
    };

  return (
    <>
    <div className={styles.container}>
          <h1>Zaloguj się</h1>
          
            <div className={styles.loginStyle}>
              <div className={styles.form_group}>
                <label htmlFor="username">Adres e-mail</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="email"
                    id="email"
                    placeholder='example@mail.com'
                    value={email}
                    isInvalid={validatedEmail}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    Wprowadź poprawny email.
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="password">Hasło</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder='********'
                    value={password}
                    isInvalid={validatedPassword}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    Wprowadź poprawne hasło.
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
            </div>
            <button onClick={handleLogin} className={styles.logIn}>Zaloguj się</button>
        <div className={styles.plusButton}>
          <div>Zapomniałeś hasła? <Link to="/reset">Zresetuj hasło</Link></div>
          <div>Nie masz konta? <Link to="/registration">Zarejestruj się</Link></div>
        </div>
    </div>
    </>
  );
};

export default LoginPage;
