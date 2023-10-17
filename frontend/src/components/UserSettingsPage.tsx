import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import fakturki from "../assets/fakturki.png";
import Cookies from "js-cookie";

let firstNameFeedback:string;
let lastNameFeedback:string;
let emailFeedback:string;
let phoneNumberFeedback:string;
let passwordFeedback:string;
let postalCodeFeedback:string;
let cityFeedback:string;
let streetFeedback:string;
let buildingNumberFeedback:string;
let apartmentNumberFeedback:string;
let NIPFeedback:string;

const ResetPasswordPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [NIP, setNIP] = useState('');
  // const [validated, setValidated] = useState(false);
  // const [validatedFirstName, setValidatedFirstName] = useState(false);
  // const [validatedEmail, setValidatedEmail] = useState(false);
  // const [validatedPassword, setValidatedPassword] = useState(false);
  // const [validatedPostalCode, setValidatedPostalCode] = useState(false);
  // const [validatedStreet, setValidatedStreet] = useState(false);
  // const [validatedLastName, setValidatedLastName] = useState(false);
  // const [validatedPhoneNumber, setValidatedPhoneNumber] = useState(false);
  // const [validatedConfirmPassword, setValidatedConfirmPassword] = useState(false);
  // const [validatedCity, setValidatedCity] = useState(false);
  // const [validatedBuildingNumber, setValidatedBuildingNumber] = useState(false);
  // const [validatedApartmentNumber, setValidatedApartmentNumber] = useState(false);
  // const [validatedNIP, setValidatedNIP] = useState(false);
  
  useEffect( () => {
    const user = Cookies.get('user');
    if (user) {
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

  const handleLogOff = () => {
    const user = Cookies.get('user');
    if (user){
      Cookies.remove('user', { path: '/', domain: 'localhost' });
      document.location.href = '/welcome';
    }
  };
  
  const handleGetInfoUserPage = () => {
    const apiUrl = 'http://localhost:8080/setUserSettings';

    const requestBody = {
      firstName:firstName,
      lastName:lastName,
      email: email,
      phoneNumber:phoneNumber,
      password:password,
      postalCode:postalCode,
      city:city,
      street:street,
      buildingNumber:buildingNumber,
      apartmentNumber:apartmentNumber,
      NIP:NIP,
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
      <div className={styles.UserContainer}>
        <div className={styles.logoContainer}>
          <Link to="/HomePage" className={styles.logoLink}>
            <img src={fakturki} alt="Fakturki" className={styles.logo} />
          </Link>
        </div>
          
        <div className={styles.form_container}>
          <div className={styles.leftColumn}>
            <div className={styles.form_group}>
              <label htmlFor="email">Adres e-mail</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="email"
                  id="email"
                  value={email}
                  //   isInvalid={validatedEmail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {emailFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="password">Hasło</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="password"
                  id="password"
                  value={password}
                  //   isInvalid={validatedPassword}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {passwordFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>

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
          </div>


          <div className={styles.rightColumn}>
            <div className={styles.form_group}>
              <label htmlFor="postalCode">Kod pocztowy</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  //   isInvalid={validatedPostalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {postalCodeFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="city">Miasto</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="text"
                  id="city"
                  value={city}
                  //   isInvalid={validatedCity}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {cityFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="street">Ulica</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="text"
                  id="street"
                  value={street}
                  //   isInvalid={validatedStreet}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {streetFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="buildingNumber">Nr budynku</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="text"
                  id="buildingNumber"
                  value={buildingNumber}
                  //   isInvalid={validatedBuildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {buildingNumberFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="apartmentNumber">Nr lokalu</label><br />
              <InputGroup className={styles.inputText} hasValidation>
                <Form.Control
                  type="text"
                  id="apartmentNumber"
                  value={apartmentNumber}
                  //   isInvalid={validatedApartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                />
                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                  {apartmentNumberFeedback}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className='NrNip'>
              <div className={styles.form_group}>
                <label htmlFor="NIP">NIP</label><br />
                <InputGroup className={styles.inputText} hasValidation>
                  <Form.Control
                    type="text"
                    id="NIP"
                    value={NIP}
                    //   isInvalid={validatedNIP}
                    onChange={(e) => setNIP(e.target.value)}
                  />
                  <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                    {NIPFeedback}
                  </Form.Control.Feedback>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.functionalButton}>
          <button onClick={handleGetInfoUserPage} className={styles.registrationButton}>Zapisz zmiany</button>
          <Link to="/HomePage"><button className={styles.backButton}>Powrót</button></Link>
          <Link to="/Login"><button onClick={handleLogOff} className={styles.logOutButton}>Wyloguj</button></Link>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
