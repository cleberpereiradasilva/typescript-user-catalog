import { GetAccountByToken } from "../../../domain/usecase/account";
import { RoleModel } from "../../../domain/usecase/model";
import { httpForbidden, httpResponseOk, httpServerError } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AuthMiddleware implements Controller{
    constructor(
        private readonly getAccountByToken: GetAccountByToken,
        private readonly roles: RoleModel[] = []){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            if(!httpRequest.headers['x-access-token']){
                return httpForbidden()
            }
            const account = await this.getAccountByToken.getAccount(httpRequest.headers['x-access-token'])
           
            if(!account){
                return httpForbidden()
            }
            return httpResponseOk(account)
            
        }catch(error){
            return httpServerError()
        }
    }

}