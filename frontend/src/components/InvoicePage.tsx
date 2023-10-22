// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import fakturki from "../assets/fakturki.png";
import styles from './InvoicePage.module.css';

const InvoiceForm = () => {
    return (
        <>
        <div className={styles.formContainer}>
            <div className={styles.invoiceForm}>
                <div className={styles.firstContainer}>
                    <div className={styles.firstContainerName}>
                        <label>
                            <p>Klient:</p>
                            <input type="text" name="NumberInvoice" />
                        </label>
                    </div>
                    <div className={styles.firstContainerDates}>
                        <label>
                            <p>Data Wystawienia:</p>
                            <input type="date" name="Dataissuance" />
                        </label>
                        <label>
                            <p>Data sprzedaży:</p>
                            <input type="date" name="sellInovices" />
                        </label>
                        <label>
                            <p>Miejsce Wystawienia:</p>
                            <input type="text" name="Place" />
                        </label>
                    </div>
                </div>
                
                <div className={styles.WspolnyContainer}>
                    <table>
                        <thead>
                            <td>Lp.</td>
                            <td>Nazwa</td>
                            <td>Ilośc</td>
                            <td>Cena netto</td>
                            <td>Rabat</td>
                            <td>VAT</td>
                            <td>Wartość netto (R)</td>
                            <td>Opis</td>
                        </thead>
                    </table>
                    <div className={styles.DodajContainer}>
                        
                        <input type="text" placeholder="dodaj nową pozycję"/>
                    </div>
                    <div className={styles.WartoscContainer}>
                        <p>Wartość brutto:</p>
                        {/* <input type='number'></input> */}
                        <div className={styles.cena}>
                            <input type="number" min="0.00" step="0.05"/>
                            <p>PLN</p>
                        </div>
                                
                    </div>
                </div>
            </div>
        </div>
        </>
        
    );
};

export default InvoiceForm;