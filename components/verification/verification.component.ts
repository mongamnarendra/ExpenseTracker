import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {

  constructor(private auth:AuthService) { }



  sendVerificationEmail() {
    if (this.auth.user) {
      this.auth.sendEmailForVerification(this.auth.user);
    } else {
      alert('No user is currently logged in.');
    }
  }
}
