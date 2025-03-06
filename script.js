// URL del tuo script di Google Apps Script
const urlDati = 'https://script.google.com/macros/s/AKfycby4W2rwj4tKM-aJa-Sjsip_OKwobZpTcR3P99UWF4Fq5dvLUOdS04pMpKH9pyA4V6qp/exec'; // Sostituisci con il tuo URL

// Variabile per i dati
let dati = {
    temperatura: 0,
    umidita: 0,
    ph: 0,
    livello: 0,
    fase: "",
    tipoBirra: "",
    storicoTemperatura: [],
    storicoPh: []
};

// Aggiorna i dati in tempo reale
function aggiornaDashboard() {
    document.getElementById("temperatura").textContent = dati.temperatura.toFixed(2);
    document.getElementById("umidita").textContent = dati.umidita.toFixed(2);
    document.getElementById("ph").textContent = dati.ph.toFixed(2);
    document.getElementById("livello").textContent = dati.livello.toFixed(2);
    document.getElementById("fase").textContent = dati.fase;
    document.getElementById("tipo-birra").textContent = dati.tipoBirra;

    // Aggiorna i grafici
    graficoTemperatura.data.datasets[0].data = dati.storicoTemperatura;
    graficoPh.data.datasets[0].data = dati.storicoPh;
    graficoTemperatura.update();
    graficoPh.update();
}

// Grafico temperatura
const ctxTemperatura = document.getElementById("grafico-temperatura").getContext("2d");
const graficoTemperatura = new Chart(ctxTemperatura, {
    type: "line",
    data: {
        labels: ["1", "2", "3", "4", "5"], // Puoi aggiornare le etichette dinamicamente
        datasets: [{
            label: "Temperatura (°C)",
            data: dati.storicoTemperatura,
            borderColor: "red",
            fill: false
        }]
    },
    options: {}
});

// Grafico pH
const ctxPh = document.getElementById("grafico-ph").getContext("2d");
const graficoPh = new Chart(ctxPh, {
    type: "line",
    data: {
        labels: ["1", "2", "3", "4", "5"], // Puoi aggiornare le etichette dinamicamente
        datasets: [{
            label: "pH",
            data: dati.storicoPh,
            borderColor: "blue",
            fill: false
        }]
    },
    options: {}
});

// Recupera i dati dal foglio di Google
function recuperaDati() {
    fetch(urlDati)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                // Assumi che l'ultima riga contenga i dati più recenti
                const ultimaRiga = data[data.length - 1];

                // Aggiorna la variabile dati
                dati.temperatura = parseFloat(ultimaRiga["temperatura"]);
                dati.umidita = parseFloat(ultimaRiga["umidita"]);
                dati.ph = parseFloat(ultimaRiga["ph"]);
                dati.livello = parseFloat(ultimaRiga["livello"]);
                dati.fase = ultimaRiga["fase"];
                dati.tipoBirra = ultimaRiga["tipo-birra"];

                // Aggiorna gli storici (assumi che le colonne siano chiamate "storicoTemperatura" e "storicoPh")
                dati.storicoTemperatura = data.map(row => parseFloat(row["temperatura"]));
                dati.storicoPh = data.map(row => parseFloat(row["ph"]));

                // Aggiorna la dashboard
                aggiornaDashboard();
            }
        })
        .catch(error => {
            console.error("Errore nel recupero dei dati:", error);
        });
}

// Aggiorna i dati ogni 5 secondi
setInterval(recuperaDati, 5000);

// Aggiorna la dashboard all'avvio
recuperaDati();