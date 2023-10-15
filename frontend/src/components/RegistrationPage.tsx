import React, { useState } from 'react';
import styles from './RegistrationPage.module.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

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
        if(data.success === "") {
          console.log('Register successful:', data);
          //showmodal
        }else {
          if(data.errors.email != "") {
            setValidatedEmail(true);
          }else if(data.errors.password != "") {
            setValidatedPassword(true);
          }else if(data.errors.confirmPassword != "") {
            setValidatedConfirmPassword(true);
          }else if(data.errors.firstName != "") {
            setValidatedFirstName(true);
          }else if(data.errors.lastName != "") {
            setValidatedLastName(true);
          }else if(data.errors.phoneNumber != "") {
            setValidatedPhoneNumber(true);
          }else if(data.errors.postalCode != "") {
            setValidatedPostalCode(true);
          }else if(data.errors.city != "") {
            setValidatedCity(true);
          }else if(data.errors.street != "") {
            setValidatedStreet(true);
          }else if(data.errors.buildingNumber != "") {
            setValidatedBuildingNumber(true);
          }else if(data.errors.apartmentNumber != "") {   // nie ma backend
            setValidatedApartmentNumber(true);
          }else if(data.errors.NIP != "") {
            setValidatedNIP(true);
          }
        }
      });
  };

  return (
    <>
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
                                  value={password}
                                  isInvalid={validatedPassword}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  Wprowadź poprawne hasło.
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
                                  Wprowadź hasło podane wcześniej.
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
                                  Wprowadź imię.
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
                                  Wprowadź nazwisko.
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
                                  Wprowadź numer telefonu.
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
                                  Wprowadź kod pocztowy.
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
                                  Wprowadź nazwę miasta.
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
                                  Wprowadź nazwę ulicy.
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
                                  Wprowadź numer budynku.
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
                                  Wprowadź numer lokalu.
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
                                      Wprowadź NIP.
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
