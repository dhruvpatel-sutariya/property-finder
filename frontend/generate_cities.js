const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'ahmedabad', 'apartments.html');
let templateStr = fs.readFileSync(templatePath, 'utf8');

const cities = ['surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];

cities.forEach(city => {
    const CityName = city.charAt(0).toUpperCase() + city.slice(1);

    let content = templateStr;
    // Specific replacements
    content = content.replace(/Ahmedabad Apartments - Tenant Portal/g, `${CityName} Apartments - Tenant Portal`);
    content = content.replace(/Apartments in Ahmedabad/g, `Apartments in ${CityName}`);
    content = content.replace(/Ahmedabad Apartments<\/h2>/g, `${CityName} Apartments</h2>`);

    // Fix select options
    content = content.replace(/<option value="ahmedabad" selected>Ahmedabad<\/option>/g, `<option value="ahmedabad">Ahmedabad</option>`);
    content = content.replace(new RegExp(`<option value="${city}">${CityName}</option>`), `<option value="${city}" selected>${CityName}</option>`);

    // Replace locations in cards
    content = content.replace(/, Ahmedabad<\/p>/g, `, ${CityName}</p>`);

    const dir = path.join(__dirname, city);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'apartments.html'), content);
    console.log(`Created ${city}/apartments.html`);
});

// Modify tenant-script.js
const scriptPath = path.join(__dirname, 'tenant-script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

const searchBlockRegex = /if \(loc === 'ahmedabad' && type === 'apartment'\) \{[\s\S]*?(?=\} else \{)[\s\S]*?\} else \{/m;
const newSearchBlock =
    `if (loc && type === 'apartment') {
                const cities = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
                if (cities.includes(loc)) {
                    const currentPath = window.location.pathname;
                    if (cities.some(c => currentPath.includes('/' + c + '/'))) {
                         // currently in a city folder
                         if (currentPath.includes('/' + loc + '/')) {
                             window.location.href = 'apartments.html';
                         } else {
                             window.location.href = '../' + loc + '/apartments.html';
                         }
                    } else {
                         // currently in root
                         window.location.href = loc + '/apartments.html';
                    }
                } else {
                    alert('Location missing. Select a valid city.');
                }
            } else {`;

if (searchBlockRegex.test(scriptContent)) {
    scriptContent = scriptContent.replace(searchBlockRegex, newSearchBlock);
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('Updated tenant-script.js');
} else {
    console.log('Regex failed to match tenant-script.js');
}