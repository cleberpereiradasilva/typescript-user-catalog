import { Request, Response } from "express";
import { Controller } from "../../presentation/controller/protocols/interface";

export const routeAdapter = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpResponse = await controller.handle({body: req.body })
        res.status(httpResponse.statusCode).send(httpResponse.body)
    }
}