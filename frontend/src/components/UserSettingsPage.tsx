import React, { useEffect, useState } from 'react';
import styles from './UserSettingsPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import logo from "../assets/fakturki.png"
import LoginData from './LoginData';
import PersonalData from './PersonalData';
import AddressData from './AddressData';
import CompanyData from './CompanyData';

const UserSettingsPage: React.FC = () => {
  const [activeView, setActiveView] = useState('Dane logowania');

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

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
          if (response.status == 500) {
              throw new Error('Błąd serwera');
          }
          return response.json();
        })
        // .then((data) => {
        //     if(!data.success) {
        //         document.location.href = '/welcome';
        //     }
        //     else{
        //       console.log(data)
        //       setFirstName(data.details.firstName)
        //       setLastName(data.details.lastName)
        //       setEmail(data.details.email)
        //       setPhoneNumber(data.details.phoneNumber)
        //       setPostalCode(data.details.postalCode)
        //       setCity(data.details.city)
        //       setStreet(data.details.street)
        //       setBuildingNumber(data.details.buildingNumber)
        //       setApartmentNumber(data.details.apartmentNumber)
        //       setNIP(data.details.NIP)
        //       setEmailActivated_at(data.details.emailActivated_at)
        //     }
        // })
        .catch((error) => {
            console.log(error);
        });
    }else{
      // document.location.href = '/welcome';
    }
  }, []);

  const handleLogOff = () => {
    const user = Cookies.get('user');
    if (user){
      Cookies.remove('user', { path: '/', domain: 'localhost' });
      document.location.href = '/welcome';
    }
  };

  return (
    <>
      <div className={styles.mainContent}>
      <div className={styles.banner}>
      <span className={styles.optionsButton}>
            <Link to="/homePage"><i className="fa-solid fa-arrow-left"></i></Link>
          </span>
        <img src={logo} alt="Fakturki" className={styles.logo} />
        <span className={styles.optionsButton}>
            <Link to="/Login"><button onClick={handleLogOff} className={styles.logOutButton}><i className="fa-solid fa-arrow-right-from-bracket"></i></button></Link>
          </span>
        </div>
        
        <div className={styles.contentHome}>
          <div className={styles.menu}>
            <div className={styles.menuButton}>
              <button onClick={() => handleViewChange('Dane logowania')}>Dane logowania</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => handleViewChange('Dane osobowe')}>Dane osobowe</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => handleViewChange('Dane adresowe')}>Dane adresowe</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => handleViewChange('Dane firmy')}>Dane firmy</button>
            </div>
          </div>

          <div className={styles.form_container}>
            {activeView === 'Dane logowania' && <LoginData />}
            {activeView === 'Dane osobowe' && <PersonalData />}
            {activeView === 'Dane adresowe' && <AddressData />}
            {activeView === 'Dane firmy' && <CompanyData />}
          </div>
        </div>
      </div>
  </>
  );
};

export default UserSettingsPage;
