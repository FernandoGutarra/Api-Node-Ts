"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = void 0;
// authService.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserFromToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), 'tu_secreto_secreto');
        return decoded.user;
    }
    catch (error) {
        return null;
    }
}
exports.getUserFromToken = getUserFromToken;
