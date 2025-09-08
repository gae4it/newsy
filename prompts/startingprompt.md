# Prompt Definitivo: Creazione dell'Applicazione "gofrescoapp"

## 1. Obiettivo Generale

Sei un ingegnere software full-stack senior specializzato nello stack T3 (Next.js, TypeScript, tRPC, Prisma, Tailwind CSS). Il tuo compito è sviluppare da zero un'applicazione web completa per un negozio di alimentari online chiamato `gofrescoapp`.

L'applicazione deve permettere agli utenti di navigare tra i prodotti, aggiungerli a una "lista della spesa" e inviare questa lista al negoziante. **Non devono essere implementate funzionalità di pagamento.**

## 2. Stack Tecnologico di Riferimento

Devi utilizzare esclusivamente le tecnologie e le convenzioni del progetto esistente:

- **Framework:** Next.js (v15+) con App Router
- **Linguaggio:** TypeScript
- **Styling:** Tailwind CSS
- **API Layer:** tRPC
- **Database & ORM:** PostgreSQL con Prisma
- **State Management:** React Context API per la gestione della lista della spesa.

## 3. Piano di Implementazione Dettagliato

Segui questi passi in ordine per costruire l'applicazione.

### Passo 1: Definizione dello Schema del Database

**Task:** Modifica il file `gofrescoapp/gofrescoapp/prisma/schema.prisma` per definire il modello dati dell'applicazione.

**Istruzioni:**

1. Rimuovi il modello `Post` di esempio.
2. Definisci i seguenti modelli con le relative relazioni e indici:
   - `Category`: Rappresenta una categoria di prodotti (es. "Frutta").
     - `id` (Int, @id, @default(autoincrement()))
     - `name` (String, @unique)
     - `products` (Relazione uno-a-molti con `Product`)
   - `Product`: Rappresenta un prodotto generico (es. "Mele").
     - `id` (Int, @id, @default(autoincrement()))
     - `name` (String)
     - `unit` (Enum `UnitType`)
     - `categoryId` (Int)
     - `category` (Relazione con `Category`)
     - `variants` (Relazione uno-a-molti con `Variant`)
   - `Variant`: Rappresenta una specifica variante di un prodotto (es. "Mela Royal Gala").
     - `id` (Int, @id, @default(autoincrement()))
     - `name` (String)
     - `productId` (Int)
     - `product` (Relazione con `Product`)
   - `Order`: Rappresenta un ordine inviato da un cliente.
     - `id` (Int, @id, @default(autoincrement()))
     - `customerName` (String)
     - `customerEmail` (String)
     - `createdAt` (DateTime, @default(now()))
     - `items` (Relazione uno-a-molti con `OrderItem`)
   - `OrderItem`: Rappresenta una riga di un ordine.
     - `id` (Int, @id, @default(autoincrement()))
     - `quantity` (Decimal)
     - `orderId` (Int)
     - `order` (Relazione con `Order`)
     - `variantId` (Int)
     - `variant` (Relazione con `Variant`)
3. Definisci l'enum `UnitType` con i valori `WEIGHT` e `PIECES`.

### Passo 2: Popolamento del Database (Seed)

**Task:** Crea uno script di seed in `gofrescoapp/gofrescoapp/prisma/seed.ts` per popolare il database con i dati iniziali.

**Istruzioni:**

1.  Usa Prisma Client e la funzione `upsert` per evitare duplicati.
2.  Popola il database usando la **Lista Prodotti di Riferimento** fornita alla fine di questo prompt.
3.  Associa correttamente ogni `Product` alla sua `Category` e ogni `Variant` al suo `Product`.
4.  Imposta l'unità di misura (`unit`): `WEIGHT` per "Frutta" e "Verdura", `PIECES` per "Alimentari" e "Prodotti per la Casa".

### Passo 3: Sviluppo dell'API Backend (tRPC)

**Task:** Crea gli endpoint tRPC necessari in `gofrescoapp/gofrescoapp/src/server/api/routers/`.

**Istruzioni:**

1.  **`category.ts`**: Crea un router per le categorie con una procedura `getAll` che restituisce tutte le categorie.
2.  **`product.ts`**: Crea un router per i prodotti con una procedura `getByCategory` che accetta un `categoryId` (validato con Zod) e restituisce i prodotti e le loro varianti.
3.  **`order.ts`**: Crea un router per gli ordini con una procedura `create` che accetta i dati dell'ordine (validati con Zod) e li salva nel database.
4.  Aggiorna `root.ts` per includere i nuovi router.

