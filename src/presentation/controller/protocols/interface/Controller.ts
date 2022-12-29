import { HttpRequest, HttpResponse } from "../types";

export interface Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}