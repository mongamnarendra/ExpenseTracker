import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  constructor(private auth:AngularFireAuth,private router: Router) { }

  getuser() {
    return this.auth.authState;
  }

  login(email:string , password: string) {
    this.auth.signInWithEmailAndPassword(email,password).then((res) => {
      if(!res.user?.emailVerified) {
        this.router.navigate(['/verify']);
        this.user = res.user;
      }
      else {
        this.router.navigate(['/home'])
      }
    })
  }

  register(email: string, password:string) {
    this.auth.createUserWithEmailAndPassword(email,password).then((res) => {
        this.router.navigate(['/']);
        this.sendEmailForVerification(res.user);
    }).catch((err) => {
      console.error('Registration error:', err);
      alert('Registration failed. Please try again.');
    }
    );     
  }

  forgotPassword(email: string) {
    this.auth.sendPasswordResetEmail(email).then(() => {
      alert('Password reset email sent. Please check your inbox.');
      this.router.navigate(['/']);
    }).catch((err) => {
      console.error('Error sending password reset email:', err);
      alert('Failed to send password reset email. Please try again.');
    });
  }

   sendEmailForVerification(user: any) {
    user.sendEmailVerification().then(() => {
      alert('Verification email sent successfully');
      this.router.navigate(['/verify-email']);
    }, (err: any) => {
      alert(err.message);
      this.router.navigate(['register']);
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['../']);
    }).catch((err) => {
      console.error('Logout error:', err);
      alert('Logout failed. Please try again.');
    });
  }

  signInWithGoogle() {
     return this.auth.signInWithPopup(new GoogleAuthProvider).then(res => {
      if(!res.user?.emailVerified) {
        this.router.navigate(['/verify']);
        this.user = res.user;
      }
      else {
        this.router.navigate(['/home'])
      }
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }
}
