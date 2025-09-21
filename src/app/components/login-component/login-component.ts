import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-services/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'] // ✅ plural
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router // ✅ inject Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;
    console.log('📤 Sending login request:', loginData);

    this.loginService.login(loginData).subscribe({
      next: (res) => {
        console.log('✅ Login successful:', res);
        this.successMessage = 'Login successful!';
        
        // ✅ Navigate to Feed component
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.errorMessage = 'Invalid login. Please try again.';
      }
    });
  }
}
