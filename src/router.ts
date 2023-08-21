import express from 'express';
import multer from 'multer';
import ApiGameController from './Controllers/ApiGameController';
import ApiCategoryController from './Controllers/ApiCategoryController';
import ApiUserController from './Controllers/ApiUserController';
import verifyToken from './helper/verifyToken';

const router = express.Router();
const gameController = new ApiGameController();
const categorieController = new ApiCategoryController();
const userController = new ApiUserController();

// Configurar multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Prefijo "/api" para todas las rutas de la API

// Definir las rutas para ApiGameController
router.get('/api/games', verifyToken,(req,res) => gameController.getGames(res));
router.get('/api/game/:ID', verifyToken, (req,res) => gameController.getGame(req,res));
router.delete('/api/game/:ID', verifyToken,(req,res) => gameController.deleteGame(req,res));
router.put('/api/game/:ID', verifyToken, upload.single('mainImage'), (req, res) => {
  gameController.updateGame(req, res);
});
router.post('/api/game', verifyToken, upload.single('mainImage'), (req,res) => {
gameController.insertGame(req , res)
});
 
router.get('/api/categories', verifyToken, (req, res) => categorieController.getCategories(res));
router.get('/api/category/:ID', verifyToken,(req , res) => categorieController.getCat(req,res));
router.delete('/api/category/:ID', verifyToken,(req , res) => categorieController.deleteCat(req,res));
router.put('/api/category/:ID', verifyToken, (req , res) =>categorieController.updateCat(req,res));
router.post('/api/category', verifyToken, (req ,res ) =>categorieController.updateCat(req,res));

// Definir las rutas para ApiUserController
router.post('/api/register',(req,res) => userController.verifyRegister(req,res));
router.post('/api/login', (req,res) => userController.verifyLogin(req,res));

router.use('/api', (req, res, next) => {
  // Middleware para verificar la ruta
  if (!req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'Ruta no encontrada' });
  }
  next();
});

export default router;

