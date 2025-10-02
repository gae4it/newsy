// Test script for German character encoding
const testGermanChars = () => {
  console.log('Testing German characters:');
  console.log('ü - u with umlaut');
  console.log('ö - o with umlaut');
  console.log('ä - a with umlaut');
  console.log('ß - eszett/sharp s');
  console.log('Ü - U with umlaut');
  console.log('Ö - O with umlaut');
  console.log('Ä - A with umlaut');
  
  // Test cases
  const testStrings = [
    'Die Schlümpfe – Das Musical',
    'Tag der offenen Tür im Bergwerk Suggental',
    'Mackefisch - Komplizirkus - Songwriter-Kabarett',
    'Gorica Körner',
    'Tickets für Top-Events'
  ];
  
  console.log('\nTest strings with German characters:');
  testStrings.forEach((str, i) => {
    console.log(`${i + 1}. ${str}`);
  });
};

testGermanChars();