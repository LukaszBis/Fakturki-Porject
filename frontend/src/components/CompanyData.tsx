import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

// let NIPFeedback:string;
// let accountNumberFeedback:string;


const CompanyData: React.FC = () => {
  const [NIP, setNIP] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [NIPChanged, setNIPChanged] = useState(false);
  const [accountNumberChanged, setAccountNumberChanged] = useState(false);
  const [feedbackValues, setFeedbackValues] = useState({
    NIP: '',
    accountNumber: ''
  })
  const [validatedValues, setValidatedValues] = useState({
    NIP: false,
    accountNumber: false
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
            if (!response.ok) {
                throw new Error('Nie ma autoryzacji');
            }
            return response.json();
        })
        .then((data) => {
          setNIP(data.details.NIP)
          setAccountNumber(data.details.accountNumber)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

  
  const handleGetInfoUserPage = () => {
    const user = Cookies.get('user');
    const apiUrl = 'http://localhost:8080/setUserSettings/companyData';

    const requestBody = {
      user: user,
      NIP: NIP,
      accountNumber: accountNumber
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
      if(data.updated.NIP) 
      {
        console.log("NIP updated");
        setNIPChanged(true);
      }
      if(data.updated.accountNumber) 
      {
        console.log("Account number updated");
        setAccountNumberChanged(true);
      }
      if(data.errors){
        console.log(data.errors)
        if(data.errors.NIP.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              NIP: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              NIP: data.errors.NIP[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            NIP: false
          }));
        }
        if(data.errors.accountNumber.length != 0) {
          setValidatedValues((prev) => ({
              ...prev, 
              accountNumber: true
          }));
          setFeedbackValues((prev) => ({
              ...prev, 
              accountNumber: data.errors.accountNumber[0]
          }));
          // feedbackValues.client = data.errors.client[0]
        }else{
          setValidatedValues((prev) => ({
            ...prev, 
            accountNumber: false
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
                  <label htmlFor="NIP">NIP</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="NIP"
                      value={NIP}
                        isInvalid={validatedValues.NIP}
                      onChange={(e) => setNIP(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.NIP}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                  {NIPChanged && <div className={styles.successMessage}>NIP został zmieniony</div>}
                <div className={styles.form_group}>
                  <label htmlFor="accountNumber">Nr konta</label><br />
                  <InputGroup className={styles.inputText} hasValidation>
                    <Form.Control
                      type="text"
                      id="accountNumber"
                      value={accountNumber}
                        isInvalid={validatedValues.accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {feedbackValues.accountNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
                </div>
                  {accountNumberChanged && <div className={styles.successMessage}>Numer konta został zmieniony</div>}
                {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default CompanyData;
