import { Subject, Observable, of, from } from "rxjs";
import { map } from 'rxjs/operators';

/**
 * Watch user permissions
 */
export function watchPermissions(name: PermissionName): Observable<{ state: PermissionState | 'unsupported' }> {
  if (typeof navigator.permissions?.query !== 'function') {
    return of({ state: 'unsupported' });
  }

  const state$ = new Subject<{ state: PermissionState | 'unsupported' }>();

  from(navigator.permissions.query({ name }))
    .pipe(
      map((permissionStatus) => {
        state$.next({state: permissionStatus.state});

        permissionStatus.onchange = function() {
          state$.next({state: this.state});
        };
      })
    ).subscribe();

  return state$.pipe();
}