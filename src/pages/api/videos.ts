import { prisma } from '../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const videos = await prisma.video.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
      return res.status(200).json(videos);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      return res.status(500).json({ error: 'Erro ao buscar vídeos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { src } = req.body;
      const video = await prisma.video.create({
        data: {
          src,
        },
      });
      return res.status(201).json(video);
    } catch (error) {
      console.error('Erro ao criar vídeo:', error);
      return res.status(500).json({ error: 'Erro ao criar vídeo' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
