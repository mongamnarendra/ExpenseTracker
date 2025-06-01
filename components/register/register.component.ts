import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string='';
  password: string='';
  confirmPassword: string='';

  constructor(private auth:AuthService) {

  }

  register() {
    if(this.email=='' || this.password==='' || this.confirmPassword==='') {
      alert('Please fill in all fields');
      return;
    }
    if(this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    this.auth.register(this.email, this.password);
  }
}
