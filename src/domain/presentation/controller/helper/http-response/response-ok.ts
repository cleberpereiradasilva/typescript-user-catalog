import { HttpResponse } from "../types/http-response"

export const ResponseOk = (): HttpResponse => ({
        statusCode: 200, 
})
