import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;

  user: any;
  isSidebarHidden = false;



  constructor(private auth: AuthService) {

  }

  ngOnInit() {
    this.auth.getuser().subscribe((user) => {
      this.user = user;
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('No user is logged in');
      }
    }
    );

  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  logout() {
    this.auth.logout();
  }
}
