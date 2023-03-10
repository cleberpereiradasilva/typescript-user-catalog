import { HttpResponse } from "../../protocols/types"

export const httpBadRequest = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body:  { message },
})

export const httpMissingParameter = (message: string): Promise<HttpResponse> => Promise.resolve({
        statusCode: 400, 
        body: {message: `Parameter '${message}' is required`},
})


export const httpUnAuthorized = (): Promise<HttpResponse> => Promise.resolve({
        statusCode: 401, 
        body:  {message: `Access not Authorized` },
})

export const httpForbidden = (): Promise<HttpResponse> => Promise.resolve({
        statusCode: 403, 
        body:  {message: `Forbidden Access` },
})




export const httpServerError = (message?: string | Error): Promise<HttpResponse> => Promise.resolve({
        statusCode: 500, 
        body: message || new Error('Internal Server Error')
})