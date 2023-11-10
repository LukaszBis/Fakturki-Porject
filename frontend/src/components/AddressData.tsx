import React, { useEffect, useState } from 'react';
import styles from './AddressData.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

let postalCodeFeedback:string;
let cityFeedback:string;
let streetFeedback:string;
let buildingNumberFeedback:string;
let apartmentNumberFeedback:string;


const AddressData: React.FC = () => {
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
 

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
            setPostalCode(data.details.postalCode)
            setCity(data.details.city)
            setStreet(data.details.street)
            setBuildingNumber(data.details.buildingNumber)
            setApartmentNumber(data.details.apartmentNumber)
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
    const apiUrl = 'http://localhost:8080/setUserSettings/addressData';

    const requestBody = {
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
              <div className={styles.otherClass}>
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
              </div>
              <div className={styles.buildingClass}>
                <div className={styles.buildingNumber}>
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
                </div>
                <div className={styles.apartmentNumber}>
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
                </div>
              </div>
              {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default AddressData;
