const htmlToPdf = require('html-pdf');
const mail = require("./mail");
const PriceToPolishWords = require('price-to-polish-words');

function generateHtml() {
    const city = 'Kłobuck'
    const issueDate = '18.10.2023'
    const serviceDate = '18.10.2023'
    const seller = 
    {
        'fullname':'Jan Nowak',
        'name':'Usługi Informatyczne Jan Nowak',
        'nip':'1233435678',
        'address':'Kowalska 12',
        'city':'00-001 Warszawa'
    }
    const buyer = 
    {
        'fullname':'Andrzej Kowalski',
        'name':'ABC INFO Andrzej Kowalski',
        'nip':'2345683788',
        'address':'Nowakowska 12',
        'city':'22-102 Góra Kalwaria'
    }
    const services = [
        {
            'name':'Instalacja systemu operacyjnego',
            'unit':'usł.',
            'count':2,
            'netto':1000.08,
            'vat':23,
        },
        {
            'name':'Usuwanie systemu operacyjnego',
            'unit':'usł.',
            'count':1,
            'netto':2137.00,
            'vat':23,
        },
    ]
    const payment = "przelew w terminie 2 dni";
    const paydate = "21-10-2023";
    const account = "00 1111 2222 3333 4444 5555 6666";

    const css = `<style>
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

    table tr:nth-last-child(2) td, table tr:nth-last-child(1) td{
        background-color: rgb(255, 255, 255);
    }
    table tr:nth-last-child(2) td:first-child, table tr:nth-last-child(1) td:first-child{
        border: 0;
        border-right: 1px solid gray;
    }
    table tr:nth-last-child(2) td:first-child{
        border-top: 1px solid gray;
    }
    table tr:nth-last-child(2) td{
        border-top: 1px solid gray;
    }
    #tabela2 tr td{
        border-bottom: 1px solid gray;
        border-right: 1px solid gray
    }
    #tabela2 tr td:first-child{
        border-right: 1px solid gray;
        border-bottom: 0;
        width: 278px;
    }
    </style>`
    let html = css + `
<div id="page">
    <div id="dane1">
        <div>
            <img src="https://drive.google.com/uc?export=view&id=12F9dzuCyRdE7Ov7G2iuwzHdtef63XJoC" style="width: 220px;"></img>
        </div>
        <div>
            <div class="tab">
                <span>Miejsce wystawienia</span>
                <span>${city}</span>
            </div>
            <div class="tab">
                <span>Data wystawienia</span>
                <span>${issueDate}</span>
            </div>
            <div class="tab">
                <span>Data wykonania usługi</span>
                <span>${serviceDate}</span>
            </div>
        </div>
    </div>
    <div id="dane2">
        <div>
            <div class="tab">
                <span>Sprzedawca</span>
                <span>${seller.name}</span><br>
                <span>NIP: ${seller.nip}</span><br>
                <span>${seller.address}</span><br>
                <span>${seller.city}</span>
            </div>
        </div>
        <div>
            <div class="tab">
                <span>Nabywca</span>
                <span>${buyer.name}</span><br>
                <span>NIP: ${buyer.nip}</span><br>
                <span>${buyer.address}</span><br>
                <span>${buyer.city}</span>
            </div>
        </div>
    </div>
    <div id="dane3">
        <div id="title">
            Faktura VAT ${issueDate}
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
            let sumNetto = 0;
            let sumVat = 0;
            let sumBrutto = 0;
            let vat = 0;
            services.forEach((element, index) => {
                html += `<tr>`
                    html += `<td style="text-align: center;">`+(index+1)+`</td>`
                    html += `<td>${element.name}</td>`
                    html += `<td style="text-align: center;">${element.unit}</td>`
                    html += `<td style="text-align: center;">${element.count}</td>`
                    html += `<td style="text-align: center;">${element.netto}</td>`
                    let sum = element.netto*element.count;
                    sum = Math.ceil((sum) * 100) / 100;
                    html += `<td style="text-align: center;">${sum}</td>`
                    sumNetto += sum;
                    html += `<td style="text-align: center;">${element.vat}%</td>`
                    let brutto = (sum*element.vat)/100;
                    brutto = Math.ceil((brutto) * 100) / 100;
                    sumVat += brutto;
                    html += `<td style="text-align: center;">${brutto}</td>`
                    brutto = Math.floor((sum+brutto) * 100) / 100;
                    sumBrutto += brutto;
                    html += `<td style="text-align: center;">${brutto}</td>`
                html += `</tr>`
            })
            html += `<tr>
                <td style="text-align: right;" colspan="5">W tym</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumNetto}</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">23%</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumVat}</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumBrutto}</td>
            </tr>
            <tr>
                <td style="text-align: right;" colspan="5">Razem</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumNetto}</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">23%</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumVat}</td>
                <td style="text-align: center;border-bottom: 1px solid gray;">${sumBrutto}</td>
            </tr>
        </table>
    </div>
    <div id="dane4">
        <div>
            <p>
                <span>Sposób płatności</span>
                <span>${payment}</span>
            </p>
            <p>
                <span>Termin płatności</span>
                <span>${paydate}</span>
            </p>
            <p>
                <span>Numer konta</span><br>
                <span>${account}</span>
            </p>
        </div>
        <div>
            <p>
                <span>Do zapłaty</span>
                <span>${sumBrutto} PLN</span>
            </p>
            <p>
                <span>Słownie</span>`;
                const text = new PriceToPolishWords(sumBrutto);
                html += `<span>${text.getPrice()}</span>
            </p>
        </div>
    </div>
    <div id="dane5">
        <div>
            <p>${seller.fullname}</p>
            <hr>
            <p>Podpis osoby upoważnionej do wystawienia</p>
        </div>
        <div>
            <p>${buyer.fullname}</p>
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

async function downloadPdf(res) {
    try {
        const htmlCode = generateHtml();
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
      res.status(400).send('Wystąpił błąd podczas pobierania danych.');
    }
}

async function sendPdf(email) {
    try {
        const htmlCode = generateHtml();
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
      res.status(400).send('Wystąpił błąd podczas pobierania danych.');
    }
}

module.exports = { downloadPdf, sendPdf }