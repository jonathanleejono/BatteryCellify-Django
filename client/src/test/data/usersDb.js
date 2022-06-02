const usersKey = '__bookshelf_users__';
let users = {};
const persist = () => window.localStorage.setItem(usersKey, JSON.stringify(users));
const load = () => Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey)));

// initialize
try {
  load();
} catch (error) {
  persist();
  // ignore json parse error
}

window.__bookshelf = window.__bookshelf || {};
window.__bookshelf.purgeUsers = () => {
  Object.keys(users).forEach((key) => {
    delete users[key];
  });
  persist();
};

function validateRegisterForm({ first_name, last_name, email, password }) {
  if (!first_name || !last_name || !email || !password) {
    const error = new Error('Please fill out all fields');
    error.status = 400;
    throw error;
  }
}

function validateLoginForm({ email, password }) {
  if (email || !password) {
    const error = new Error('Please fill out all fields');
    error.status = 400;
    throw error;
  }
}

async function login({ email, password }) {
  validateLoginForm({ email, password });
  const id = hash(email);
  const user = users[id] || {};
  if (user.passwordHash === hash(password)) {
    // return { ...sanitizeUser(user), token: btoa(user.id) };
    return { ...sanitizeUser(user), token: JSON.stringify(user.id) };
  }
  const error = new Error('Invalid credentials');
  error.status = 400;
  throw error;
}

async function register({ first_name, last_name, email, password }) {
  validateRegisterForm({ first_name, last_name, email, password });
  const id = hash(email);
  const passwordHash = hash(password);
  if (users[id]) {
    const error = new Error(`Cannot register a new user with the email "${email}"`);
    error.status = 400;
    throw error;
  }
  users[id] = { id, email, passwordHash };
  persist();
  return read(id);
}

async function read(id) {
  validateUser(id);
  return sanitizeUser(users[id]);
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

async function update(id, updates) {
  validateUser(id);
  Object.assign(users[id], updates);
  persist();
  return read(id);
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
  validateUser(id);
  delete users[id];
  persist();
}

function validateUser(id) {
  load();
  if (!users[id]) {
    const error = new Error(`No user with the id "${id}"`);
    error.status = 404;
    throw error;
  }
}

function hash(str) {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

async function reset() {
  users = {};
  persist();
}

export { login, register, read, update, remove, reset };
