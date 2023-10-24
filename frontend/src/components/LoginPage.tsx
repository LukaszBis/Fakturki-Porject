import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import fakturki from "../assets/fakturki.png";
import Cookies from "js-cookie";

let failFeedback:string;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [loggedInUser, setLoggedInUser] = useState(null);
  
  const [validated, setValidated] = useState(false);

  useEffect( () => {
    const user = Cookies.get('user');
    if(user){
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
            user: user,
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
                throw new Error('Nie ma autoryzacji');
            }
            return response.json();
        })
        .then((data) => {
            if(data.success) {
              document.location.href = '/HomePage';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
  }, []);

  const checkEnter = (event: any) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      handleLogin();
    }
  }

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
        //console.log('user: ', Cookies.get('user'))
        if(data.success) {
          //console.log('Login successful:', data);
          Cookies.set('user', data.success, { expires: 7 });
          //console.log('user: ', Cookies.get('user'))
          //setLoggedInUser(data.success);
          //if (loggedInUser) {
            //console.log(data.success);
            document.location.href = '/HomePage';
          //} else {
            //document.location.href = '/login';
          //}
        }else {
          console.log(data.fail);
          if(data.fail != "") {
            setValidated(true);
            failFeedback = data.fail;
          }else{
            setValidated(false);
          }
        }
      });
    };

    document.addEventListener("keydown", checkEnter);

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
                  <label htmlFor="email">Adres e-mail</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="email"
                      id="email"
                      placeholder='example@mail.com'
                      value={email}
                      isInvalid={validated}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      
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
                      isInvalid={validated}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {failFeedback}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
              </div>
              <button onClick={handleLogin} type='submit' className={styles.logIn}>Zaloguj się</button>
          <div className={styles.plusButton}>
            <div>Zapomniałeś hasła? <Link to="/reset">Zresetuj hasło</Link></div>
            <div>Nie masz konta? <Link to="/registration">Zarejestruj się</Link></div>
          </div>
      </div>
    </>
  );
};

export default LoginPage;
