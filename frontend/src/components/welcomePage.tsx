import fakturki from "../assets/fakturki.png";
import laptop from "../assets/laptop.png";
import styles from './welcomePage.module.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ButtonsLayoutLogout from "../layouts/ButtonsLayoutLogout.tsx";
import ButtonsLayoutLogin from "../layouts/ButtonsLayoutLogin.tsx";

const welcomePage: React.FC = () => {
const [buttons, setButtons] = useState(true);

    useEffect(() => {
        const user = Cookies.get('user');
        console.log(user)
        console.log(JSON.stringify(user))
        if(user){
            const apiUrl = 'http://localhost:8080/auth';
            
            // const requestBody = {
            //     user: user,
            //   };
            
            fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: user,
            })
            .then((response) => {
            if (!response.ok) {
                throw new Error('Nie ma autoryzacji');
            }
            return response.json();
            })
            .then((data) => {
                console.log(data)
            if(data.success) {
                setButtons(false);
            }else{
                setButtons(true);
                document.location.href = '/welcome';
            }
            })
            .catch((error) => {
                console.log(error);
            });
        }
        console.log(buttons)
    }, []);
    
    return (
      <>
      <div className={styles.background_bottom}>
      <div className={styles.header}>
            <img src={fakturki} alt="Fakturki" className={styles.logo} />
            {buttons===true?<ButtonsLayoutLogout/>:<ButtonsLayoutLogin/>}
        </div>
                <p>Aplikacja Fakturki</p>
                <p id={styles.pStyle}>Finanse i księgowość w jednym miejscu. Zobacz, co jeszcze możesz zyskać.</p>
            </div>
            <div className={styles.laptopContainer}>
                <img src={laptop} alt="Laptop" className={styles.laptop}></img>
            </div>
        <div className={styles.background_bottomm}>
            <p className={styles.help}>Jak aplikacja Fakturki pomoże Twojej firmie?</p>
            
            <div className={styles.row}>
                <div className={styles.column}>
                    <i className="fa-solid fa-server" style={{ fontSize:'5em' }} ></i>
                    <p>Porządek w fakturach</p>
                    <p>Trzymasz porządek w fakturach. Nowe faktury wystawiasz na komputerze przez przeglądarkę</p>
                </div>

                <div className={styles.column}>
                    <i className="fa-solid fa-handshake-angle" style={{ fontSize:'5em' }}></i>
                    <p>Wsparcie księgowe</p>
                    <p>Udzielanie porad w kwestiach związanych z finansami i księgowością</p>
                </div>

                <div className={styles.column}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize:'5em' }}></i>
                    <p>Generowanie faktur do druku (pdf)</p>
                    <p>Generowanie twoich faktur do pdf, możesz w łatwy sposób wydrukować swoją fakturę lub przesłać ją dalej</p>
                </div>
            </div>
        </div>
        
        </>
    
    );
  };

export default welcomePage;
