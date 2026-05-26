import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado.';

      if (error.status === 0) {
        message = 'No se pudo conectar con el servidor.';
      } else if (error.status === 404) {
        message = 'No se encontraron resultados.';
      } else if (error.status >= 500) {
        message = 'Error interno del servidor. Intenta más tarde.';
      }

      return throwError(() => new Error(message));
    })
  );
};
