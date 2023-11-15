import { Link } from 'react-router-dom'
import styles from '../css/welcomePage.module.css';
import Cookies from "js-cookie";

const handleLogOff = () => {
    const user = Cookies.get('user');
    const apiUrl = 'http://localhost:8080/logout';
        
    const requestBody = {
        user: user
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
      console.log(data)
      if(data.success){
        Cookies.remove('user', { path: '/', domain: 'localhost' });
        document.location.href = '/welcome';
      }else{
        console.log("Wylogowywanie sie nie powiodlo")
      }
    })
    .catch((error) => {
        console.log(error);
    });
  };

export default function ButtonsLayout() { 
    return (
        <div className={styles.buttonsContainer}>
            <Link to="/usersettings">
                <button className={styles.loginButton}>
                    <i className="fa-solid fa-user" style={{ fontSize:'1em', marginRight: '0.5em'}}></i>
                    Profil
                </button>
            </Link>
            <Link to="/homePage">
                <button className={styles.registrationButton}>
                    <i className="fa-solid fa-table-columns" style={{ fontSize:'1em', marginRight: '0.5em'}}></i>
                    Twój Panel
                </button>
            </Link>
            <button onClick={handleLogOff} className={styles.registrationButton}>
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize:'1em', marginRight: '0.5em'}}></i>
                Wyloguj
            </button>
        </div>
    )
}