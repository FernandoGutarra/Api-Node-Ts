"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const ApiGameController_1 = __importDefault(require("./Controllers/ApiGameController"));
const ApiCategoryController_1 = __importDefault(require("./Controllers/ApiCategoryController"));
const ApiUserController_1 = __importDefault(require("./Controllers/ApiUserController"));
const verifyToken_1 = __importDefault(require("./helper/verifyToken"));
const router = express_1.default.Router();
const gameController = new ApiGameController_1.default();
const categorieController = new ApiCategoryController_1.default();
const userController = new ApiUserController_1.default();
// Configurar multer para manejar la subida de archivos
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Prefijo "/api" para todas las rutas de la API
// Definir las rutas para ApiGameController
router.get('/api/games', verifyToken_1.default, (req, res) => gameController.getGames(res));
router.get('/api/game/:ID', verifyToken_1.default, (req, res) => gameController.getGame(req, res));
router.delete('/api/game/:ID', verifyToken_1.default, (req, res) => gameController.deleteGame(req, res));
router.put('/api/game/:ID', verifyToken_1.default, upload.single('mainImage'), (req, res) => {
    gameController.updateGame(req, res);
});
router.post('/api/game', verifyToken_1.default, upload.single('mainImage'), (req, res) => {
    gameController.insertGame(req, res);
});
router.get('/api/categories', verifyToken_1.default, (req, res) => categorieController.getCategories(res));
router.get('/api/category/:ID', verifyToken_1.default, (req, res) => categorieController.getCat(req, res));
router.delete('/api/category/:ID', verifyToken_1.default, (req, res) => categorieController.deleteCat(req, res));
router.put('/api/category/:ID', verifyToken_1.default, (req, res) => categorieController.updateCat(req, res));
router.post('/api/category', verifyToken_1.default, (req, res) => categorieController.updateCat(req, res));
// Definir las rutas para ApiUserController
router.post('/api/register', (req, res) => userController.verifyRegister(req, res));
router.post('/api/login', (req, res) => userController.verifyLogin(req, res));
router.use('/api', (req, res, next) => {
    // Middleware para verificar la ruta
    if (!req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    next();
});
exports.default = router;
