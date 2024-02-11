import cookie, { FastifyCookieOptions } from '@fastify/cookie';

import fastify from 'fastify';

import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';

const app = fastify();

app.register(cookie, {
  secret: 'my-secret-polls-app-nlw-XPTO', // for cookies signature - for cookie idintify
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  //   parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

// Routes: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!');
});
