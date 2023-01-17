import { HttpRequest, HttpResponse } from "../types";

export interface Auth{
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}