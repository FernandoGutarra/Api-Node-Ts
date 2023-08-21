import CategoryModel from '../Models/CategoryModel'; // Asegúrate de importar el modelo adecuado
import { Request, Response } from 'express'; // Importa los tipos para Request y Response
class ApiCategoryController {
  private model: CategoryModel;

  constructor() {
    this.model = new CategoryModel();
  }
  sendResponse(res: Response, status: number, payload?: any) {
    res.status(status).json(payload);
  }
  defaultMethod(res: Response) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }

  async getCategories(res: Response) {
    try {
      const categories = await this.model.getCategories();
      this.sendResponse(res,200,categories);
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al obtener las categorías" });
    }
  }

  async getCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        this.sendResponse(res,200,category);
      } else {
        this.sendResponse(res,404,{ message: "La categoría no se encontró en la base de datos" });
      }
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al obtener la categoría" });
    }
  }

  async updateCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        const body = req.body;
        await this.model.updateCat(body.name, id);
        this.sendResponse(res,200,{ message: "La categoría fue actualizada correctamente" });
      } else {
        this.sendResponse(res,404,{ message: "No se encontró la categoría con ese ID" });
      }
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al actualizar la categoría" });
    }
  }

  async deleteCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        await this.model.deleteCat(id);
        this.sendResponse(res,200,{ message: "Se eliminó correctamente la categoría" });
      } else {
        this.sendResponse(res,404,{ message: "No se puede eliminar porque no existe la categoría" });
      }
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al eliminar la categoría" });
    }
  }

  async insertCat(req: Request, res: Response) {
    try {
      const body = req.body;
      const id = await this.model.insertCat(body.name);
      if (id) {
        this.sendResponse(res,200,{ message: "La categoría se insertó correctamente" });
      } else {
        this.sendResponse(res,500);
      }
    } catch (error) {
      this.sendResponse(res,200,{ message: "Error al insertar la categoría" });
    }
  }
}

export default ApiCategoryController;
