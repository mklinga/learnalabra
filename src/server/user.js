var fs = require('fs');

var USERS = '../assets/users.json';
var users = [];
var lastUserId;

function loadUsers() {
  return new Promise(function (resolve, reject) {
    fs.readFile(USERS, 'utf8', function (err, data) {
      if (err) {
        console.error('Error reading the users.json!');
        reject(err);
      }
      users = JSON.parse(data);
      lastUserId = users.reduce(function(id, user) { return Math.max(id, user.id); }, 0);
      console.log(users.length + ' users loaded');
      resolve();
    });
  })
}

function saveUsers () {
  return new Promise(function (resolve, reject) {
    fs.writeFile(USERS, JSON.stringify(users), function (err) {
      if (err) {
        console.error('Error writing the users.json!');
        reject(err);
      }
      console.log('Saving users ok!');
      resolve();
    });
  })
}

function getUser (id) {
  return users.find(function (user) { return user.id === id; });
}

module.exports = {
  loadUsers: loadUsers,
  saveUsers: saveUsers,
  getUser: getUser
};