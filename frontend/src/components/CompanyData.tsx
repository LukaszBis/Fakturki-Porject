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
            if (!response.ok) {
                throw new Error('Nie ma autoryzacji');
            }
            return response.json();
        })
        .then((data) => {
            if(!data.success) {
                document.location.href = '/welcome';
            }else{
              console.log(data)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
      document.location.href = '/welcome';
    }
  }, []);

  
  const handleGetInfoUserPage = () => {
    const apiUrl = 'http://localhost:8080/setUserSettings/companyData';

    const requestBody = {
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
                {<button onClick={handleGetInfoUserPage} className={styles.buttonEdit}>Zmień</button>}
            </div>
        </div>
    </>
  );
};

export default CompanyData;
