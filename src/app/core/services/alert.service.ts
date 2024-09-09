import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CustomAlertComponent} from '../custom-alert/custom-alert.component'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private dialog: MatDialog) {
  }

  error(message: string) {
    const type = 'error';
    this.dialog.open(CustomAlertComponent, {
      data: {message, type},
      panelClass: 'custom-alert-dialog',
      disableClose: true
    });
  }

  info(message: string) {
    const type = 'info';
    this.dialog.open(CustomAlertComponent, {
      data: {message, type},
      panelClass: 'custom-alert-dialog',
      disableClose: true
    });
  }

  warn(message: string) {
    const type = 'warn';

    this.dialog.open(CustomAlertComponent, {
      data: {message, type},
      panelClass: 'custom-alert-dialog',
      disableClose: true
    });
  }
}
