// anything related to user will be here
// i.e join , disconnect , get all users in a room
const users = [];

// join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current User
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  userJoin,
  getCurrentUser,
};
