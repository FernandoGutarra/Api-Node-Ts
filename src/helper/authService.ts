// authService.ts
import jwt from 'jsonwebtoken';

export function getUserFromToken(token: string): any {
  try {
    const decoded: any = jwt.verify(token.replace('Bearer ', ''), 'tu_secreto_secreto');
    return decoded.user;
  } catch (error) {
    return null;
  }
}
