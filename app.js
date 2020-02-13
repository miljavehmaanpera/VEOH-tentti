const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');
const session = require('express-session');

let app = express();

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(session({
    secret: '1234qwerty',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000000
    }
}));

app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next();
});

let matkat = [];


app.get('/', (req, res, next) => {
    res.write(`
    <html>
    <head><meta charset='utf-8'></head>
    <body>
    <h1>Matkalasku ja ajopäiväkirja</h1>
    <table border=1>
    <tr>
        <td>Päivämäärä</td>
        <td>Reitti ja selite</td>
        <td>Kilometrit</td>
        <td>Päivärahat (kpl)</td>
        <td>Osapäivärahat (kpl)</td>
        <td>Ateriakorvaus (kpl)</td>
        <td>Korvaus</td>
    </tr>
    `);
    var kokonaiskorvaus=0;
    matkat.forEach((matka)=>{
        var korvaus = 0.43*matka.kilometrit + 43*matka.paivarahat + 20*matka.osapaivarahat + 10.5*matka.ateriakorvaus;
        res.write(`
        <tr>
            <td align=center>${matka.paivamaara}</td>
            <td align=center>${matka.selite}</td>
            <td align=center>${matka.kilometrit}</td>
            <td align=center>${matka.paivarahat}</td>
            <td align=center>${matka.osapaivarahat}</td>
            <td align=center>${matka.ateriakorvaus}</td>
            <td align-center>${korvaus}</td>
        </tr>
        `);
        kokonaiskorvaus=kokonaiskorvaus+korvaus;
    });

    
    res.write(`
    </table><br>
    Kokonaiskorvaus: ${kokonaiskorvaus} €
    <br><br>
    <form action="/poista-kaikki" method="POST">
        <button type="submit">Poista kaikki</button>
    </form>
    <h2>Syötä uusi matka</h2>
        <form action="/uusi-matka" method="POST">
            Päivämäärä:<br>
            <input type="date" name="paivamaara"><br><br>
            Reitti ja selite:<br>
            <input type="text" name="selite"><br><br>
            Kilometrit:<br>
            <input type="number" name="kilometrit"><br><br>
            Päivärahat (kpl):<br>
            <input type="number" name="paivarahat"><br><br>
            Osapäivärahat (kpl):<br>
            <input type="number" name="osapaivarahat"><br><br>
            Ateriakorvaus (kpl):<br>
            <input type="number" name="ateriakorvaus"><br><br>
            <button type="submit">Lisää</button>
        </form>
    </body>
    <html>
    `);
    res.end();
});

app.post('/uusi-matka', (req,res,next)=>{
    let uusi_matka = {
        paivamaara: req.body.paivamaara,
        selite: req.body.selite,
        kilometrit: req.body.kilometrit,
        paivarahat: req.body.paivarahat,
        osapaivarahat: req.body.osapaivarahat,
        ateriakorvaus: req.body.ateriakorvaus
    };
    matkat.push(uusi_matka);
    return res.redirect('/');
});

app.post('/poista-kaikki', (req,res,next)=>{
    matkat=[];
    return res.redirect('/');
});









app.use((req, res, next) => {
    res.status(404);
    res.send(`
        page not found
    `);
});

app.listen(PORT);