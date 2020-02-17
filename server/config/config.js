
//later on for creating a path to the db login info in a txt file
// try {
//     var data = fs.readFileSync('my-file.txt', 'utf8');
//     console.log(data);    
// } catch(e) {
//     console.log('Error:', e.stack);
// }

let config = {
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    database: 'denote-schema'
  };
   
  module.exports = config;