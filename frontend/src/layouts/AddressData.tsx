import React, { useEffect, useState } from 'react';
import styles from '../css/AddressData.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

// let postalCodeFeedback:string;
// let cityFeedback:string;
// let streetFeedback:string;
// let buildingNumberFeedback:string;
// let apartmentNumberFeedback:string;


const AddressData: React.FC = () => {
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [postalCodeChanged, setPostalCodeChanged] = useState(false);
  const [cityChanged, setCityChanged] = useState(false);
  const [streetChanged, setStreetChanged] = useState(false);
  const [buildingNumberChanged, setBuildingNumberChanged] = useState(false);
  const [apartmentNumberChanged, setApartmentNumberChanged] = useState(false);
  const [feedbackValues, setFeedbackValues] = useState({
    postalCode: '',
    city: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: ''
})
const [validatedValues, setValidatedValues] = useState({
  postalCode: false,
  city: false,
  street: false,
  buildingNumber: false,
  apartmentNumber: false
})
 

//   const [validated, setValidated] = useState(false);
  
  
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
          setPostalCode(data.details.postalCode)
          setCity(data.details.city)
          setStreet(data.details.street)
          setBuildingNumber(data.details.buildingNumber)
          setApartmentNumber(data.details.apartmentNumber)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

  
  const handleGetInfoUserPage = () => {
    const user = Cookies.get('user');
    const apiUrl = 'http://localhost:8080/setUserSettings/addressData';

    const requestBody = {
      user: user,
      postalCode: postalCode,
      city: city,
      street: street,
      buildingNumber: buildingNumber,
      apartmentNumber: apartmentNumber
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
      console.log(data.errors)
      if(data.updated.postalCode) 
      {
        console.log("Postal code updated");
        setPostalCodeChanged(true);
      }
      if(data.updated.city) 
      {
        console.log("City updated");
        setCityChanged(true);
      }
      if(data.updated.street) 
      {
        console.log("Street updated");
        setStreetChanged(true);
      }
      if(data.updated.buildingNumber) 
      {
        console.log("Building number updated");
        setBuildingNumberChanged(true);
      }
      if(data.updated.apartmentNumber) 
      {
        console.log("Apartment number updated");
        setApartmentNumberChanged(true);
      }
      
      if(data.errors.postalCode.length != 0) {
        setValidatedValues((prev) => ({
            ...prev, 
            postalCode: true
        }));
        setFeedbackValues((prev) => ({
            ...prev, 
            postalCode: data.errors.postalCode[0]
        }));
        // feedbackValues.client = data.errors.client[0]
      }else{
        setValidatedValues((prev) => ({
          ...prev, 
          postalCode: false
        }));
      }
      if(data.errors.city.length != 0) {
        setValidatedValues((prev) => ({
            ...prev, 
            city: true
        }));
        setFeedbackValues((prev) => ({
            ...prev, 
            city: data.errors.city[0]
        }));
        // feedbackValues.client = data.errors.client[0]
      }else{
          setValidatedValues((prev) => ({
            ...prev, 
            city: false
          }));
      }
    
      if(data.errors.street.length != 0) {
        setValidatedValues((prev) => ({
            ...prev, 
            street: true
        }));
        setFeedbackValues((prev) => ({
            ...prev, 
            street: data.errors.street[0]
        }));
        // feedbackValues.client = data.errors.client[0]
      }else{
        setValidatedValues((prev) => ({
            ...prev, 
            street: false
        }));
      }

      if(data.errors.buildingNumber.length != 0) {
        setValidatedValues((prev) => ({
            ...prev, 
            buildingNumber: true
        }));
        setFeedbackValues((prev) => ({
            ...prev, 
            buildingNumber: data.errors.buildingNumber[0]
        }));
        // feedbackValues.client = data.errors.client[0]
      }else{
        setValidatedValues((prev) => ({
          ...prev, 
          buildingNumber: false
        }));
      }

      if(data.errors.apartmentNumber.length != 0) {
        setValidatedValues((prev) => ({
            ...prev, 
            apartmentNumber: true
        }));
        setFeedbackValues((prev) => ({
            ...prev, 
            apartmentNumber: data.errors.apartmentNumber[0]
        }));
        // feedbackValues.client = data.errors.client[0]
      }else{
        setValidatedValues((prev) => ({
          ...prev, 
          apartmentNumber: false
        }));
      }

    });
  };
console.log(feedbackValues)
  return (
    <>
        <div className={styles.form_container}>
            <div className={styles.contentForm}>
              <div className={styles.otherClass}>
                <div className={styles.form_group}>
                  <label htmlFor="postalCode">Kod pocztowy</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      isInvalid={validatedValues.postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.postalCode}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                  {postalCodeChanged && <div className={styles.successMessage}>Kod pocztowy został zmieniony</div>}
                <div className={styles.form_group}>
                  <label htmlFor="city">Miasto</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="city"
                      value={city}
                        isInvalid={validatedValues.city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.city}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                  {cityChanged && <div className={styles.successMessage}>Miasto zostało zmienione</div>}
                <div className={styles.form_group}>
                  <label htmlFor="street">Ulica</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="street"
                      value={street}
                        isInvalid={validatedValues.street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.street}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
              </div>
                {streetChanged && <div className={styles.successMessage}>Ulica została zmieniona</div>}
              <div className={styles.buildingClass}>
                <div className={styles.buildingNumber}>
                  <div className={styles.form_group}>
                    <label htmlFor="buildingNumber">Nr budynku</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                      <Form.Control
                        type="text"
                        id="buildingNumber"
                        value={buildingNumber}
                          isInvalid={validatedValues.buildingNumber}
                        onChange={(e) => setBuildingNumber(e.target.value)}
                      />
                      <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.buildingNumber}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </div>
                  {buildingNumberChanged && <div className={styles.successMessage}>Numer budynku został zmieniony</div>}
                </div>
                <div className={styles.apartmentNumber}>
                  <div className={styles.form_group}>
                    <label htmlFor="apartmentNumber">Nr lokalu</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                      <Form.Control
                        type="text"
                        id="apartmentNumber"
                        value={apartmentNumber}
                          isInvalid={validatedValues.apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                      />
                      <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.apartmentNumber}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </div>
                  {apartmentNumberChanged && <div className={styles.successMessage}>Numer lokalu został zmieniony</div>}
                </div>
              </div>
              {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default AddressData;
