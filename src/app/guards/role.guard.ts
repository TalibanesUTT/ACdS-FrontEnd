import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {RoleEnum, UserRoleService} from '../sections/panel/appointments/user-role.service';
import {catchError, map, of} from 'rxjs';

const roleGuard: CanActivateFn = (route, state) => {
  const requiredRoles = route.data['roles'] as RoleEnum[];
  const router = inject(Router);
  const userRoleService = inject(UserRoleService);

  return userRoleService.role$.pipe(
    map(userRole => {
      if (requiredRoles.includes(userRole)) {
        return true;
      } else {
        return router.createUrlTree(['/']);
      }
    }),
    catchError(() => of(router.createUrlTree(['/'])))
  );
}

export default roleGuard;