### Passo 4: Sviluppo dell'Interfaccia Utente (Next.js & React)

**Task:** Sviluppa le pagine e i componenti React necessari in `gofrescoapp/gofrescoapp/src/app/`.

**Istruzioni:**

1.  **Gestione Stato Lista Spesa:**
    - Crea `src/contexts/CartContext.tsx`.
    - Il context deve gestire un array di items (`variantId`, `quantity`) e le funzioni per manipolarlo (`addItem`, `removeItem`, `updateItemQuantity`).
    - Salva la lista in `localStorage` per renderla persistente tra le sessioni.
2.  **Pagine (App Router):**
    - **Home (`/page.tsx`):** Mostra le categorie principali usando `api.category.getAll.useQuery()`.
    - **Pagina Categoria (`/category/[id]/page.tsx`):** Mostra i prodotti di una categoria usando `api.product.getByCategory.useQuery()`.
    - **Pagina Lista Spesa (`/cart/page.tsx`):** Mostra il riepilogo della lista dal `CartContext` e un form per l'invio dell'ordine tramite `api.order.create.useMutation()`.
3.  **Componenti (`src/app/_components/`):**
    - `ProductCard.tsx`: Mostra un prodotto con le sue varianti. Ogni variante deve avere un selettore di quantità e un bottone "Aggiungi alla Lista della Spesa".
      - Per prodotti `WEIGHT`, il selettore deve avere incrementi di 0.25 (0.25, 0.50, ...).
      - Per prodotti `PIECES`, il selettore deve avere incrementi di 1.
    - `Navbar.tsx`: Deve includere un link alla pagina `/cart` con un badge che mostra il numero di articoli unici nella lista.

## 4. Requisiti UI/UX e Funzionali

- **Design:** Pulito, minimalista, mobile-first e responsive. Palette di colori ispirata a prodotti freschi.
- **Icone:** Usa icone grandi e chiare per prodotti e categorie.
- **Testi:** Usa "Lista della Spesa", non "Carrello".
- **Ricerca:** Implementa una barra di ricerca nella `Navbar` per filtrare i prodotti.

## 5. Lista Prodotti di Riferimento

Basarsi sulla seguente struttura dati per il seed. Le icone sono un riferimento per la UI.

#### Categoria: Frutta (`WEIGHT`) 🍎

- **Mele** (🍎): Kanzi, Granny Smith, Royal Gala, Fuji, Golden Delicious
- **Pere** (🍐): Abate, Carmen, Guyot, Santa Maria, William, Kaiser, Decana
- **Uva** (🍇): da tavola, Vittoria, Italia, Red Globe, Uva spina, Uva fragola
- **Pesche** (🍑): nettarine, tabacchiera, percoche, pesche gialle, pesche bianche
- **Kiwi** (🥝): verde, gold
- **Banane** (🍌): Cavendish, plantain, banane rosse
- **Angurie** (🍉): crimson sweet, sugar baby, moon and stars
- **Frutti rossi** (🫐): mirtilli, fragole, lamponi, ribes, more, ribes rosso, ribes nero
- **Albicocche** (🍑): Bella d'Italia, Precoce di Treviglio, Valleggia
- **Susine** (🫐): Santa Rosa, Angelino, President
- **Ciliegie** (🍒): Durone, Ferrovia, Bigarreau
- **Meloni** (🍈): cantalupo, retato, invernale
- **Arance** (🍊): da tavola, da spremere, Navel, Tarocco, Valencia
- **Limoni** (🍋): Femminello, Meyer, Eureka

#### Categoria: Verdura (`WEIGHT`) 🥬

- **Carciofi** (🌱): Romanesco, Spinoso, Violetto
- **Asparagi** (🥬): verdi, bianchi, viola
- **Zucca** (🎃): Butternut, Hokkaido, Spaghetti
- **Pomodori** (🍅): San Marzano, Pixel, Ciliegino, Cuore di Bue
- **Patate** (🥔): novelle, pasta gialla, pasta bianca
- **Zucchine** (🥒): verdi, gialle, trombetta
- **Insalata** (🥬): lattuga, rucola, radicchio, iceberg, romana
- **Peperoni** (🫑): rossi, gialli, verdi, arancioni
- **Melanzane** (🍆): lunghe, tonde, violette
- **Cavolfiori** (🥦): bianchi, verdi, viola
- **Broccoli** (🥦): verdi, viola, romanesco
- **Spinaci** (🥬): freschi, baby
- **Carote** (🥕): arancioni, gialle, viola

