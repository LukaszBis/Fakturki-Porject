import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import fakturki from "../assets/fakturki.png";
import styles from './InvoicePage.module.css';
import Cookies from "js-cookie";

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
        const {NAME, JM, QANTITY, PRICE, VALUEN, VAT, VATPRICE, VALUEB, index, delRow} = props
        return(
            <tr>
                <td>{index+1}</td>
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
        vatprice = Math.ceil((vatprice) * 100) / 100;
        valueb = valuen + vatprice
        valueb = Math.ceil((valueb) * 100) / 100;
        setRows([...rows,{ID:id, NAME:name, JM:jm, QANTITY:quantity, PRICE:price, VALUEN:valuen, VAT:vat, VATPRICE:vatprice, VALUEB:valueb}])

        setName("")
        setQuantity(0)
        setPrice(0)

        sum = sum + valueb
        setTotalPrice(sum)
        id++
    }

    const handleInvoice = () => {
        const apiUrl = 'http://localhost:8080/invoice';
        const user_id = Cookies.get('user');
    
        const requestBody = {
            services:rows,
            client:client,
            dateIssuance:dateIssuance,
            dateSell:dateSell,
            place:place,
            payDate:payDate,
            payType:payType,
            account:account,
            seller:seller,
            totalPrice:totalPrice,
            userId:user_id
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
              throw new Error('Register failed');
            }
            return response.json();
          })
          .then((data) => {
            if(data.success) {
              console.log('Register successful:', data);
            }else {
              console.log(data.errors);
            }
          });
      };

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
                    </table>
                    <hr></hr>
                    <div className={styles.dodajiwartosc}>  
                        <div className={styles.DodajContainer}>
                            <label>
                                <p>Nazwa:</p>
                                <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
                            </label>
                            <label>
                                <p>Jednostka miary:</p>
                                <select value={jm} onChange={(e) => setJm(e.target.value)}>
                                    <option value="Usługa">Usługa</option>
                                    <option value="m2">m2</option>
                                </select>
                            </label>
                            <label>
                                <p>Ilość:</p>
                                <input type='number' value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))}/>    
                            </label>
                            <label>
                                <p>Cena:</p>
                                <input type='number' value={price} onChange={(e) => setPrice(parseFloat(e.target.value))}/>
                            </label>
                            <label>
                                <p>VAT:</p>
                                <select value={vat} onChange={(e) => setVat(parseFloat(e.target.value))}>
                                    <option value="23">23%</option>
                                    <option value="19">19%</option>
                                </select>
                            </label>
                            
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
                                        <option value="Przelew">Przelew</option>
                                        <option value="Gotówka">Gotówka</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Termin płatności</p>
                                    <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.lastContainer}>
                    <div className={styles.bank}>
                        <label>
                            <p>Rachunek bankowy</p>
                            <select value={account} onChange={(e) => setAccount(e.target.value)}>
                                <option value="49 1020 2892 2276 3005 0000 0000">49 1020 2892 2276 3005 0000 0000</option>
                                <option value="49 1020 2892 2276 3005 0000 1111">49 1020 2892 2276 3005 0000 1111</option>
                            </select>
                            <p>Opis</p>
                            <input type="text" />
                        </label>
                    </div>
                    <div className={styles.wystawil}>
                        <label>
                            <p>Wystawił</p>
                            <select value={seller} onChange={(e) => setSeller(e.target.value)}>
                                <option value="Łukasz">Lukasz</option>
                                <option value="Jakub">Jakub</option>
                            </select>
                            <p>Odebrał</p>
                            <input type="text" />
                        </label>
                    </div>
                    <button onClick={handleInvoice}>Wystaw fakture</button>
                </div>
            </div>
        </div>
        </>
        
    );
};

export default InvoiceForm;