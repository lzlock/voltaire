import Papa from 'papaparse';
import fs from 'fs';

const csv = fs.readFileSync('data.csv', 'utf8');
const parsed = Papa.parse(csv, { header: true });

const data = parsed.data.map((row, index) => { 
  for (let key in row) {
    if (row[key] === '') {
      row[key] = undefined;
    }
  }

  return { ...row, 'ID': index + 1 };
});

fs.writeFileSync('static/data.json', JSON.stringify(data));
fs.copyFileSync('data.csv', 'static/data.csv');
