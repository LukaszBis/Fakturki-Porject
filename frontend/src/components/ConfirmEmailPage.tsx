import React, { useEffect, useState } from 'react';
import styles from './ConfirmEmailPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import fakturki from "../assets/fakturki.png";

var success = false;

const NewPasswordPage: React.FC = () => {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
        // Jeśli token został znaleziony w adresie URL, ustaw go w stanie komponentu

        const apiUrl = 'http://localhost:8080/active';

        const requestBody = {
            token: tokenParam,
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
              throw new Error('Failed');
            }
            return response.json();
          })
          .then((data) => {
            if(data.success) {
              console.log('Success:', data.success);
              success = true;
              document.location.href = '/homePage',{success};
            }else {
              console.log('Cos sie pospuslo:', data.fail);
              document.location.href = '/welcome';
            }
          });
        }
    }, []); // useEffect zostanie uruchomiony tylko raz po pierwszym renderowaniu komponentu
  return (
    <>
    
    <div className={styles.container_new}>
      <div className={styles.logoContainer}>
        <Link to="/welcome" className={styles.logoLink}>
          <img src={fakturki} alt="Fakturki" className={styles.logo} />
        </Link>
      </div>
    </div>
    </>
  );
};

export default NewPasswordPage;
