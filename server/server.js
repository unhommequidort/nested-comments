import fastify from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
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

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  return await commitToDb(
    prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            message: true,
            parentId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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
