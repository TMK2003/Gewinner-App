const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

let teilnehmer = [];

// Teilnehmer aus Datei laden (wenn vorhanden)
try {
    const data = fs.readFileSync('teilnehmer.json', 'utf-8');
    teilnehmer = JSON.parse(data);
} catch (err) {
    teilnehmer = [];
}

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Teilnahme
app.post('/teilnehmen', (req, res) => {
    const name = req.body.name?.trim();
    if (!name) return res.send('❌ Name ist erforderlich.');
    if (teilnehmer.find(t => t.toLowerCase() === name.toLowerCase())) {
        return res.send('⚠️ Name wurde bereits eingetragen.');
    }
    teilnehmer.push(name);
    fs.writeFileSync('teilnehmer.json', JSON.stringify(teilnehmer, null, 2));
    res.send('✅ Teilnahme erfolgreich!');
});

// Gewinner ziehen
app.get('/gewinner', (req, res) => {
    if (teilnehmer.length === 0) return res.send('❌ Keine Teilnehmer vorhanden.');
    const gewinner = teilnehmer[Math.floor(Math.random() * teilnehmer.length)];
    res.send(`🎉 Der Gewinner ist: ${gewinner}`);
});

// Teilnehmerliste löschen
app.post('/reset', (req, res) => {
    teilnehmer = [];
    fs.writeFileSync('teilnehmer.json', JSON.stringify([]));
    res.send('🧹 Teilnehmerliste gelöscht.');
});

// Liste zurückgeben
app.get('/teilnehmerliste', (req, res) => {
    res.json(teilnehmer);
});

app.listen(port, () => {
    console.log(`✅ Server läuft unter http://localhost:${port}`);
});
