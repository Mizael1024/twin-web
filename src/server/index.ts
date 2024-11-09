import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rotas para vídeos
app.get('/api/videos', async (_req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeos' });
  }
});

app.post('/api/videos', async (req: Request, res: Response) => {
  try {
    const { src } = req.body;
    const video = await prisma.video.create({
      data: { src }
    });
    res.status(201).json(video);
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({ error: 'Erro ao criar vídeo' });
  }
});

app.delete('/api/videos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro ao deletar vídeo' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
