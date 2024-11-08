import express from 'express';
import type { Router, Request, Response } from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rotas de autenticação
const authRouter: Router = express.Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(400).json({ message: 'Erro ao criar usuário' });
  }
});

authRouter.post('/login', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(400).json({ message: 'Erro ao fazer login' });
  }
});

app.use('/api/auth', authRouter);

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
