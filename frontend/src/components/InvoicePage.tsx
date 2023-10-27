import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import fakturki from "../assets/fakturki.png";
import styles from './InvoicePage.module.css';

var id=1, valuen:number, vatprice:number, valueb:number, sum=0

let services:any = []

const InvoiceForm = () => {
    const [rows, setRows] = useState(services)
    const [name, setName] = useState("")
    const [jm, setJm] = useState("Usługa")
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)
    const [vat, setVat] = useState(23)
    const [client, setClient] = useState("")
    const [dateIssuance, setDateIssuance] = useState("")
    const [dateSell, setDateSell] = useState("")
    const [place, setPlace] = useState("")
    const [payDate, setPayDate] = useState("")
    const [payType, setPayType] = useState("")
    const [account, setAccount] = useState("")
    const [seller, setSeller] = useState("")
    const [totalPrice, setTotalPrice] = useState(0)

    const handleDelete = (id:any) => {
        let copyrows = [...rows]
        copyrows = copyrows.filter(
            (_, index) => id !=index
        )
        setRows(copyrows)
        console.log(rows)
    }

    const Row = (props:any) => {
        const {ID, NAME, JM, QANTITY, PRICE, VALUEN, VAT, VATPRICE, VALUEB, index, delRow} = props
        return(
            <tr>
                <td>{ID}</td>
                <td>{NAME}</td>
                <td>{JM}</td>
                <td>{QANTITY}</td>
                <td>{PRICE}</td>
                <td>{VALUEN}</td>
                <td>{VAT}</td>
                <td>{VATPRICE}</td>
                <td>{VALUEB}</td>
                <td><button onClick={() => delRow(index)}><i className="fa-solid fa-trash"></i></button></td>
            </tr>
        )
    }
    
    const Table = (props:any) => {
        const {data, delRow} = props
        return(
            <tbody>
                {data.map((row: any,index:any) => 
                    <Row key = {index}
                        ID = {row.ID}
                        NAME = {row.NAME}
                        JM = {row.JM}
                        QANTITY = {row.QANTITY}
                        PRICE = {row.PRICE}
                        VALUEN = {row.VALUEN}
                        VAT = {row.VAT}
                        VATPRICE = {row.VATPRICE}
                        VALUEB = {row.VALUEB}
                        delRow = {delRow}
                        index = {index}
                    />
                )}
            </tbody>
        )
    }

    function AddNewRow(){
        valuen = quantity * price
        vatprice = valuen * (vat / 100)
        valueb = valuen + vatprice
        setRows([...rows,{ID:id, NAME:name, JM:jm, QANTITY:quantity, PRICE:price, VALUEN:valuen, VAT:vat, VATPRICE:vatprice, VALUEB:valueb}])

        sum = sum + valueb
        setTotalPrice(sum)
        id++
    }

    return (
        <>
        <div className={styles.formContainer}>
            <div className={styles.invoiceForm}>
                <div className={styles.firstContainer}>
                    <div className={styles.firstContainerName}>
                        <label>
                            <p>Klient:</p>
                            <input type="text" name="NumberInvoice" value={client} onChange={(e) => setClient(e.target.value)}/>
                        </label>
                    </div>
                    <div className={styles.firstContainerDates}>
                        <label>
                            <p>Data Wystawienia:</p>
                            <input type="date" name="Dataissuance" value={dateIssuance} onChange={(e) => setDateIssuance(e.target.value)}/>
                        </label>
                        <label>
                            <p>Data sprzedaży:</p>
                            <input type="date" name="sellInovices" value={dateSell} onChange={(e) => setDateSell(e.target.value)}/>
                        </label>
                        <label>
                            <p>Miejsce Wystawienia:</p>
                            <input type="text" name="Place" value={place} onChange={(e) => setPlace(e.target.value)}/>
                        </label>
                    </div>
                </div>
                
                <div className={styles.WspolnyContainer}>
                    <table>
                        <thead>
                            <td>Lp.</td>
                            <td>Nazwa</td>
                            <td>Jm.</td>
                            <td>Ilośc</td>
                            <td>Cena netto</td>
                            <td>Wartość netto (R)</td>
                            <td>VAT</td>
                            <td>Kwota VAT</td>
                            <td>Wartość brutto</td>
                            <td></td>
                        </thead>
                        <Table data = {rows}
                            delRow = {handleDelete}/>
                        <tbody>
                            <td>ID</td>
                            <td><input type='text' value={name} onChange={(e) => setName(e.target.value)}/></td>
                            <td>
                                <select value={jm} onChange={(e) => setJm(e.target.value)}>
                                    <option>Usługa</option>
                                </select>
                            </td>
                            <td><input type='number' value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))}/></td>
                            <td><input type='number' value={price} onChange={(e) => setPrice(parseFloat(e.target.value))}/></td>
                            <td>wyliczana</td>
                            <td>
                                <select value={vat} onChange={(e) => setVat(parseFloat(e.target.value))}>
                                    <option>23%</option>
                                    <option>19%</option>
                                </select>
                            </td>
                            <td>wyliczana</td>
                            <td>wyliczana</td>
                        </tbody>
                    </table>
                    <div className={styles.DodajContainer}>
                        <button onClick={AddNewRow}>Dodaj nową pozycję</button>
                    </div>
                    <div className={styles.WartoscContainer}>
                        {/* <p>Wartość brutto:</p> */}
                        {/* <input type='number'></input> */}
                        <div className={styles.cena}>
                            <label>
                                <p>Wartość brutto:</p>
                            </label>
                            <label>
                                {totalPrice}
                            </label>
                            <label>
                                <p>PLN</p>
                            </label>
                        </div>
                        <div className={styles.platnosc_termin}>
                            <label>
                                <p>Forma płatności</p> 
                                <select value={payType} onChange={(e) => setPayType(e.target.value)}>
                                    <option>Przelew</option>
                                    <option>Gotówka</option>
                                </select>
                            </label>
                            <label>
                                <p>Termin płatności</p>
                                <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)}/>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.lastContainer}>
                    <div className={styles.bank}>
                        <label>
                            <p>Rachunek bankowy</p>
                            <select value={account} onChange={(e) => setAccount(e.target.value)}>
                                <option>123</option>
                            </select>
                            <p>Opis</p>
                            <input type="text" />
                        </label>
                    </div>
                    <div className={styles.wystawil}>
                        <label>
                            <p>Wystawił</p>
                            <select value={seller} onChange={(e) => setSeller(e.target.value)}>
                                <option>Twoje imie</option>
                            </select>
                            <p>Wystawił</p>
                            <input type="text" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
        </>
        
    );
};

export default InvoiceForm;