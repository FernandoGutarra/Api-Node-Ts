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
const CategoryModel_1 = __importDefault(require("../Models/CategoryModel")); // Asegúrate de importar el modelo adecuado
class ApiCategoryController {
    constructor() {
        this.model = new CategoryModel_1.default();
    }
    sendResponse(res, status, payload) {
        res.status(status).json(payload);
    }
    defaultMethod(res) {
        res.status(404).json({ message: "Error: Ruta no encontrada." });
    }
    getCategories(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.model.getCategories();
                this.sendResponse(res, 200, categories);
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al obtener las categorías" });
            }
        });
    }
    getCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    this.sendResponse(res, 200, category);
                }
                else {
                    this.sendResponse(res, 404, { message: "La categoría no se encontró en la base de datos" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al obtener la categoría" });
            }
        });
    }
    updateCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    const body = req.body;
                    yield this.model.updateCat(body.name, id);
                    this.sendResponse(res, 200, { message: "La categoría fue actualizada correctamente" });
                }
                else {
                    this.sendResponse(res, 404, { message: "No se encontró la categoría con ese ID" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al actualizar la categoría" });
            }
        });
    }
    deleteCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    yield this.model.deleteCat(id);
                    this.sendResponse(res, 200, { message: "Se eliminó correctamente la categoría" });
                }
                else {
                    this.sendResponse(res, 404, { message: "No se puede eliminar porque no existe la categoría" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al eliminar la categoría" });
            }
        });
    }
    insertCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const id = yield this.model.insertCat(body.name);
                if (id) {
                    this.sendResponse(res, 200, { message: "La categoría se insertó correctamente" });
                }
                else {
                    this.sendResponse(res, 500);
                }
            }
            catch (error) {
                this.sendResponse(res, 200, { message: "Error al insertar la categoría" });
            }
        });
    }
}
exports.default = ApiCategoryController;
