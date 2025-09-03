# Newsy - Il tuo aggregatore di notizie semplice

Un'applicazione React che recupera e riassume le principali notizie dall'Italia e dalla Germania.

## ✨ Obiettivo

**Newsy** è un'app web sviluppata con React, TypeScript e Tailwind CSS che fornisce un riassunto delle principali notizie (massimo 30) per i seguenti paesi:

- Italia: `http://68k.news/index.php?section=nation&loc=IT`
- Germania: `http://68k.news/index.php?section=nation&loc=DE`

## 🧠 Funzionamento

1. L'interfaccia mostra:
   - Un titolo: `newsy - Il tuo aggregatore di notizie semplice`
   - Due bottoni centrali: "Italia" e "Germania"

2. Al click su uno dei bottoni:
   - Effettua il fetch della pagina HTML corrispondente
   - Estrae le **prime 30 notizie** (o meno, se non disponibili)
   - Filtra le notizie duplicate (basato sul titolo)
   - Genera un breve riassunto in lingua italiana per ciascuna notizia

3. Le notizie vengono mostrate con titolo e descrizione riassunta nella stessa pagina

## 🛠️ Tecnologie Utilizzate

- **React** + **TypeScript** per lo sviluppo frontend
- **Tailwind CSS** per lo stile responsive
- **Cheerio** per il parsing HTML lato client
- **Vite** come build tool

## 🏗️ Struttura del Progetto

```
src/
├── components/       # Componenti React
│   ├── NewsFetcher.tsx
│   └── NewsList.tsx
├── services/         # Servizi di supporto
│   └── corsProxy.ts
├── utils/            # Utility e helpers
│   └── newsUtils.ts
├── App.tsx           # Componente principale
└── main.tsx          # Entry point
```

## 🚀 Come iniziare

1. Clona il repository
   ```
   git clone https://your-repo/newsy.git
   cd newsy
   ```

2. Installa le dipendenze
   ```
   npm install
   ```

3. Avvia l'app in modalità sviluppo
   ```
   npm run dev
   ```

4. Apri nel browser `http://localhost:5173`

## 📌 Problemi CORS

Se riscontri problemi CORS durante lo sviluppo:

1. L'app tenta automaticamente di utilizzare diversi proxy CORS
2. Puoi installare un'estensione del browser per disabilitare le restrizioni CORS (solo per sviluppo)
3. In produzione, implementare il fetching delle notizie lato server

## 🗣️ Lingua & Traduzione

- Tutte le notizie vengono riassunte in italiano
- Supporto multilingua previsto per versioni future (italiano, tedesco, inglese)
