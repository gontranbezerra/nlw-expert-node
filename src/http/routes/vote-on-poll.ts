import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import z from 'zod';

import { randomUUID } from 'node:crypto';

import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request: FastifyRequest, reply: FastifyReply) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    // Criando uma identificação só para exercicio.
    // Melhor abordagem é via login
    let { sessionId } = request.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
        await prisma.vote
          .delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            },
          })
          .then((vote_deleted) => {
            const { pollId, pollOptionId } = vote_deleted;
            redis.zincrby(pollId, -1, pollOptionId);
          });
      } else if (userPreviousVoteOnPoll) {
        return reply.status(400).send({ message: 'You already voted on this poll.' });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      });
    }

    const vote = await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    await redis.zincrby(pollId, 1, pollOptionId);

    //   return { pollId: poll.id };
    return reply.status(201).send({ vote: true });
  });
}
