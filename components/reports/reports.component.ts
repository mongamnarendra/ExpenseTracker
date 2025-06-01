import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ExpenseTrackerService } from 'src/app/service/expense-tracker.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  totalExpenditure: number = 0;
  totalAmount!: number;
  expenses: any[] = [];
  foodAmount: number = 0;
  transportAmount: number = 0;
  entertainmentAmount: number = 0;
  clothingAmount: number = 0;
  rentAmount: number = 0;
  otherAmount: number = 0;
  creditedAmount: number = 0;
  remaining: number = 0;

  categoryChartType: ChartType = 'doughnut';
  categoryChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: []
  };
  categoryChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}/-`;
          }
        }
      }
    }
  };

  constructor(private authService: AuthService, private service: ExpenseTrackerService) {

  }

  ngOnInit(): void {
  this.authService.getuser().subscribe((user) => {
    if (user) {
      this.service.getBudget(user.uid).subscribe((budgetData) => {
        if (budgetData.length > 0) {
          this.totalAmount = budgetData[0]['monthlyBudget'];
          console.log('Budget:', this.totalAmount);
        } else {
          this.totalAmount = 0;
          console.log('No budget data found for user');
        }

        // Now fetch expenses after budget is ready
        this.service.getUserExpenses(user.uid).subscribe((expensesData) => {
          this.expenses = expensesData as any[];
          console.log('Expenses:', this.expenses);

          // After both budget and expenses are ready, update chart
          this.setupChartData();
        });
      });
    } else {
      console.log('No user is logged in');
    }
  });
}


  setupChartData() {
    const categoryLabels: string[] = [];
    const categoryAmounts: number[] = [];

    // Reset all category amounts before calculating
    this.foodAmount = 0;
    this.transportAmount = 0;
    this.entertainmentAmount = 0;
    this.clothingAmount = 0;
    this.otherAmount = 0;
    this.creditedAmount = 0;
    this.totalExpenditure = 0;

    // Process expenses
    for (let i of this.expenses) {
      if (i.type === 'Debited') {
        this.totalExpenditure += i.amount;

        switch (i.category) {
          case 'Food':
            this.foodAmount += i.amount;
            break;
          case 'Travel':
            this.transportAmount += i.amount;
            break;
          case 'Entertainment':
            this.entertainmentAmount += i.amount;
            break;
          case 'Clothing':
            this.clothingAmount += i.amount;
            break;
          case 'Rents':
            this.rentAmount += i.amount;
            break;
          default:
            this.otherAmount += i.amount;
        }
      } else if (i.type === 'Credited') {
        this.creditedAmount += i.amount;
      }
    }

    // Build chart data
    if (this.foodAmount > 0) {
      categoryLabels.push('Food');
      categoryAmounts.push(this.foodAmount);
    }
    if (this.transportAmount > 0) {
      categoryLabels.push('Transport');
      categoryAmounts.push(this.transportAmount);
    }
    if (this.entertainmentAmount > 0) {
      categoryLabels.push('Entertainment');
      categoryAmounts.push(this.entertainmentAmount);
    }
    if (this.clothingAmount > 0) {
      categoryLabels.push('Clothing');
      categoryAmounts.push(this.clothingAmount);
    }
    if (this.otherAmount > 0) {
      categoryLabels.push('Other');
      categoryAmounts.push(this.otherAmount);
    }
    if (this.creditedAmount > 0) {
      categoryLabels.push('Credited');
      categoryAmounts.push(this.creditedAmount);
    }

    if(this.rentAmount  > 0) {
      categoryLabels.push('Rent');
      categoryAmounts.push(this.rentAmount);
    }

    if (this.totalExpenditure >= 0) {
      console.log('Total Expenditure:', this.totalExpenditure);
      this.remaining = this.totalAmount - this.totalExpenditure + this.creditedAmount
      console.log('Remaining Balance:', this.remaining);
    }

    categoryLabels.push('Remaining Balance');
    categoryAmounts.push(this.remaining);

    // Final Chart Data
    this.categoryChartData = {
      labels: categoryLabels,
      datasets: [{
        data: categoryAmounts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#00C851', '#FF9F40'
        ],
        borderWidth: 1
      }]
    };
  }

}
