import fakturki from "../assets/fakturki.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './welcomePage.module.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ButtonsLayoutLogout from "../layouts/ButtonsLayoutLogout.tsx";
import ButtonsLayoutLogin from "../layouts/ButtonsLayoutLogin.tsx";
import karuzela from "../assets/karuzela.png"
import karuzela2 from "../assets/karuzela2.png"
import karuzela3 from "../assets/karuzela3.png"

const welcomePage: React.FC = () => {
const [buttons, setButtons] = useState(true);

    useEffect(() => {
        const user = Cookies.get('user');
        if(user){
            const apiUrl = 'http://localhost:8080/auth';
            
            const requestBody = {
                user: user,
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
                    throw new Error('Nie ma autoryzacji');
                }
                return response.json();
            })
            .then((data) => {
                if(data.fail) {
                    setButtons(true);
                }else{
                    setButtons(false);
                    //document.location.href = '/welcome';
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
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
        <div className={styles.karuzela}>
            {/* <img src={laptop} alt="Laptop" className={styles.laptop}></img> */}
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" >
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active" draggable="false"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1" draggable="false"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2" draggable="false"></li>
                </ol>
                <div className="carousel-inner" id={styles.karuzelacenter}>
                    <div className="carousel-item active" >
                        <img className={styles.d_block} src={karuzela} alt="First slide" draggable="false"/>
                    </div>
                    <div className="carousel-item" >
                        <img className={styles.d_block} src={karuzela2} alt="Second slide" draggable="false"/>
                    </div>
                    <div className="carousel-item" >
                        <img className={styles.d_block} src={karuzela3} alt="Third slide" draggable="false"/>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" draggable="false">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" draggable="false">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
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
