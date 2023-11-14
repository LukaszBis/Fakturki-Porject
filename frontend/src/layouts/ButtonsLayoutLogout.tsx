import { Link } from 'react-router-dom'
import styles from '../css/welcomePage.module.css';

export default function ButtonsLayout() { 
    return (
        <div className={styles.buttonsContainer}>
            <Link to="/login">
                <button className={styles.loginButton}>
                <i className="fa-solid fa-lock" style={{ fontSize:'1em', marginRight: '0.5em'}} ></i>
                    Logowanie
                </button>
            </Link>
            <Link to="/registration">
                <button className={styles.registrationButton}>
                    Rejestracja
                </button>
            </Link>
        </div>
    )
}