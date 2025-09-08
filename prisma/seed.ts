import { PrismaClient, UnitType } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Frutta', unit: UnitType.WEIGHT },
  { name: 'Verdura', unit: UnitType.WEIGHT },
  { name: 'Alimentari', unit: UnitType.PIECES },
  { name: 'Prodotti per la Casa', unit: UnitType.PIECES },
];

const products = {
  'Frutta': [
    { name: 'Mele', variants: ['Kanzi', 'Granny Smith', 'Royal Gala', 'Fuji', 'Golden Delicious'] },
    { name: 'Pere', variants: ['Abate', 'Carmen', 'Guyot', 'Santa Maria', 'William', 'Kaiser', 'Decana'] },
    { name: 'Uva', variants: ['da tavola', 'Vittoria', 'Red Globe', 'Uva spina', 'Uva fragola'] },
    { name: 'Pesche', variants: ['nettarine', 'tabacchiera', 'percoche', 'pesche gialle', 'pesche bianche'] },
    { name: 'Kiwi', variants: ['verde', 'gold'] },
    { name: 'Banane', variants: ['Cavendish', 'plantain', 'banane rosse'] },
    { name: 'Angurie', variants: ['crimson sweet', 'sugar baby', 'moon and stars'] },
    { name: 'Frutti rossi', variants: ['mirtilli', 'fragole', 'lamponi', 'ribes', 'more', 'ribes rosso', 'ribes nero'] },
    { name: 'Albicocche', variants: ['Bella d\'Italia', 'Precoce di Treviglio', 'Valleggia'] },
    { name: 'Susine', variants: ['Santa Rosa', 'Angelino', 'President'] },
    { name: 'Ciliegie', variants: ['Durone', 'Ferrovia', 'Bigarreau'] },
    { name: 'Meloni', variants: ['cantalupo', 'retato', 'invernale'] },
    { name: 'Arance', variants: ['da tavola', 'da spremere', 'Navel', 'Tarocco', 'Valencia'] },
    { name: 'Limoni', variants: ['Femminello', 'Meyer', 'Eureka'] },
  ],
  'Verdura': [
    { name: 'Carciofi', variants: ['Romanesco', 'Spinoso', 'Violetto'] },
    { name: 'Asparagi', variants: ['verdi', 'bianchi', 'viola'] },
    { name: 'Zucca', variants: ['Butternut', 'Hokkaido', 'Spaghetti'] },
    { name: 'Pomodori', variants: ['San Marzano', 'Pixel', 'Ciliegino', 'Cuore di Bue'] },
    { name: 'Patate', variants: ['novelle', 'pasta gialla', 'pasta bianca'] },
    { name: 'Zucchine', variants: ['verdi', 'gialle', 'trombetta'] },
    { name: 'Insalata', variants: ['lattuga', 'rucola', 'radicchio', 'iceberg', 'romana'] },
    { name: 'Peperoni', variants: ['rossi', 'gialli', 'verdi', 'arancioni'] },
    { name: 'Melanzane', variants: ['lunghe', 'tonde', 'violette'] },
    { name: 'Cavolfiori', variants: ['bianchi', 'verdi', 'viola'] },
    { name: 'Broccoli', variants: ['verdi', 'viola', 'romanesco'] },
    { name: 'Spinaci', variants: ['freschi', 'baby'] },
    { name: 'Carote', variants: ['arancioni', 'gialle', 'viola'] },
  ],
  'Alimentari': [
    { name: 'Affettati di carne', variants: ['Crudo di Parma', 'Crudo San Daniele', 'Cotto', 'Salame', 'Coppa', 'Pancetta', 'Culatello', 'Speck', 'Bresaola', 'Mortadella', 'Wurstel'] },
    { name: 'Conserve di pesce', variants: ['Tonno in olio', 'Tonno al naturale', 'Tonno rosso', 'Ventresca di tonno', 'Tonno pinne gialle', 'Salmone affumicato', 'Sardine in olio', 'Acciughe in olio', 'Acciughe in salsa piccante'] },
    { name: 'Legumi e polenta', variants: ['Ceci', 'Fagioli borlotti', 'Fagioli cannellini', 'Lenticchie', 'Piselli', 'Polenta', 'Polenta Taragna', 'Purè di Patate'] },
    { name: 'Pasta', variants: ['Spaghetti', 'Penne', 'Fusilli', 'Linguine', 'Paccheri', 'Farfalle', 'Orecchiette', 'Tagliatelle', 'Ravioli', 'Tortellini', 'Integrale', 'Senza Glutine', 'Kamut', 'Legumi'] },
    { name: 'Riso', variants: ['Arborio', 'Carnaroli', 'Basmati', 'Venere', 'Jasmine', 'Integrale', 'Parboiled'] },
    { name: 'Uova', variants: ['Allevate a terra', 'Bio'] },
    { name: 'Latte e latticini', variants: ['Intero', 'Scremato', 'Senza lattosio', 'Soia', 'Mandorla', 'Avena', 'Cocco', 'Burro', 'Panna', 'Yogurt bianco senza grassi', 'Yogurt bianco normale', 'Yogurt alla frutta'] },
    { name: 'Formaggi', variants: ['Mozzarella di bufala', 'Mozzarella treccia', 'Ricotta', 'Stracchino', 'Parmigiano Reggiano', 'Pecorino', 'Grana Padano', 'Gorgonzola', 'Formaggini', 'Philadelphia'] },
    { name: 'Colazione', variants: ['Muesli', 'Cornflakes', 'Biscotti Frollini', 'Biscotti Integrali', 'Biscotti Senza zucchero', 'Wafer', 'Biscotti per bambini', 'Biscotti Gocciole', 'Biscotti Oro Saiwa'] },
    { name: 'Marmellate e creme', variants: ['Marmellata di Frutta', 'Miele', 'Nutella', 'Crema di pistacchio', 'Crema di nocciola'] },
    { name: 'Snack salati', variants: ['Crackers', 'Patatine', 'Taralli', 'Grissini', 'Mandorle', 'Noci', 'Pistacchi', 'Mix', 'Gallette di riso', 'Gallette di grano saraceno', 'Gallette di mais'] },
    { name: 'Snack dolci', variants: ['Cioccolato Fondente', 'Cioccolato al latte', 'Brioche', 'Gelato'] },
    { name: 'Olio e aceto', variants: ['Di olive taggiasche', 'Italiano', 'Europeo', 'Di semi di girasole', 'Di arachidi', 'Aromatizzato', 'Aceto balsamico', 'Aceto di mele', 'Aceto di vino'] },
    { name: 'Condimenti e salse', variants: ['Ketchup', 'Maionese', 'Senape', 'Salsa BBQ', 'Soya', 'Tabasco'] },
    { name: 'Ready-to-eat', variants: ['Zuppa di lenticchie', 'Zuppa di legumi', 'Zuppa di zucca', 'Polenta'] },
    { name: 'Acqua', variants: ['Naturale', 'Frizzante', 'Leggermente frizzante'] },
    { name: 'Vino', variants: ['Rosso', 'Bianco', 'Rosé', 'Spumante'] },
    { name: 'Birra', variants: ['Chiara', 'Scura', 'Rossa', 'Artigianale'] },
  ],
  'Prodotti per la Casa': [
    { name: 'Detersivi per piatti', variants: ['liquidi', 'in polvere', 'in pastiglie'] },
    { name: 'Detersivi per bucato', variants: ['liquidi', 'in polvere', 'in capsule'] },
    { name: 'Pulitori multiuso', variants: ['spray', 'liquidi', 'in pastiglie'] },
    { name: 'Prodotti per la pulizia del bagno', variants: ['detergenti', 'disinfettanti', 'anticalcare'] },
    { name: 'Prodotti per la pulizia della cucina', variants: ['detergenti', 'sgrassatori', 'disinfettanti'] },
    { name: 'Prodotti per la pulizia dei vetri', variants: ['spray', 'liquidi'] },
    { name: 'Deodoranti per ambienti', variants: ['spray', 'diffusori', 'bastoncini'] },
    { name: 'Sacchetti per la spazzatura', variants: ['grandi', 'medi', 'piccoli'] },
    { name: 'Carta igienica', variants: ['doppia velina', 'tripla velina', 'extra morbida'] },
    { name: 'Rotoli di carta da cucina', variants: ['monostrato', 'multistrato', 'extra assorbenti'] },
  ],
};

async function main() {
  for (const category of categories) {
    const dbCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });

    const productData = products[category.name as keyof typeof products];
    for (const product of productData) {
      const dbProduct = await prisma.product.upsert({
        where: { name_categoryId: { name: product.name, categoryId: dbCategory.id } },
        update: {},
        create: {
          name: product.name,
          unit: category.unit,
          categoryId: dbCategory.id,
        },
      });

      for (const variant of product.variants) {
        await prisma.variant.upsert({
          where: { name_productId: { name: variant, productId: dbProduct.id } },
          update: {},
          create: {
            name: variant,
            productId: dbProduct.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });