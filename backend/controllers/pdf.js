const htmlToPdf = require('html-pdf');
const mail = require("./mail");
const PriceToPolishWords = require('price-to-polish-words');
const user = require("./user");
const invoice = require("./invoice");
const Bir = require('bir1');

async function generateHtml(id) {
    const get_invoice = await invoice.getById(id)
    const get_user = await user.auth(get_invoice.userId)

    const dateIssuance = `${String(get_invoice.dateIssuance.getDate()).padStart(2, '0')}.${String(get_invoice.dateIssuance.getMonth() + 1).padStart(2, '0')}.${get_invoice.dateIssuance.getFullYear()}`
    const dateSell = `${String(get_invoice.dateSell.getDate()).padStart(2, '0')}.${String(get_invoice.dateSell.getMonth() + 1).padStart(2, '0')}.${get_invoice.dateSell.getFullYear()}`
    const payDate = `${String(get_invoice.payDate.getDate()).padStart(2, '0')}.${String(get_invoice.payDate.getMonth() + 1).padStart(2, '0')}.${get_invoice.payDate.getFullYear()}`

    const bir = new Bir()
    await bir.login()
    const sellerData = await bir.search({ nip: get_user.NIP })
    sellerName = sellerData.nazwa
    sellerNIP = sellerData.nip
    sellerStreet = sellerData.ulica+' '+sellerData.nrNieruchomosci
    sellerData.nrLokalu?sellerStreet+='/'+sellerData.nrLokalu:null
    sellerCity = sellerData.kodPocztowy+' '+sellerData.miejscowosc

    let html = `<style>
    body{
        margin:0;
        padding:0;
    }
    #page{
        width:600px;
        font-size:8px;
    }
    #dane1 > div, #dane2 > div, #dane4 > div, #dane5 > div{
        float: left;
        width: 220px;
        margin: 35px;
        height: 10px;
    }
    #dane2 > div{
        height: 30px;
    }
    #dane4, #dane5{
        margin:2px;
    }
    #dane4 > div:first-child > p > span:first-child{
        margin-right: 10px;
    }
    #dane4 > div:last-child > p:first-child{
        font-weight: bold;
        font-size: 10px;
    }
    #dane4 > div:last-child > p:first-child > span:first-child{
        margin-right: 10px;
    }
    #dane4 > div:last-child > p:last-child > span:first-child{
        margin-right: 5px;
    }
    #dane4 > div > p{
        margin:2px;
        padding:2px;
        border-top: 2px solid lightgray;
    }
    #dane5{
        margin-top: 130px;
    }
    #dane5 p{
        text-align: center;
        margin: 1px;
    }
    #dane5 p:first-child{
        font-size: 10px;
        font-weight: bold;
    }
    .tab{
        margin:2px;
    }
    .tab span:first-child{
        display: inline-block;
        width: 220px;
        background-color: lightgray;
        border-top: 1px solid gray;
        text-align: center;
    }
    #dane1 .tab span:last-child{
        display: inline-block;
        width: 220px;
        font-weight: bold;
        text-align: center;
    }

    #dane3 > #title{
        width: 600px;
        font-size: 20px;
        text-align: center;
    }

    table{
        font-size:8px;
        border-top: 1px solid gray;
        margin-left: 43px;
        width: 500px;
    }
    table th{
        background-color: lightgray;
    }
    table th, table td{
        border-right: 1px solid gray;
    }
    table th:first-child, table td:first-child{
        border-left: 1px solid gray;
    }
    table tr:nth-child(even){
        background-color: rgb(255, 255, 255);
    }
    table tr:nth-child(odd){
        background-color: rgb(235, 235, 235);
    }

    
    .summary th{
        border: 0;
        border-top: 1px solid gray;
        border-right: 1px solid gray;
        background-color: rgb(255, 255, 255);
    }
    .summary th:first-child, .summary td:first-child{
        border-left: 0px solid gray;
    }
    .summary td{
        background-color: rgb(255, 255, 255);
    }
    .summary:nth-last-child(1) th:first-child{
        border: 0;
        border-right: 1px solid gray;
    }
    .summary:nth-last-child(1) th:first-child{
        border-top: 1px solid gray;
    }
    .summary:nth-last-child(1) th{
        border-top: 1px solid gray;
    }
    </style>`
    html += `
<div id="page">
    <div id="dane1">
        <div>
            <img src="https://drive.google.com/uc?export=view&id=12F9dzuCyRdE7Ov7G2iuwzHdtef63XJoC" style="width: 220px;"></img>
        </div>
        <div>
            <div class="tab">
                <span>Miejsce wystawienia</span>
                <span>${get_invoice.place}</span>
            </div>
            <div class="tab">
                <span>Data wystawienia</span>
                <span>${dateIssuance}</span>
            </div>
            <div class="tab">
                <span>Data wykonania usługi</span>
                <span>${dateSell}</span>
            </div>
        </div>
    </div>
    <div id="dane2">
        <div>
            <div class="tab">
                <span>Sprzedawca</span>
                <span>${sellerName}</span><br>
                <span>NIP: ${sellerNIP}</span><br>
                <span>${sellerStreet}</span><br>
                <span>${sellerCity}</span>
            </div>
        </div>
        <div>
            <div class="tab">
                <span>Nabywca</span>
                <span>${get_invoice.clientName}</span><br>
                <span>NIP: ${get_invoice.clientNIP}</span><br>
                <span>${get_invoice.clientStreet}</span><br>
                <span>${get_invoice.clientCity}</span>
            </div>
        </div>
    </div>
    <div id="dane3">
        <div id="title">
            Faktura ${get_invoice.name}
        </div>
        <table cellspacing="0">
            <tr>
                <th style="width:15px">Lp.</th>
                <th style="width:100px">Nazwa towaru lub usługi</th>
                <th style="width:28px">Jm.</th>
                <th style="width:25px">Ilość</th>
                <th style="width:37px">Cena netto</th>
                <th style="width:37px">Wartość netto</th>
                <th style="width:37px">Stawka VAT</th>
                <th style="width:37px">Kwota VAT</th>
                <th style="width:37px">Wartość brutto</th>
            </tr>`;
            let vat = 0
            get_invoice.services.forEach((element, index) => {
                html += `<tr>
                    <td style="text-align: center;">`+(index+1)+`</td>
                    <td>${element.NAME}</td>
                    <td style="text-align: center;">${element.JM}</td>
                    <td style="text-align: center;">${element.QUANTITY}</td>
                    <td style="text-align: center;">${element.PRICE}zł</td>
                    <td style="text-align: center;">${element.VALUEN}zł</td>
                    <td style="text-align: center;">${element.VAT}%</td>`
                vat = element.VAT
                html += `<td style="text-align: center;">${element.VATPRICE}zł</td>
                        <td style="text-align: center;">${element.VALUEB}zł</td>
                    </tr>`
            })
            html += `<tr class="summary">
                <th style="text-align: right;" colspan="5">Podsumowanie</th>
                <th style="text-align: center;border-bottom: 1px solid gray;">Wartość Netto</th>
                <th style="text-align: center;border-bottom: 1px solid gray;">Vat</th>
                <th style="text-align: center;border-bottom: 1px solid gray;">Wartość Vat</th>
                <th style="text-align: center;border-bottom: 1px solid gray;">Wartość Brutto</th>
            </tr>`
            get_invoice.aditionalValues.forEach((element) => {
                if (element.NettoSum > 0){
                    html += `<tr class="summary">
                        <td style="text-align: right;" colspan="5"></td>
                        <td style="text-align: center;border-bottom: 1px solid gray;">${element.NettoSum}zł</td>
                        <td style="text-align: center;border-bottom: 1px solid gray;">${element.Vat}%</td>
                        <td style="text-align: center;border-bottom: 1px solid gray;">${element.VatSum}zł</td>
                        <td style="text-align: center;border-bottom: 1px solid gray;">${element.BruttoSum}zł</td>
                    </tr>`
                }
            })
        html += `</table>
    </div>
    <div id="dane4">
        <div>
            <p>
                <span>Sposób płatności</span>
                <span>${get_invoice.payType}</span>
            </p>
            <p>
                <span>Termin płatności</span>
                <span>${payDate}</span>
            </p>
            <p>
                <span>Numer konta</span><br>
                <span>${get_user.accountNumber}</span>
            </p>
        </div>
        <div>
            <p>
                <span>Do zapłaty</span>
                <span>${get_invoice.totalPrice} PLN</span>
            </p>
            <p>
                <span>Słownie</span>`;
                const text = new PriceToPolishWords(get_invoice.totalPrice);
                html += `<span>${text.getPrice()}</span>
            </p>
        </div>
    </div>
    <div id="dane5">
        <div>
            <p>${get_user.firstName+' '+get_user.lastName}</p>
            <hr>
            <p>Podpis osoby upoważnionej do wystawienia</p>
        </div>
        <div>
            <p>-</p>
            <hr>
            <p>Podpis osoby upoważnionej do odbioru</p>
        </div>
    </div>
</div>`;
return html;
}

