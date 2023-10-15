import React, { useEffect, useState } from 'react';
import styles from "./HomePage.module.css";
import user from "../assets/user.png";
import { Link } from 'react-router-dom';

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
  { id: 1, number: 'FH001', date: '2023-10-09', amount: 1000 },
  { id: 2, number: 'FH002', date: '2023-10-10', amount: 1500 },
  { id: 3, number: 'FH003', date: '2023-10-11', amount: 800 },
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

  useEffect(() => {
    if (selectedTab === 'invoices') {
      setDisplayedContent(invoices);
    } else if (selectedTab === 'receipts') {
      setDisplayedContent(receipts);
    } else if (selectedTab === 'advances') {
      setDisplayedContent(advances);
    }
  }, [selectedTab]);

  return (
    <>
      <div className='main'>
        <div className={styles.banner}>
          <div className={styles.titlePage}>Fakturki Home</div>
          <span className={styles.companyName}>
            Nazwa firmy...
          </span>
          <span className={styles.signUpIn}>            
            <Link to="/HomePage"><img src={user} alt="user" width={42} height={42}/></Link>
          </span>
        </div>
        <div className={styles.addInvoice}>
          <button>Dodaj nową fakturę</button>
        </div>

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
        <table>
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
        </table>
      </div>
    </div>
  </>
  );
};

export default HomePage;
