# CardGenerator Pro — iPhone PWA

Version 1.1.0 · Progressive Web App · HTML/CSS/JavaScript

## Funzioni

- Interfaccia mobile dark con accenti crimson.
- Archivio di fixture di test Stripe pubbliche e predefinite.
- Filtri per circuito e ricerca degli scenari.
- Copia del numero di test o dei dettagli.
- Condivisione tramite il menu nativo iOS, quando disponibile.
- Esportazione CSV.
- Service worker per l'uso offline dopo il primo caricamento.

## Limiti di sicurezza

Questa app mostra esclusivamente fixture statiche destinate agli ambienti di test.
Non genera numeri di carte reali, CVV o credenziali utilizzabili per acquisti.
Non invia dati a Stripe, non effettua pagamenti e non raccoglie dati personali.
Usare i valori solo con Stripe in modalità test.

Per l'elenco aggiornato degli scenari e delle carte di test, consultare:
https://docs.stripe.com/testing

## Pubblicazione necessaria per iPhone

Per installare una PWA su iPhone, i file devono essere ospitati su un sito HTTPS.
Aprire `index.html` direttamente dall'app File non è sufficiente per installare
una PWA né per abilitare il service worker.

### Opzione semplice: GitHub Pages

1. Crea un repository GitHub vuoto.
2. Carica tutti i file e la cartella `icons` mantenendo la struttura.
3. Apri **Settings → Pages**.
4. In **Build and deployment**, scegli **Deploy from a branch**.
5. Seleziona il branch `main` e la cartella `/ (root)`, poi salva.
6. Attendi la pubblicazione e apri l'indirizzo HTTPS fornito da GitHub Pages.

In alternativa, usa un servizio di hosting statico HTTPS. Non è richiesto un server
backend: l'app funziona interamente nel browser.

## Installazione su iPhone

1. Apri l'URL HTTPS pubblicato in **Safari**.
2. Tocca **Condividi**.
3. Seleziona **Aggiungi alla schermata Home**.
4. Se disponibile, attiva **Apri come app web**, quindi tocca **Aggiungi**.
5. Avvia CardGenerator Pro dalla schermata Home.

Dopo il primo caricamento, il service worker memorizza i file principali e l'app
può aprirsi offline. La prima visita richiede una connessione.

## Test locale per sviluppatori

Il service worker richiede HTTPS o localhost. Da un computer con Python:

```bash
python -m http.server 8000
```

Apri `http://localhost:8000` sullo stesso computer. Per test su iPhone, usa
un hosting HTTPS oppure un tunnel di sviluppo HTTPS affidabile.

## Struttura

```text
CardGeneratorPro-iOS-PWA/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── sw.js
├── README.md
└── icons/
    ├── icon.svg
    ├── icon-192.png
    └── icon-512.png
```

I file PNG delle icone sono inclusi nel pacchetto.
