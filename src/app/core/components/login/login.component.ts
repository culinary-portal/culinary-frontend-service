import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/shared/services/auth/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from "../../services/alert.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  isLogin = false;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = {email, password};

    this.http.post('/api/auth/login', body, {headers, responseType: 'text'})
      .pipe(
        tap(response => {
          this.alertService.info('Login successful.');
          this.isLogin = true;
          this.loginForm.reset();
          this.router.navigate(['']).then(r => console.log('Navigated:', r));
        }),
        catchError(error => {
          console.error('Error:', error);
          this.alertService.error('Invalid credentials! Please try again.');
          return of(null);
        })
      )
      .subscribe();
  }
}
