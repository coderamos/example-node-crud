const express = require('express');
const server = express();

server.use(express.json());

const users = ['Goku', 'Vegeta'];

//global middlewares
server.use((request, response, next) => {
  console.log(`METHOD: ${request.method}, ENDPOINT: ${request.url},  `);
  return next();
});

//local middlewares
function checkNameExists(request, response, next) {
  request.body.name
    ? next()
    : response.status(400).json({ error: 'the property NAME is required!' });
}

function checkIndexExists(request, response, next) {
  const user = users[request.params.index];
  user
    ? ((request.user = user), next())
    : response.status(400).json({ error: 'the user does NOT EXISTS!' });
}

//API endpoints
server.get('/users', (request, response) => {
  return response.json(users);
});

server.get('/users/:index', checkIndexExists, (request, response) => {
  return response.json(request.user);
});

server.post('/users', checkNameExists, (request, response) => {
  const { name } = request.body;
  users.push(name);
  return response.json(users);
});

server.put(
  '/users/:index',
  checkNameExists,
  checkIndexExists,
  (request, response) => {
    const { index } = request.params;
    const { name } = request.body;
    users[index] = name;
    return response.json(users);
  }
);

server.delete('/users/:index', (request, response) => {
  const { index } = request.params;
  users.splice(index, 1);
  return response.send(`user has been deleted!`);
});

server.listen(3333);
