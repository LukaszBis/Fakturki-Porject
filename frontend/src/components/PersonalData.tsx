import React, { useEffect, useState } from 'react';
import styles from '../css/UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

// let firstNameFeedback:string;
// let lastNameFeedback:string;
// let phoneNumberFeedback:string;


const PersonalData: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstNameChanged, setFirstNameChanged] = useState(false);
  const [lastNameChanged, setLastNameChanged] = useState(false);
  const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);
  const [feedbackValues, setFeedbackValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  })
  const [validatedValues, setValidatedValues] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false
  })

//   const [validated, setValidated] = useState(false);
  
  
  // useEffect( () => {
  //   const user = Cookies.get('user');
  //   if(user){
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
  //         }else if(data.details){
  //           setFirstName(data.details.firstName)
  //           setLastName(data.details.lastName)
  //           setPhoneNumber(data.details.phoneNumber)
  //         }else{
  //           document.location.href = '/welcome';
  //         }
  //       })
  //       .catch((error) => {
  //           console.log(error);
  //       });
  //   }else{
  //     // document.location.href = '/welcome';
  //   }
  // }, []);

    useEffect( () => {
        const apiUrl = 'http://localhost:8080/userSettings';
        
        const requestBody = {
            user: Cookies.get('user'),
            details: true,
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
          console.log(data.details)
          setFirstName(data.details.firstName)
          setLastName(data.details.lastName)
          setPhoneNumber(data.details.phoneNumber)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);
  
  const handleGetInfoUserPage = () => {
    const user = Cookies.get('user');
    const apiUrl = 'http://localhost:8080/setUserSettings/personalData';

    const requestBody = {
      user: user,
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
    .then((response) => {
      if (!response.ok) {
        throw new Error('Reset password failed: User not found');
      }
      return response.json();
    })
    .then((data) => {
      if(data.updated.firstName) 
      {
        console.log("Firstname updated");
        setFirstNameChanged(true);
      }
      if(data.updated.lastName) 
      {
        console.log("Lastname updated");
        setLastNameChanged(true);
      }
      if(data.updated.phoneNumber) 
      {
        console.log("Phone number updated");
        setPhoneNumberChanged(true);
      }
      if(data.errors){
        console.log(data.errors)
        if(data.errors.firstName.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              firstName: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              firstName: data.errors.firstName[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            firstName: false
          }));
        }
        if(data.errors.lastName.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              lastName: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              lastName: data.errors.lastName[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            lastName: false
          }));
        }
        if(data.errors.phoneNumber.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              phoneNumber: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              phoneNumber: data.errors.phoneNumber[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            phoneNumber: false
          }));
        }
      }
    });
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
                      isInvalid={validatedValues.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    {feedbackValues.firstName}
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
                {firstNameChanged && <div className={styles.successMessage}>Imię zostało zmienione</div>}
              <div className={styles.form_group}>
                <label htmlFor="lastName">Nazwisko</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="text"
                    id="lastName"
                    value={lastName}
                      isInvalid={validatedValues.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    {feedbackValues.lastName}
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
                {lastNameChanged && <div className={styles.successMessage}>Nazwisko zostało zmienione</div>}
              <div className={styles.form_group}>
                <label htmlFor="phoneNumber">Nr telefonu</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                        isInvalid={validatedValues.phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.phoneNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
              </div>
                {phoneNumberChanged && <div className={styles.successMessage}>Numer telefonu został zmieniony</div>}
              {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default PersonalData;
