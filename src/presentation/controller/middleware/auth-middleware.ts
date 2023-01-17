import { GetAccountByToken } from "../../../domain/usecase/account";
import { httpForbidden, httpResponseOk } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AuthMiddleware implements Controller{
    constructor(private readonly getAccountByToken: GetAccountByToken){}
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        if(!httpRequest.headers['x-access-token']){
            return httpForbidden()
        }
        this.getAccountByToken.getAccount(httpRequest.headers['x-access-token'])
        return Promise.resolve(httpResponseOk({}))
    }

}