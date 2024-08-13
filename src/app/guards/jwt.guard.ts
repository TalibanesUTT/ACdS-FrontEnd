import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";

const JwtGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (token) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
}

export default JwtGuard;
