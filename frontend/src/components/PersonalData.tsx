import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

let firstNameFeedback:string;
let lastNameFeedback:string;
let phoneNumberFeedback:string;


const PersonalData: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
 

//   const [validated, setValidated] = useState(false);
  
  
  useEffect( () => {
    const user = Cookies.get('user');
    const details = true;
    const active = true;
    if(user){
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
            user: user,
            details: details,
            active: active,
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
          }else if(data.details){
            setFirstName(data.details.firstName)
            setLastName(data.details.lastName)
            setPhoneNumber(data.details.phoneNumber)
          }else{
            document.location.href = '/welcome';
          }
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
      // document.location.href = '/welcome';
    }
  }, []);

  
  const handleGetInfoUserPage = () => {
    const apiUrl = 'http://localhost:8080/setUserSettings/personalData';

    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber
    };
    console.log(requestBody)
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error('Reset password failed: User not found');
    //   }
    //   return response.json();
    // })
    // .then((data) => {
    //   if(data.success) 
    //   {
    //     console.log('Correct email:', data.success);
    //   }
    //   else
    //   {
    //     console.log('Correct email:', data.fail);
    //   }
    // });
  };

  return (
    <>
        <div className={styles.form_container}>
            <div className={styles.contentForm}>
              <div className={styles.form_group}>
                <label htmlFor="firstName">Imię</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="text"
                    id="firstName"
                    value={firstName}
                    //   isInvalid={validatedFirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    {firstNameFeedback}
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="lastName">Nazwisko</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="text"
                    id="lastName"
                    value={lastName}
                    //   isInvalid={validatedLastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    {lastNameFeedback}
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="phoneNumber">Nr telefonu</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      //   isInvalid={validatedPhoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {phoneNumberFeedback}
                    </Form.Control.Feedback>
                  </InputGroup>
              </div>
              {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default PersonalData;
