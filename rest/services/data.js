// Service for Storing and Editing Data

// dependencies
const fs = require('fs/promises');
const path = require('path');
const baseDir = path.join(__dirname, '../.data');
const DataService = {}

DataService.create = async({
  dir,
  file,
  data,
}) => new Promise(async (resolve, reject) => {
  try {
    const dataSrting = JSON.stringify(data,undefined,2);
    const newFile = await fs.open(`${baseDir}/${dir}/${file}.json`, 'wx').catch((e) => {
      throw(new Error('Could not create file'))});
    await fs.writeFile(newFile, dataSrting).catch(()=> {
      throw(new Error('Could not write to file'))});
    await theFile.close().catch((e) => {
      throw(new Error('Could not close file'))});
    resolve('Data File Created');
  } catch (error) {
    reject(error)
  }
});

DataService.read = async({
  dir,
  file,
}) => new Promise(async (resolve, reject) => {
  try {
    const fileData = await fs.readFile(`${baseDir}/${dir}/${file}.json`, 'utf8').catch((e) => {
      throw(new Error('Could not open/read file'))});
    resolve(fileData);
  } catch (error) {
    reject(error);
  }
});

DataService.update = async ({
  dir,
  file,
  data,
}) => new Promise(async (resolve, reject) => {
  try {
    const dataSrting = JSON.stringify(data,undefined,2);
    const theFile = await fs.open(`${baseDir}/${dir}/${file}.json`, 'r+').catch((e) => {
      throw(new Error('(Update) Could not open file'))});
    await theFile.truncate().catch((e) => {
      throw new Error('(Update) Error truncating file')});
    await fs.writeFile(theFile, dataSrting).catch(()=> {
      throw(new Error('(Update) Could not write to file'))});
    await theFile.close().catch((e) => {
      throw(new Error('(Update) Could not close file'))});
    resolve('Data File Updated');
  } catch (error) {
    reject(error);
  }
});

DataService.delete = async ({
  dir,
  file,
}) => new Promise(async (resolve, reject) => {
  try {
    await fs.unlink(`${baseDir}/${dir}/${file}.json`).catch((e) => {
      throw new Error('(Delete) Could not unlink file')});
    resolve('(Delete) Data File Deleted')
  } catch (error) {
    reject(error)
  }
});

// EXAMPLE USAGE
// (async () =>  {
//   let value = await DataService.delete(
//     {
//       dir: 'test',
//       file: 'test',
//     }
//   ).catch(e=> e.message);
//   console.log(value)
// }
// )()

module.exports = DataService