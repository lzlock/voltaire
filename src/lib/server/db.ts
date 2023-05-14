import Papa from 'papaparse';
import data from '../../../data.csv?raw';

const parsed = Papa.parse(data, { header: true });


export default {
  docs: parsed.data.map((row, index) => {
    for (let key in row) {
      if (row[key] === '') {
        row[key] = undefined;
      }
    }

    return { ...row, 'ID': index };
  }),
};
