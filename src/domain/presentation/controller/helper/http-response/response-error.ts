import { HttpResponse } from "../../protocols/types"

export const BadRequest = (message: string): HttpResponse => ({
        statusCode: 400, 
        body: new Error(message),
})

export const ServerError = (message: string): HttpResponse => ({
        statusCode: 500, 
        body: new Error(message),
})