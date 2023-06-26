import fastify from 'fastify';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = fastify();
app.register(sensible);
const prisma = new PrismaClient();

app.get('/posts', async (req, res) => {
  return await commitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) {
    app.log.error(error);
    return app.httpErrors.internalServerError(error.message);
  }
  return data;
}

app.listen({ port: process.env.PORT || 3000 }, (err, address) => {
  console.log(`Server listening on ${address}`);
});
