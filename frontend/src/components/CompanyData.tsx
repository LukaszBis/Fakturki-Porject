import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";

let NIPFeedback:string;
let accountNumberFeedback:string;


const CompanyData: React.FC = () => {
  const [NIP, setNIP] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [NIPChanged, setNIPChanged] = useState(false);
  const [accountNumberChanged, setAccountNumberChanged] = useState(false);
 

//   const [validated, setValidated] = useState(false);
  
  
  useEffect( () => {
    const user = Cookies.get('user');
    if(user){
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
            user: user,
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
            if (!response.ok) {
                throw new Error('Nie ma autoryzacji');
            }
            return response.json();
        })
        .then((data) => {
          if(data.active){
            console.log("Aktywuj adres email")
          }else if(data.details){
            setNIP(data.details.NIP)
            setAccountNumber(data.details.accountNumber)
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
      else if(data.errors.NIP[0])
      {
        console.log(data.errors.NIP[0]);
        NIPFeedback = data.errors.NIP[0];
      }
      if(data.updated.accountNumber) 
      {
        console.log("Account number updated");
        setAccountNumberChanged(true);
      }
      else if(data.errors.accountNumber[0])
      {
        console.log(data.errors.accountNumber[0]);
        accountNumberFeedback = data.errors.accountNumber[0];
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
                      //   isInvalid={validatedNIP}
                      onChange={(e) => setNIP(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {NIPFeedback}
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
                      //   isInvalid={validatedAccountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                      {accountNumberFeedback}
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
