import fastify from 'fastify';

import { createPoll } from './routes/create-poll';

const app = fastify();

// GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!');
});
