import Swal from 'sweetalert2';

export class SweetAlert {
  //Alert success
  static success(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 2000,
    });
  }
  //Alert error
  static error(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }
  //Alert warning
  static warning(title: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
    });
  }
  //Alert info
  static info(title: string, message: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
    });
  }
}