#### Categoria: Alimentari (`PIECES`) 🥖

- **Affettati di carne** (🥓): Crudo di Parma, Crudo San Daniele, Cotto, Salame, Coppa, Pancetta, Culatello, Speck, Bresaola, Mortadella, Wurstel
- **Conserve di pesce** (🐟): Tonno in olio, Tonno al naturale, Tonno rosso, Ventresca di tonno, Tonno pinne gialle, Salmone affumicato, Sardine in olio, Acciughe in olio, Acciughe in salsa piccante
- **Legumi e polenta** (🫘): Ceci, Fagioli borlotti, Fagioli cannellini, Lenticchie, Piselli, Polenta, Polenta Taragna, Purè di Patate
- **Pasta** (🍝): Spaghetti, Penne, Fusilli, Linguine, Paccheri, Farfalle, Orecchiette, Tagliatelle, Ravioli, Tortellini, Integrale, Senza Glutine, Kamut, Legumi
- **Riso** (🍚): Arborio, Carnaroli, Basmati, Venere, Jasmine, Integrale, Parboiled
- **Uova** (🥚): Allevate a terra, Bio
- **Latte e latticini** (🥛): Intero, Scremato, Senza lattosio, Soia, Mandorla, Avena, Cocco, Burro, Panna, Yogurt bianco senza grassi, Yogurt bianco normale, Yogurt alla frutta
- **Formaggi** (🧀): Mozzarella di bufala, Mozzarella treccia, Ricotta, Stracchino, Parmigiano Reggiano, Pecorino, Grana Padano, Gorgonzola, Formaggini, Philadelphia
- **Colazione** (🥣): Muesli, Cornflakes, Biscotti Frollini, Biscotti Integrali, Biscotti Senza zucchero, Wafer, Biscotti per bambini, Biscotti Gocciole, Biscotti Oro Saiwa
- **Marmellate e creme** (🍯): Marmellata di Frutta, Miele, Nutella, Crema di pistacchio, Crema di nocciola
- **Snack salati** (🥨): Crackers, Patatine, Taralli, Grissini, Mandorle, Noci, Pistacchi, Mix, Gallette di riso, Gallette di grano saraceno, Gallette di mais
- **Snack dolci** (🍫): Cioccolato Fondente, Cioccolato al latte, Brioche, Gelato
- **Olio e aceto** (🫒): Di olive taggiasche, Italiano, Europeo, Di semi di girasole, Di arachidi, Aromatizzato, Aceto balsamico, Aceto di mele, Aceto di vino
- **Condimenti e salse** (🧂): Ketchup, Maionese, Senape, Salsa BBQ, Soya, Tabasco
- **Ready-to-eat** (🥣): Zuppa di lenticchie, Zuppa di legumi, Zuppa di zucca, Polenta
- **Acqua** (💧): Naturale, Frizzante, Leggermente frizzante
- **Vino** (🍷): Rosso, Bianco, Rosé, Spumante
- **Birra** (🍺): Chiara, Scura, Rossa, Artigianale

#### Categoria: Prodotti per la Casa (`PIECES`) 🧹

- **Detersivi per piatti** (🧼): liquidi, in polvere, in pastiglie
- **Detersivi per bucato** (👕): liquidi, in polvere, in capsule
- **Pulitori multiuso** (🧴): spray, liquidi, in pastiglie
- **Prodotti per la pulizia del bagno** (🚿): detergenti, disinfettanti, anticalcare
- **Prodotti per la pulizia della cucina** (🍽️): detergenti, sgrassatori, disinfettanti
- **Prodotti per la pulizia dei vetri** (🪟): spray, liquidi
- **Deodoranti per ambienti** (🌸): spray, diffusori, bastoncini
- **Sacchetti per la spazzatura** (🗑️): grandi, medi, piccoli
- **Carta igienica** (🧻): doppia velina, tripla velina, extra morbida
- **Rotoli di carta da cucina** (📄): monostrato, multistrato, extra assorbenti

## 6. Output Atteso

Fornisci il codice completo per ogni file richiesto, un passo alla volta, iniziando con `prisma.schema.prisma`. Non aggiungere spiegazioni al di fuori del codice.

last update 8.9.25 23:23
