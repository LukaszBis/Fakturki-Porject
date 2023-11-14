import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

// let emailFeedback:string;
// let passwordFeedback:string;
// let newPasswordFeedback:string;
// let confirmPasswordFeedback:string;

const LoginData: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailActivated_at, setEmailActivated_at] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [feedbackValues, setFeedbackValues] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [validatedValues, setValidatedValues] = useState({
    email: false,
    password: false,
    newPassword: false,
    confirmPassword: false
  })

//   const [validated, setValidated] = useState(false);
//   const [validatedEmail, setValidatedEmail] = useState(false);
//   const [validatedPassword, setValidatedPassword] = useState(false);
//   const [validatedNewPassword, setValidatedNewPassword] = useState(false);
  // const [validatedConfirmPassword, setValidatedConfirmPassword] = useState(false);
  
  
  // useEffect( () => {
  //   const user = Cookies.get('user');
  //   if(user != ''){
  //       const apiUrl = 'http://localhost:8080/auth';
        
  //       const requestBody = {
  //           user: user,
  //           details: true,
  //           active: true,
  //       };
  //       console.log(requestBody)
  //       fetch(apiUrl, {
  //           method: 'POST',
  //           headers: {
  //           'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(requestBody),
  //       })
  //       .then((response) => {
  //         if (response.status == 500) {
  //             throw new Error('Błąd serwera');
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         if(data.active){
  //           console.log("Aktywuj adres email")
  //           setEmailActivated_at(data.active)
  //         }
  //         if(data.details){
  //           console.log(data.details)
  //           setEmail(data.details.email)
  //         }
  //       })
  //       .catch((error) => {
  //           console.log(error);
  //       });
  //   }else{
  //     document.location.href = '/welcome';
  //   }
  // }, []);


  useEffect( () => {
        const apiUrl = 'http://localhost:8080/userSettings';
        
        const requestBody = {
            user: Cookies.get('user'),
            details: true,
            active: true,
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
          if (response.status == 500) {
              throw new Error('Błąd serwera');
          }
          return response.json();
        })
        .then((data) => {
          if(data.active){
            console.log("Aktywuj adres email")
            setEmailActivated_at(data.active)
          }
          if(data.details){
            console.log(data.details)
            setEmail(data.details.email)
          }
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);
  
  const handleGetInfoUserPage = () => {
    const user = Cookies.get('user');
    const apiUrl = 'http://localhost:8080/setUserSettings/loginData';

    const requestBody = {
      user: user,
      email: email,
      password: password,
      newPassword: newPassword,
      confirmPassword: confirmPassword
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
      if(data.updated.email) 
      {
        //data.updated.email true jeśli email został zmieniony
        console.log("Email updated");
        setEmailChanged(true);
      }
      if(data.updated.password){
        console.log("Hasło zostało pomyślnie zmienione");
        setPasswordChanged(true);
      }
      if(data.errors){
        console.log(data.errors)
        if(data.errors.email.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              email: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              email: data.errors.email[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            email: false
          }));
        }
        if(data.errors.password.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              password: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              password: data.errors.password[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            password: false
          }));
        }
        if(data.errors.confirmPassword.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              confirmPassword: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              confirmPassword: data.errors.confirmPassword[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            confirmPassword: false
          }));
        }
        if(data.errors.newPassword.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              newPassword: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              newPassword: data.errors.newPassword[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            newPassword: false
          }));
        }
      }
    });
  };
  
  const handleReactivate = () => {
    const apiUrl = 'http://localhost:8080/reactivate';

    const requestBody = {
      email:email
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
      if (response.status == 500) {
        throw new Error('Błąd serwera');
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
        <div className={styles.form_container}>
            <div className={styles.contentForm}>
                <div className={styles.form_group}>
                    <label htmlFor="email">Adres e-mail</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                        type="email"
                        id="email"
                        value={email}
                        isInvalid={validatedValues.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.email}
                    </Form.Control.Feedback>
                    </InputGroup>
                </div>
                {emailChanged && <div className={styles.successMessage}>Email został zmieniony</div>}
                {emailActivated_at ? <button onClick={handleReactivate}>Wyślij potwierdzenie</button> : null}
                <div className={styles.form_group}>
                    <label htmlFor="password">Bieżące hasło</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                        type="password"
                        id="password"
                        value={password}
                        isInvalid={validatedValues.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.password}
                    </Form.Control.Feedback>
                    </InputGroup>
                </div>
                  {passwordChanged && <div className={styles.successMessage}>Hasło zostało zmienione</div>}
                <div className={styles.form_group}>
                    <label htmlFor="newPassword">Nowe hasło</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        isInvalid={validatedValues.newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.newPassword}
                    </Form.Control.Feedback>
                    </InputGroup>
                </div>
                <div className={styles.form_group}>
                    <label htmlFor="confirmPassword">Potwierdź nowe hasło</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        isInvalid={validatedValues.confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.confirmPassword}
                    </Form.Control.Feedback>
                    </InputGroup>
                </div>
                {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default LoginData;
