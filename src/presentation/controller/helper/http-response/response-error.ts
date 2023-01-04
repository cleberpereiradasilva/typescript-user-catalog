import { HttpResponse } from "../../protocols/types"

export const httpBadRequest = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body: message,
})

export const httpMissingParameter = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body: `Parameter '${message}' is required`,
})

export const httpServerError = (message?: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 500, 
        body: message || new Error('Internal server error')
})