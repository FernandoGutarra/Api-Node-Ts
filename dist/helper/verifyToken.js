"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = require("./authService");
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó el token' });
    }
    const user = (0, authService_1.getUserFromToken)(token);
    if (!user) {
        return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = user; // Almacenar información del usuario en el objeto de solicitud
    if (req.method === 'GET') {
        next(); // Solo llamamos a next() si es una solicitud GET
    }
    else {
        // Verificar el rol del usuario y permitir o denegar la petición en función del rol
        if (user.rol === 'admin') {
            next(); // Permitir cualquier método para usuarios con rol 'admin'
        }
        else {
            return res.status(403).json({ message: 'Acceso denegado: no tienes permisos suficientes para esta acción' });
        }
    }
}
exports.default = verifyToken;
