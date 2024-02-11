import fastify from 'fastify';

import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';

const app = fastify();

// GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

app.register(createPoll);
app.register(getPoll);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!');
});
