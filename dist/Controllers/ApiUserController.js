"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../Models/UserModel")); // Asegúrate de importar el modelo adecuado
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ApiUserController {
    constructor() {
        this.model = new UserModel_1.default();
    }
    sendResponse(res, status, payload) {
        res.status(status).json(payload);
    }
    defaultMethod(res) {
        res.status(404).json({ message: "Error: Ruta no encontrada." });
    }
    verifyRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                try {
                    const body = req.body;
                    const newPassword = body.password;
                    const hashedPassword = yield this.hashPassword(newPassword);
                    if (hashedPassword) {
                        const lastInsertId = yield this.model.insertUser(body.name, body.gmail, hashedPassword, body.rol);
                        if (lastInsertId) {
                            this.sendResponse(res, 200, { message: "El Usuario Se Registró Correctamente" });
                        }
                        else {
                            this.sendResponse(res, 500, { message: "No se pudo lograr Registrar" });
                        }
                    }
                }
                catch (error) {
                    this.sendResponse(res, 500, { message: "Hubo un error al crear el usuario" });
                }
            }
        });
    }
    verifyLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (body) {
                    const gmail = body.email;
                    const password = body.password;
                    const user = yield this.model.getUserForGmail(gmail);
                    if (user && (yield this.verifyPassword(password, user.password))) {
                        const token = jsonwebtoken_1.default.sign({ user }, "tu_secreto_secreto", {
                            expiresIn: "1h",
                        });
                        this.sendResponse(res, 200, { token, user });
                    }
                    else {
                        this.sendResponse(res, 401, { message: "Usuario o contraseña incorrectos" });
                    }
                }
                else {
                    this.sendResponse(res, 400, { message: "Datos de inicio de sesión no proporcionados" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al verificar el inicio de sesión" });
            }
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return bcrypt_1.default.hash(password, saltRounds);
        });
    }
    verifyPassword(enteredPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(enteredPassword, hashedPassword);
        });
    }
    logout(req, res) {
        this.sendResponse(res, 200, { message: "Cierre de sesión exitoso" });
    }
}
exports.default = ApiUserController;
