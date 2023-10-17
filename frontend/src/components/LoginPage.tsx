import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import fakturki from "../assets/fakturki.png";
import Cookies from "js-cookie";

var failFeedback:string;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validatedEmail] = useState(false);
  const [validatedPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect( () => {
    const user = Cookies.get('user');
    if (user) {
      setLoggedInUser(JSON.parse(user));
      const apiUrl = 'http://localhost:8080/auth';
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Nie ma autoryzacji');
          }
          return response.json();
        })
        .then((data) => {
          if(data.fail) {
            document.location.href = '/welcome';
          }
          
        });
    }else{
      document.location.href = '/welcome';
    }
  }, []);

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
        console.log('user: ', Cookies.get('user'))
        if(data.success) {
          console.log('Login successful:', data);
          Cookies.set('user', JSON.stringify(data.success), { expires: 7 });
          console.log('user: ', Cookies.get('user'))
          setLoggedInUser(data.success);
          if (loggedInUser) {
            console.log(data.success);
            //document.location.href = '/HomePage';
          } else {
            //document.location.href = '/login';
          }
        }else {
          console.log(data.fail);
            if(data.fail){
              failFeedback = data.fail
            }
        }
      });
    };

  return (
    <>
    
    <div className={styles.container}>
    <div className={styles.logoContainer}>
      <Link to="/welcome" className={styles.logoLink}>
        <img src={fakturki} alt="Fakturki" className={styles.logo} />
      </Link>
    </div>
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
                    {failFeedback}
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
