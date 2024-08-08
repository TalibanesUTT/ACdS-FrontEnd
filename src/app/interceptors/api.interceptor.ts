import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { environments } from "../../environments/environments";

export function apiInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const hasAbsoluteURL = request.url.startsWith('http');
    if (hasAbsoluteURL) {
        return next(request);
    }
    const apiUrl = environments.API_URL;
    
    const clone = request.clone({ url: apiUrl + request.url });
    return next(clone);
}