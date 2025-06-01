import { Component } from '@angular/core';
import { ExpenseTrackerService } from '../service/expense-tracker.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  user:any;
  constructor(private auth: AuthService) {

  }

  ngOnInit() {
    console.log(this.auth.user);
  }
}

