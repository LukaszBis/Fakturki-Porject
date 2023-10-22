// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import fakturki from "../assets/fakturki.png";
import styles from './AddNewInvoicePage.module.css';

const InvoiceForm = () => {
    return (
        <>
        {/* <div className={styles.logoContainer}>
            <Link to="/welcome" className={styles.logoLink}>
            <img src={fakturki} alt="Fakturki" className={styles.logo} />
            </Link>
        </div> */}
        <div className={styles.formContainer}>
            <div className={styles.invoiceForm}>
                <form>
                    <label>
                        Typ:
                        <input type="text" name="TypIvoice" />
                    </label>
                    <label>
                        Numer:
                        <input type="text" name="NumberInvoice" />
                    </label>
                    <label>
                        Data Wystawienia:
                        <input type="date" name="Dataissuance" />
                    </label>
                    <label>
                        Miejsce Wystawienia
                        <input type="text" name="Place" />
                    </label>
                    <label>
                        Data sprzedaży:
                        <input type="date" name="sellInovices" />
                    </label>
                </form>
                <div className={styles.WspolnyContainer}>
                    <div className={styles.SprzedawcaContainer}>
                        <div className={styles.formheader}><h1>Sprzedawca</h1></div>
                            <table>
                                <tr>
                                    <td>NIP</td>
                                    <td><input type="text" name="nip" /></td>
                                </tr>
                                <tr>
                                    <td>Ulica i nr</td>
                                    <td><input type="text" name="address" /></td>
                                </tr>
                                <tr>
                                    <td className={styles.postalCode}>Kod pocztowy</td>
                                    <td><input type="text" name="postalCode" /></td>
                                </tr>
                                <tr>
                                    <td>Miejscowość</td>
                                    <td><input type="text" name="city" /></td>
                                </tr>
                                <tr>
                                    <td>Numer Konta</td>
                                    <td><input type="text" name="account" /></td>
                                </tr>
                            </table>
                            <button type="submit">Dodaj sprzedawcę</button>   
                    </div>
                    <div className={styles.NabywcaContainer}>
                        <div className={styles.formheader}><h1>Nabywca</h1></div>
                            <table>
                                <tr>
                                    <td>Nabywca</td>
                                    <td><input type="text" name="nabywca" /></td>
                                </tr>
                                <tr>
                                    <td>NIP</td>
                                    <td><input type="text" name="nip" /></td>
                                </tr>
                                <tr>
                                    <td>Ulica i nr</td>
                                    <td><input type="text" name="ulica" /></td>
                                </tr>
                                <tr>
                                    <td className={styles.postalCode}>Kod pocztowy</td>
                                    <td><input type="text" name="kodPocztowy" /></td>
                                </tr>
                                <tr>
                                    <td>Miejscowość</td>
                                    <td><input type="text" name="miejscowosc" /></td>
                                </tr>
                            </table>
                            <button type="submit">Dodaj nabywcę</button>
                    </div>
                </div>
            </div>
        </div>
        </>
        
    );
};

export default InvoiceForm;