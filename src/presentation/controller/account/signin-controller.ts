import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class SigninController implements Controller{
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve({
            statusCode: 400
        })        
    }
}