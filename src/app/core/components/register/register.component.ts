import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      repeatPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const {password, repeatPassword} = formGroup.controls;
    return password.value === repeatPassword.value ? null : {mismatch: true};
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const {username, email, password} = this.registerForm.value;
    this.authService.register({ username, email, password}).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        if (err.status === 500 && err.error?.message === 'User already exists!') {
          alert('Registration failed: User already exists!');
        } else {
          alert('Registration failed. Please try again later.');
        }
      }
    });
  }
}
