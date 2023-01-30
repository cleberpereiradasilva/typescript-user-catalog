import { GetAccountByToken } from "../../../domain/usecase/account";
import { httpForbidden, httpResponseOk, httpServerError, httpUnAuthorized } from "../helper/http-response";
import { Controller } from "../protocols/interface";
import { HttpRequest, HttpResponse } from "../protocols/types";

export class AuthMiddleware implements Controller{
    constructor(
        private readonly getAccountByToken: GetAccountByToken,
        private readonly roles: string[] = []){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            if(!httpRequest.headers['x-access-token']){
                return httpForbidden()
            }
            const account = await this.getAccountByToken.getAccount(
                httpRequest.headers['x-access-token']
            )

            if(this.roles.length > 0){

                const simpleUserRoles = account.groups.map(group => 
                    group.roles.map(role => 
                        role.description
                    )
                ).reduce((arrAcumulator, rolesArr) => {
                    arrAcumulator  = arrAcumulator.concat(rolesArr)
                    return arrAcumulator
                }, [])

                const findedRoles = simpleUserRoles.filter(role => this.roles.includes(role))
                if(findedRoles.length === 0){
                    return httpUnAuthorized()
                }
            }
           
            if(!account){
                return httpForbidden()
            }

            return httpResponseOk(account)
            
        }catch(error){
            return httpServerError()
        }
    }

}