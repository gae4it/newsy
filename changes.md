# Project Modification Log

This file automatically tracks all modifications made by the Gemini CLI.

---

## Stato di Avanzamento del Prompt `startingprompt.md` (8 Settembre 2025)

### Completato:

- **Setup Iniziale:** Creazione e configurazione dei file `gemini.md` e `changes.md` per la gestione delle note di progetto e il log delle modifiche.

### Da Completare:

#### Passo 1: Definizione dello Schema del Database

- Modifica il file `prisma/schema.prisma` per definire i modelli `Category`, `Product`, `Variant`, `Order`, `OrderItem` e l'enum `UnitType`.
  - Rimuovi il modello `Post` di esempio.

#### Passo 2: Popolamento del Database (Seed)

- Crea uno script di seed in `prisma/seed.ts` per popolare il database con i dati iniziali basati sulla "Lista Prodotti di Riferimento".
  - Utilizza Prisma Client e la funzione `upsert`.
  - Associa correttamente `Product` a `Category` e `Variant` a `Product`.
  - Imposta l'unità di misura (`unit`) per i prodotti.

#### Passo 3: Sviluppo dell'API Backend (tRPC)

- Crea i router tRPC in `src/server/api/routers/`:
  - `category.ts`: Procedura `getAll`.
  - `product.ts`: Procedura `getByCategory`.
  - `order.ts`: Procedura `create`.
- Aggiorna `root.ts` per includere i nuovi router.

#### Passo 4: Sviluppo dell'Interfaccia Utente (Next.js & React)

- **Gestione Stato Lista Spesa:**
  - Crea `src/contexts/CartContext.tsx` per gestire la lista della spesa e salvarla in `localStorage`.
- **Pagine (App Router):**
  - Home (`/page.tsx`): Mostra le categorie.
  - Pagina Categoria (`/category/[id]/page.tsx`): Mostra i prodotti di una categoria.
  - Pagina Lista Spesa (`/cart/page.tsx`): Mostra il riepilogo della lista e il form di invio ordine.
- **Componenti (`src/app/_components/`):**
  - `ProductCard.tsx`: Mostra prodotto, varianti, selettore quantità e bottone "Aggiungi alla Lista della Spesa".
  - `Navbar.tsx`: Include link a `/cart` con badge articoli.

#### Passo 5: Requisiti UI/UX e Funzionali

- Assicurare un design pulito, minimalista, mobile-first e responsive.
- Utilizzare icone grandi e chiare.
- Usare la terminologia "Lista della Spesa".
- Implementare una barra di ricerca nella `Navbar`.

---

## Consigli per il Processo di Deploy (8 Settembre 2025)

Per perfezionare il processo di deploy della `gofrescoapp`, si consiglia di seguire questi passaggi:

1.  **Gestione delle Variabili d'Ambiente:**
    - Assicurarsi che tutte le variabili d'ambiente sensibili siano gestite in modo sicuro (non commesse nel controllo versione).
    - Utilizzare un sistema di gestione delle variabili d'ambiente fornito dal provider di hosting in produzione.

2.  **Database Migrations con Prisma:**
    - Utilizzare `prisma migrate deploy` nel processo di deploy per applicare le migrazioni del database in produzione.
    - Considerare di eseguire `prisma db seed` solo per ambienti di sviluppo/staging, o con logica condizionale.

3.  **Processo di Build Ottimizzato:**
    - Eseguire `npm run build` (o `next build`) come parte del processo di CI/CD.
    - Assicurarsi che test e linting vengano eseguiti prima del build.

4.  **Containerizzazione (Docker):**
    - Considerare la containerizzazione dell'applicazione con Docker per garantire un ambiente di esecuzione consistente.
    - Creare un `Dockerfile` che includa il build di Next.js e l'esecuzione dell'applicazione.

5.  **CI/CD (Continuous Integration/Continuous Deployment):**
    - Implementare una pipeline CI/CD (es. GitHub Actions, GitLab CI, Vercel, Railway) per automatizzare test, linting, build e deploy.

6.  **Monitoraggio e Logging:**
    - Integrare strumenti di monitoraggio (es. Sentry, Datadog) per tracciare performance ed errori.
    - Configurare un sistema di logging centralizzato.

7.  **Scalabilità:**
    - Progettare il database per la scalabilità (indici, query ottimizzate).
    - Considerare l'uso di un servizio di database gestito.

8.  **Sicurezza:**
    - Mantenere aggiornate tutte le dipendenze (`npm audit`).
    - Applicare le best practice di sicurezza per le API tRPC (validazione input, autenticazione/autorizzazione).

ok.
