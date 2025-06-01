import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { Transactions } from 'src/app/model/transactions';
import { AuthService } from 'src/app/service/auth.service';
import { ExpenseTrackerService } from 'src/app/service/expense-tracker.service';
import { Budget } from 'src/app/model/budget';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  monthlyBudget!: any;
  isMonthlyBudgetSet!: boolean;
  user?: any;
  remainingBudget: number = 0;

  newExpense = {
    description: '',
    amount: 0,
    category: '',
    date: '',
    type: ''
  };

  pieChartLabels: string[] = ['Balance', 'Expenditure'];
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0], // Initial values, will be updated after fetching data
        label: 'Budget vs Expenditure',
        backgroundColor: ['#4CAF50', '#F44336'],
      }
    ]
  };

  // Transactions Table
  recentTransactions: Transactions[] = [];
  totalExpenses: number = 0;
  isBudgetExceed: boolean = false;
  totalTransactions: Transactions[]=[];
  alertMessage: string = 'You have exceeded your budget for this month! Please review your expenses.';
  

  constructor(private service: ExpenseTrackerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getuser().subscribe((user) => {

      if (user) {
        this.user = user;
        console.log('User is logged in:', user);
        this.service.getUserExpenses(user.uid).subscribe((data) => {

          this.recentTransactions = (data as Transactions[]).slice(0,6);
          this.totalTransactions = data as Transactions[];
        })

        this.service.getBudget(user.uid).subscribe((data) => {
          if (data.length > 0) {
            this.monthlyBudget = data[0]['monthlyBudget'] ?? 0;
            this.isMonthlyBudgetSet = data[0]['isMonthlyBudgetSet'] ?? false;

            
            for(let i of this.totalTransactions) {
              if(i.type === 'Debited') {
                this.totalExpenses += i.amount;
              }
              if(i.type === 'Credited') {
                this.totalExpenses -= i.amount;
              }
            }
            this.remainingBudget = Math.max(this.monthlyBudget - this.totalExpenses, 0);
            if( this.remainingBudget <= 0) {
              this.isBudgetExceed = true;
            }
            // Update Pie Chart data
            this.pieChartData.datasets[0].data = [this.remainingBudget, this.totalExpenses];

            console.log('Pie Chart Data:', this.pieChartData.datasets[0].data);
          }
        } );
      } else {
        console.log('No user is logged in');
      }
    }
    );





  }

  saveExpense() {
    if (this.newExpense.description && this.newExpense.amount && this.newExpense.category && this.newExpense.date && this.newExpense.type) {
      this.service.addExpense(this.newExpense, this.user?.uid).then(() => {
        console.log('Expense added successfully');
        window.location.reload();
      }, (error) => {
        console.error('Error adding expense:', error);
      });
      
    }
    else {
      console.error('Please fill in all fields');
    }
  }

  setBudget() {
    if (this.monthlyBudget <= 0) {
      console.error('Budget must be greater than 0');
      return;
    }
    else {
      console.log('Setting budget:', this.monthlyBudget);
      this.isMonthlyBudgetSet = true;
      this.service.setBudget(this.monthlyBudget, this.user?.uid);
    }
  }

}
