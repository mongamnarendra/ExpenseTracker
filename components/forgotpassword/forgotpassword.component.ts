import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
f: any;
  constructor(private formBuilder: FormBuilder,private auth:AuthService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.auth.forgotPassword(this.forgotPasswordForm.value.email);
    
  }
}
