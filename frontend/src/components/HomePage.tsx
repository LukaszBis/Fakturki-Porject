import React, { useEffect, useState } from 'react';
import logo_home from "../assets/logo_home.png";
import styles from "./HomePage.module.css";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import Table from 'react-bootstrap/Table';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

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

var invoice:any = []

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
  const [selectedTab, setSelectedTab] = useState('invoice');
  const [, setDisplayedContent] = useState<Invoice[]>(invoices);
  // const [invoiceTmp, ] = useState([])
  const [invoiceTable, setInvoiceTable] = useState(invoice)
  const [email, setEmail] = useState("")
  const [active, setActive] = useState(true)
  const [company, setCompany] = useState("")

  // function AddNewRow(){
  //   setInvoiceTable([...invoiceTable,invoiceTmp[0]])
  // }

  useEffect( () => {
    const user = Cookies.get('user');
    if(user){
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
            user: user,
            active: true,
            invoices: true,
            details: true
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
          if(data.active){
            setActive(false)
            console.log("Aktywuj adres email")
          }else{
            if(data.invoices){
              invoice = data.invoices
              setInvoiceTable(invoice)
              console.log("invoice id:", invoice[0]._id)
              // AddNewRow()
              console.log(invoiceTable)
            }
            if(data.details){
              setCompany(data.details.company)
            }
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
  
  const handleSend = (id:any, email:any) => {
    const apiUrl = 'http://localhost:8080/sendPdf';
    
    const requestBody = {
      id:id,
      email:email
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
          throw new Error('Błąd serwera');
        }
        return response.json();
      })
      .then((data) => {
        if(data.success) {
          console.log(data.success);
        }else {
          console.log("Nie działa");
        }
      });
  };

  const handleDelete = (id:any) => {
    const apiUrl = 'http://localhost:8080/invoiceDelete';
    
    const requestBody = {
      id:id
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
          throw new Error('Błąd serwera');
        }
        return response.json();
      })
      .then((data) => {
        if(data.success) {
          console.log(data.success);
        }else {
          console.log("Nie działa");
        }
      });
  };
  
  return (
    <>
      <div className={styles.mainContent}>
        <div className={styles.banner}>
        <img src={logo_home} alt="Fakturki" className={styles.logo} />
          <div className={styles.companyName}>
            {company}
            {/* Fuszerka Sp. z o.o.  */}
          </div>
          <span className={styles.optionsButton}>
            <Link to="/userSettings"><i className="fa-regular fa-circle-user"></i></Link>
            <Link to="/Login"><button onClick={handleLogOff} className={styles.logOutButton}><i className="fa-solid fa-arrow-right-from-bracket"></i></button></Link>
          </span>
        </div>
        
        <div className={styles.contentHome}>
          <div className={styles.menu}>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('invoice')}>Faktury</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('receipts')}>Paragony</button>
            </div>
            <div className={styles.menuButton}>
              <button onClick={() => setSelectedTab('advances')}>Zaliczki</button>
            </div>
          </div>

          <div className={styles.invoiceTable}>
            {active?
              <h2>Lista 
              {selectedTab === 'invoice' ? ' Faktur' : selectedTab === 'receipts' ? ' Paragonów' : ' Zaliczek'}</h2>  
              :null}
            <div className="table-responsive">
              {active? 
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Data Wystawienia</th>
                    <th>Nazwa</th>
                    <th>Klient</th>
                    <th>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTab === 'invoice' ? 
                    invoice.map((inv:any) => (
                      <tr key={inv._id}>
                        <td>{inv.dateIssuance.split("T")[0]}</td>
                        <td>{inv.name}</td>
                        <td>{inv.clientNIP}</td>
                        <td>{inv.totalPrice}</td>
                        <td className={styles.sddButton} id={styles.leftBorder}>
                        <Popup trigger={<button className={styles.sendButton}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button>} position="left center">
                          <div>
                            <input type='email' onChange={(e) => setEmail(e.target.value)}/><br/>
                            <button onClick={(_) => handleSend(inv._id, email)}>Send</button>
                          </div>
                        </Popup>
                        </td>
                        {/* <td className={styles.sddButton} id={styles.leftBorder}><button className={styles.sendButton} onClick={(_) => handleSend(inv._id)}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button></td> */}
                        <td className={styles.sddButton} id={styles.colorGreen}><a href={`http://localhost:8080/downloadPdf?id=${inv._id}`}><button className={styles.downloadButton}><i className="fa-solid fa-download fa-sm"></i></button></a></td>
                        <td className={styles.sddButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={(_) => handleDelete(inv._id)}><i className="fa-solid fa-trash fa-sm"></i></button></td>
                      </tr>
                      // <a href={`http://localhost:8080/invoiceDelete?id=${inv._id}`}></a>
                    )) : selectedTab === 'receipts' ?
                    receipts.map((inv:any) => (
                      <tr key={inv.id}>
                        <td>{inv.number}</td>
                        <td>{inv.date}</td>
                        <td>{inv.amount}</td>
                        <td></td>
                        <td className={styles.sddButton} id={styles.leftBorder}>
                        <Popup trigger={<button className={styles.sendButton}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button>} position="left center">
                          <div>
                            <input type='email' onChange={(e) => setEmail(e.target.value)}/><br/>
                            <button onClick={(_) => handleSend(inv._id, email)}>Send</button>
                          </div>
                        </Popup>
                        </td>
                        {/* <td className={styles.sddButton} id={styles.leftBorder}><button className={styles.sendButton} onClick={(_) => handleSend(inv._id)}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button></td> */}
                        <td className={styles.sddButton} id={styles.colorGreen}><a href={`http://localhost:8080/downloadPdf?id=${inv._id}`}><button className={styles.downloadButton}><i className="fa-solid fa-download fa-sm"></i></button></a></td>
                        <td className={styles.sddButton} id={styles.colorRed}><a href={`http://localhost:8080/invoiceDelete?id=${inv._id}`}><button className={styles.deleteButton}><i className="fa-solid fa-trash fa-sm"></i></button></a></td>
                      </tr>
                    )) :
                    advances.map((inv:any) => (
                      <tr key={inv.id}>
                        <td>{inv.number}</td>
                        <td>{inv.date}</td>
                        <td>{inv.amount}</td>
                        <td></td>
                        <td className={styles.sddButton} id={styles.leftBorder}>
                        <Popup trigger={<button className={styles.sendButton}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button>} position="left center">
                          <div>
                            <input type='email' onChange={(e) => setEmail(e.target.value)}/><br/>
                            <button onClick={(_) => handleSend(inv._id, email)}>Send</button>
                          </div>
                        </Popup>
                        </td>
                        {/* <td className={styles.sddButton} id={styles.leftBorder}><button className={styles.sendButton} onClick={(_) => handleSend(inv._id)}><i className="fa-solid fa-envelope-open-text fa-sm"></i></button></td> */}
                        <td className={styles.sddButton} id={styles.colorGreen}><a href={`http://localhost:8080/downloadPdf?id=${inv._id}`}><button className={styles.downloadButton}><i className="fa-solid fa-download fa-sm"></i></button></a></td>
                        <td className={styles.sddButton} id={styles.colorRed}><a href={`http://localhost:8080/invoiceDelete?id=${inv._id}`}><button className={styles.deleteButton}><i className="fa-solid fa-trash fa-sm"></i></button></a></td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              :"Potwierdź email, aby móc w pełni korzystać z funkcji "}{!active?<Link to="/userSettings">tutaj</Link>:null}
            </div>
          </div>

          <div className={styles.addInvoice}>
            {active?<button className={styles.addInvoiceButton}>
              <Link to="/invoice">Dodaj nową fakturę</Link>
              </button>:null}
            
          </div>
        </div>
      </div>
  </>
  );
};

export default HomePage;
