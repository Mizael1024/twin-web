import { prisma } from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await prisma.video.delete({
        where: {
          id: String(id),
        },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      return res.status(500).json({ error: 'Erro ao deletar vídeo' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
