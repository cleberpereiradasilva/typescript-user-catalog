import { HttpResponse } from "../types/http-response"

export const BadRequest = (message: string): HttpResponse => ({
        statusCode: 400, 
        body: new Error(message),
})

export const ServerError = (message: string): HttpResponse => ({
        statusCode: 500, 
        body: new Error(message),
})