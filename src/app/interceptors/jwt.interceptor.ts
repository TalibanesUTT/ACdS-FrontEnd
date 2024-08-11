import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const token = localStorage.getItem('token');
    if (!token) {
        return next(req);
    }
    
    const headers = req.headers.append('Authorization', `Bearer ${token}`);
    const clone = req.clone({ headers });
    return next(clone);
}