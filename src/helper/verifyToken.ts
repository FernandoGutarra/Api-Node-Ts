import { Request, Response, NextFunction } from 'express';
import { getUserFromToken } from './authService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    gmail: string;
    password: string;
    rol: string;
  };
}

function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token:string | undefined = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token' });
  }
  const user = getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  req.user = user; // Almacenar información del usuario en el objeto de solicitud

  if (req.method === 'GET') {
    next(); // Solo llamamos a next() si es una solicitud GET
  } else {
    // Verificar el rol del usuario y permitir o denegar la petición en función del rol
    if (user.rol === 'admin') {
      next(); // Permitir cualquier método para usuarios con rol 'admin'
    } else {
      return res.status(403).json({ message: 'Acceso denegado: no tienes permisos suficientes para esta acción' });
    }
  }
}

export default verifyToken;
