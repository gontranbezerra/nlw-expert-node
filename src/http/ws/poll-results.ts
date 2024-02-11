import { SocketStream } from '@fastify/websocket';

import { FastifyInstance, FastifyRequest } from 'fastify';

import z from 'zod';

import { Message, voting } from '../../utils/voting-pub-sub';

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true }, (connection: SocketStream, request: FastifyRequest) => {
    // connection.socket.on('message', (message: string) => {
    // //   message.toString() === 'hi from client';
    //   connection.socket.send('hi from server');
    // });

    // Inscrever apenas nas mensagens publicadas no canal com ID da enquete (pollId)
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });
    const { pollId } = voteOnPollParams.parse(request.params);

    voting.subscribe(pollId, (message: Message) => {
      connection.socket.send(JSON.stringify(message));
    });
  });
}
