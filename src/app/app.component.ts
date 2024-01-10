import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  userForm: FormGroup;
  strengthBarClass: string = '';
  passwordMismatch: boolean = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      strength: [''],
    });

    this.userForm.get('password')?.valueChanges.subscribe(password => {
      this.updateStrength(password);
    });
  }

  onSubmit(): void {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
    const strengthText = this.userForm.get('strength');

    if (password !== confirmPassword && password.length > 0) {
      strengthText?.setValue('Passwords do not match');
      this.userForm
        .get('strengthColorClass')?.setValue('password-strength--easy');
      this.strengthBarClass = 'bar-lessThanEight'
      this.passwordMismatch = true;

      return;
    }

    this.updateStrength(password);
  }

  togglePasswordVisibility() {
    const passwordInput = document
      .getElementById('passwordInput') as HTMLInputElement;
    const passwordConfirm = document
      .getElementById('confirmPassword') as HTMLInputElement;

    passwordInput.type = passwordInput.type ===
        'password'
      ? 'text'
      : 'password';
    passwordConfirm.type = passwordConfirm.type ===
        'password'
      ? 'text'
      : 'password';
  }

  updateStrength(password: string): void {
    const strengthText = this.userForm.get('strength');
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+{}\]:;<>,.?~\\/-]/.test(password);
    const hasEightSymbols = password.length >= 8;

    this.passwordMismatch = false;

    if (password.length === 0) {
      strengthText?.setValue('field is empty');
      this.strengthBarClass = 'bar';
    } else if (password.length < 8) {
      this.strengthBarClass = 'bar-lessThanEight'
      strengthText?.setValue('easy');
    } else if (hasLetters && hasNumbers && hasSymbols && hasEightSymbols) {
      strengthText?.setValue('strong');
      this.strengthBarClass = 'bar-strong';
    } else if (((hasLetters && hasNumbers)
        || (hasLetters && hasSymbols)
        || (hasSymbols && hasNumbers))
        && hasEightSymbols)
    {
      strengthText?.setValue('medium');
      this.strengthBarClass = 'bar-medium';
    } else {
      strengthText?.setValue('easy');
      this.strengthBarClass = 'bar-easy';
    }
  }
}
