import React, { useState } from 'react';
import styles from './RegistrationPage.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import fakturki from "../assets/fakturki.png";

let firstNameFeedback:string;
let lastNameFeedback:string;
let emailFeedback:string;
let phoneNumberFeedback:string;
let passwordFeedback:string;
let confirmPasswordFeedback:string;
let postalCodeFeedback:string;
let cityFeedback:string;
let streetFeedback:string;
let buildingNumberFeedback:string;
let apartmentNumberFeedback:string;
let NIPFeedback:string;

const RegistrationPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [NIP, setNIP] = useState('');
  // const [validated, setValidated] = useState(false);
  const [validatedFirstName, setValidatedFirstName] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState(false);
  const [validatedPassword, setValidatedPassword] = useState(false);
  const [validatedPostalCode, setValidatedPostalCode] = useState(false);
  const [validatedStreet, setValidatedStreet] = useState(false);
  const [validatedLastName, setValidatedLastName] = useState(false);
  const [validatedPhoneNumber, setValidatedPhoneNumber] = useState(false);
  const [validatedConfirmPassword, setValidatedConfirmPassword] = useState(false);
  const [validatedCity, setValidatedCity] = useState(false);
  const [validatedBuildingNumber, setValidatedBuildingNumber] = useState(false);
  const [validatedApartmentNumber, setValidatedApartmentNumber] = useState(false);
  const [validatedNIP, setValidatedNIP] = useState(false);

  const handleRegistration = () => {
    const apiUrl = 'http://localhost:8080/register';

    const requestBody = {
      firstName: firstName,
      email: email,
      password: password,
      postalCode: postalCode,
      street: street,
      lastName: lastName,
      phoneNumber: phoneNumber,
      confirmPassword: confirmPassword,
      city: city,
      buildingNumber: buildingNumber,
      apartmentNumber: apartmentNumber,
      NIP: NIP,
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
          throw new Error('Register failed');
        }
        return response.json();
      })
      .then((data) => {
        if(data.success) {
          console.log('Register successful:', data);
          document.location.href = '/login';
        }else {
          console.log(data.errors);
          if(data.errors.email != "") {
            setValidatedEmail(true);
            emailFeedback = data.errors.email[0]
          }else{
            setValidatedEmail(false);
          }

          if(data.errors.password != "") {
            setValidatedPassword(true);
            passwordFeedback = data.errors.password[0]
          }else{
            setValidatedPassword(false);
          }

          if(data.errors.confirmPassword != "") {
            setValidatedConfirmPassword(true);
            confirmPasswordFeedback = data.errors.confirmPassword[0]
          }else{
            setValidatedConfirmPassword(false);
          }

          if(data.errors.firstName != "") {
            setValidatedFirstName(true);
            firstNameFeedback = data.errors.firstName[0]
          }else{
            setValidatedFirstName(false);
          }

          if(data.errors.lastName != "") {
            setValidatedLastName(true);
            lastNameFeedback = data.errors.lastName[0]
          }else{
            setValidatedLastName(false);
          }

          if(data.errors.phoneNumber != "") {
            setValidatedPhoneNumber(true);
            phoneNumberFeedback = data.errors.phoneNumber[0]
          }else{
            setValidatedPhoneNumber(false);
          }

          if(data.errors.postalCode != "") {
            setValidatedPostalCode(true);
            postalCodeFeedback = data.errors.postalCode[0]
          }else{
            setValidatedPostalCode(false);
          }

          if(data.errors.city != "") {
            setValidatedCity(true);
            cityFeedback = data.errors.city[0]
          }else{
            setValidatedCity(false);
          }

          if(data.errors.street != "") {
            setValidatedStreet(true);
            streetFeedback = data.errors.street[0]
          }else{
            setValidatedStreet(false);
          }

          if(data.errors.buildingNumber != "") {
            setValidatedBuildingNumber(true);
            buildingNumberFeedback = data.errors.buildingNumber[0]
          }else{
            setValidatedBuildingNumber(false);
          }

          if(data.errors.apartmentNumber != "") {   // nie ma backend
            setValidatedApartmentNumber(true);
            apartmentNumberFeedback = data.errors.apartmentNumber[0]
          }else{
            setValidatedApartmentNumber(false);
          }

          if(data.errors.NIP != "") {
            setValidatedNIP(true);
            NIPFeedback = data.errors.NIP[0]
          }else{
            setValidatedNIP(false);
          }
        }
      });
  };

  return (
    <>
    <div className={styles.logoContainer}>
      <Link to="/welcome" className={styles.logoLink}>
        <img src={fakturki} alt="Fakturki" className={styles.logo} />
      </Link>
    </div>
      <div className={styles.container_register}>

            <h1>Zarejestruj się</h1>
                <div className={styles.labelStyle}>
                  <div className={styles.form_container}>
                      <div className={styles.leftColumn}>
                          <div className={styles.form_group}>
                          <label htmlFor="email">Adres e-mail</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                              type="email"
                              id="email"
                              value={email}
                              isInvalid={validatedEmail}
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
                                  isInvalid={validatedPassword}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {passwordFeedback}
                                </Form.Control.Feedback>
                              </InputGroup>
                          </div>
                          <div className={styles.form_group}>
                              <label htmlFor="confirmPassword">Powtórz hasło</label><br />
                              <InputGroup className={styles.inputText} hasValidation>
                                <Form.Control
                                  type="password"
                                  id="confirmPassword"
                                  value={confirmPassword}
                                  isInvalid={validatedConfirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {confirmPasswordFeedback}
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
                                  isInvalid={validatedFirstName}
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
                                  isInvalid={validatedLastName}
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
                                  isInvalid={validatedPhoneNumber}
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
                                  isInvalid={validatedPostalCode}
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
                                  isInvalid={validatedCity}
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
                                  isInvalid={validatedStreet}
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
                                  isInvalid={validatedBuildingNumber}
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
                                  isInvalid={validatedApartmentNumber}
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
                                      isInvalid={validatedNIP}
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
                </div>      
                
                <button onClick={handleRegistration} className={styles.registrationButton}>Zarejestruj się</button>

          <div className={styles.loginButton}>
            <div>Masz konto? <Link to="/login">Zaloguj się</Link></div>
          </div>
      </div>
    </>
  );
};

export default RegistrationPage;
