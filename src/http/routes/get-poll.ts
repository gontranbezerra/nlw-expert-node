import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import z from 'zod';

import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request: FastifyRequest, reply: FastifyReply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        // options: true, // vai trazer tudo
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) return reply.status(400).send({ message: 'Poll not found' });

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES');
    // result recebe do Redis no formato:
    // ['51856dda-108e-40ad-890e-4a4588716685','5','fdcc992f-0868-49d9-966b-1014857e82ca','2',]
    // console.log(result);

    // Convertendo o array do Redis em objeto javascript
    const votes = result.reduce((obj: Record<string, number>, line: string, index: number) => {
      if (index % 2 === 0) {
        const score = result[index + 1];
        Object.assign(obj, { [line]: parseInt(score) });
      }
      return obj;
    }, {} as Record<string, number>);
    // console.log(votes);

    // return reply.send({ poll });
    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        opttions: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
