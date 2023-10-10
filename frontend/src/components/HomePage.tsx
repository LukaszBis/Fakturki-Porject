import React from 'react';
import "./HomePage.css";
import user from "../assets/user.png";
import { Link } from 'react-router-dom';


interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
}

const invoices: Invoice[] = [
  { id: 1, number: 'FH001', date: '2023-10-09', amount: 1000 },
  { id: 2, number: 'FH002', date: '2023-10-10', amount: 1500 },
  { id: 3, number: 'FH003', date: '2023-10-11', amount: 800 },
];

const HomePage: React.FC = () => {
  return (
    <>

      
      <div className='main'>
        <div className='banner'>
          <div className='titlePage'>Fakturki Home</div>
          <span className='companyName'>
            Nazwa firmy...
          </span>
          <span className='signUpIn'>            
            <Link to="/login"><img src={user} alt="user" width={42} height={42}/></Link>
          </span>
        </div>
        <div className='addInvoice'>
          <button>Dodaj nową fakturę</button>
        </div>
        <div className='content'>
          <div className='menu'>
            <div className='menuButton'>
              <button>Faktury</button>
            </div>
            <div className='menuButton'>
              <button>Paragony</button>
            </div>
            <div className='menuButton'>
              <button>Zaliczki</button>
            </div>
          </div>
          <div className='invoiceTable'>
          <h2>Lista Faktur</h2>
          <table>
            <thead>
              <tr>
                <th>Numer Faktury</th>
                <th>Data</th>
                <th>Kwota</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
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
      </div>
    </>
  );
};

export default HomePage;
