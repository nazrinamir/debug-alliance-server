const XLSX = require('xlsx');
const path = require('path');

const PLAYERS_FILE = path.join(__dirname, '../storage/player_data.xlsx');
const USERS_FILE = path.join(__dirname, '../storage/user_admin.xlsx');

const readXlsxFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error('Error reading xlsx file:', error);
    return [];
  }
};

const writeXlsxFile = (filePath, data) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filePath);
    return true;
  } catch (error) {
    console.error('Error writing xlsx file:', error);
    return false;
  }
};

module.exports = {
  PLAYERS_FILE,
  USERS_FILE,
  readXlsxFile,
  writeXlsxFile
}; 