async function pdfBuffer(htmlCode) {
    return new Promise((resolve, reject) => {
        htmlToPdf.create(htmlCode, {}).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}

async function downloadPdf(res, id) {
    try {
        const htmlCode = await generateHtml(id);
        pdfBuffer(htmlCode)
            .then((pdfBuffer) => {
                res.setHeader('Content-Disposition', 'attachment; filename=przykladowy.pdf');
                res.setHeader('Content-Type', 'application/pdf');
        
                // Wyślij bufor PDF jako odpowiedź HTTP
                res.send(pdfBuffer);
                console.log('Udane wygenerowanie PDF.');
            })
            .catch((error) => {
                console.error('Błąd generowania PDF:', error);
            });
    } catch (error) {
      console.error('Błąd podczas obsługi ścieżki :', error);
      res.status(200).send('Wystąpił błąd podczas pobierania danych.');
    }
}

async function sendPdf(email, id) {
    try {
        const htmlCode = await generateHtml(id);
        pdfBuffer(htmlCode)
            .then((pdfBuffer) => {
                mail.sendInvoice(email, pdfBuffer);
                console.log('Udane wygenerowanie PDF.');
            })
            .catch((error) => {
                console.error('Błąd generowania PDF:', error);
            });
    } catch (error) {
      console.error('Błąd podczas obsługi ścieżki :', error);
      res.status(200).send('Wystąpił błąd podczas pobierania danych.');
    }
}

module.exports = { downloadPdf, sendPdf }