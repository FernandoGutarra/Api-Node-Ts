import { Request, Response } from "express";
import UserModel from "../Models/UserModel"; // Asegúrate de importar el modelo adecuado
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class ApiUserController {
  private model: UserModel;

  constructor() {
    this.model = new UserModel();
  }

  sendResponse(res: Response, status: number, payload?: any) {
    res.status(status).json(payload);
  }
  
  defaultMethod(res: Response) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }

  async verifyRegister(req: Request, res: Response) {
    if (req.body) {
      try {
        const body = req.body;
        const newPassword = body.password;
        const hashedPassword = await this.hashPassword(newPassword);
        if (hashedPassword) {
          const lastInsertId = await this.model.insertUser(
            body.name,
            body.gmail,
            hashedPassword,
            body.rol
          );
          if (lastInsertId) {
             this.sendResponse(res,200,{ message: "El Usuario Se Registró Correctamente" });
          } else {
            this.sendResponse(res,500,{ message: "No se pudo lograr Registrar" });
          }
        }
      } catch (error) {
          this.sendResponse(res,500,{ message: "Hubo un error al crear el usuario" });
      }
    }
  }

  async verifyLogin(req: Request, res: Response) {
    try {
      const body = req.body;
      if (body) {
        const gmail:string = body.email;
        const password:string = body.password;
        const user = await this.model.getUserForGmail(gmail);
        if (user && (await this.verifyPassword(password, user.password))) {
          const token = jwt.sign({ user }, "tu_secreto_secreto", {
            expiresIn: "1h",
          });
          this.sendResponse(res,200,{ token, user });
        } else {
          this.sendResponse(res,401,{ message: "Usuario o contraseña incorrectos" });
        }
      } else {
        this.sendResponse(res,400,{ message: "Datos de inicio de sesión no proporcionados" });
      }
    } catch (error) {
        this.sendResponse(res,500,{ message: "Error al verificar el inicio de sesión" });
    }
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(enteredPassword: string, hashedPassword: string) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  logout(req: Request, res: Response) {
    this.sendResponse(res,200,{ message: "Cierre de sesión exitoso" });
  }
}

export default ApiUserController;
