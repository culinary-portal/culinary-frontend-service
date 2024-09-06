import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: []
})
export class CustomAlertComponent {
  alertType: 'info' | 'error' | 'success' | 'warning' = 'info';

  constructor(
    public dialogRef: MatDialogRef<CustomAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {message: string; type: 'info' | 'error' | 'success' | 'warning' }
  ) {
    this.alertType = data.type || 'info';
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getAlertClasses() {
    switch (this.alertType) {
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'info':
      default:
        return 'bg-blue-600 text-white';
    }
  }
}
