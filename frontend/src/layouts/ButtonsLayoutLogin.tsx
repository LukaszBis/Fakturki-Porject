import { Link } from 'react-router-dom'
import styles from '../css/welcomePage.module.css';
import Cookies from "js-cookie";

const handleLogOff = () => {
    const user = Cookies.get('user');
    if (user){
      Cookies.remove('user', { path: '/', domain: 'localhost' });
      document.location.href = '/welcome';
    }
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