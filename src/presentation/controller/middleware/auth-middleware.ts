import { GetAccountByToken } from "../../../domain/usecase/account";
import { httpForbidden, httpResponseOk } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AuthMiddleware implements Controller{
    constructor(private readonly getAccountByToken: GetAccountByToken){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        if(!httpRequest.headers['x-access-token']){
            return httpForbidden()
        }
        const account = await this.getAccountByToken.getAccount(httpRequest.headers['x-access-token'])
        
        if(!account){
           return Promise.resolve(httpForbidden()) 
        }
        return Promise.resolve(httpResponseOk({}))
    }

}