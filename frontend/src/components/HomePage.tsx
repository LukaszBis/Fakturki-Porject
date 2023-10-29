import React, { useEffect, useState } from 'react';
import logo_home from "../assets/logo_home.png";
import styles from "./HomePage.module.css";
import user from "../assets/user.png";
import log_out from "../assets/log_out.png";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import Table from 'react-bootstrap/Table';

interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
}

// interface Invoice { Inferface dla zaliczki
//   id: number;
//   number: string;
//   date: string;
//   amount: number;
// }

// interface Invoice { Inferface dla paragonow
//   id: number;
//   number: string;
//   date: string;
//   amount: number;
// }

const invoices: Invoice[] = [
];

const receipts: Invoice[] = [
  { id: 1, number: 'Paragon1', date: '2023-10-09', amount: 1000 },
  { id: 2, number: 'Paragon2', date: '2023-10-10', amount: 1500 },
  { id: 3, number: 'Paragon3', date: '2023-10-11', amount: 800 },
];

const advances: Invoice[] = [
  { id: 1, number: 'Zaliczka1', date: '2023-10-09', amount: 1000 },
  { id: 2, number: 'Zaliczka2', date: '2023-10-10', amount: 1500 },
  { id: 3, number: 'Zaliczka3', date: '2023-10-11', amount: 800 },
];

const HomePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('invoices');
  const [displayedContent, setDisplayedContent] = useState<Invoice[]>(invoices);
  const [invoiceTable, setInvoiceTable] = useState(invoices)

  useEffect( () => {
    const user = Cookies.get('user');
    if(user){
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
            user: user,
            active: true,
            invoices: true,
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
            }else if(data.active){
              console.log("Aktywuj adres email")
            }else if(data.invoices){
              console.log(data.invoices)
              setInvoiceTable(data.invoices)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
      document.location.href = '/welcome';
    }
  }, []);

  useEffect(() => {
    if (selectedTab === 'invoices') {
      setDisplayedContent(invoiceTable);
    } else if (selectedTab === 'receipts') {
      setDisplayedContent(receipts);
    } else if (selectedTab === 'advances') {
      setDisplayedContent(advances);
    }
  }, [selectedTab]);

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
        <img src={logo_home} alt="Fakturki" className={styles.logo} />
          <div className={styles.companyName}>
            {/* miejsce na nazwe firmy */}
            Fuszerka Sp. z o.o. 
          </div>
          <span className={styles.optionsButton}>
            <Link to="/userSettings"><img src={user} alt="user" width={42} height={42}/></Link>
            <Link to="/Login"><button onClick={handleLogOff} className={styles.logOutButton}><img src={log_out} alt="log_out" width={82} height={82}/></button></Link>
          </span>
        </div>
        
        <div className={styles.contentHome}>
          <div className={styles.menu}>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('invoices')}>Faktury</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('receipts')}>Paragony</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('advances')}>Zaliczki</button>
            </div>
          </div>

          <div className={styles.invoiceTable}>
            <h2>Lista {selectedTab === 'invoices' ? 'Faktur' : selectedTab === 'receipts' ? 'Paragonów' : 'Zaliczek'}</h2>
            <div className="table-responsive">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Numer Faktury</th>
                    <th>Data</th>
                    <th>Kwota</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedContent.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.number}</td>
                      <td>{invoice.date}</td>
                      <td>${invoice.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className={styles.addInvoice}>
            <button className={styles.addInvoiceButton}>
              <Link to="/invoice">Dodaj nową fakturę</Link>
            </button>
          </div>
        </div>
      </div>
  </>
  );
};

export default HomePage;
