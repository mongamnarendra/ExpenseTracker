import { Component, OnInit } from '@angular/core';
import { ExpenseTrackerService } from 'src/app/service/expense-tracker.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent implements OnInit {

  userId!: string;
  savingsList: any[] = [];

  // Form model for add/edit
  currentSaving = {
    name: '',
    amount: 0
  };

  isEditMode = false;
  editIndex: number | null = null;

  constructor(
    private expenseService: ExpenseTrackerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getuser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadSavings();
      }
    });
  }

  loadSavings() {
    this.expenseService.getSavings(this.userId).subscribe(savings => {
      this.savingsList = savings;
    });
  }

  addSaving() {
    if (!this.currentSaving.name || this.currentSaving.amount <= 0) {
      alert('Please enter a valid name and amount');
      return;
    }

    this.expenseService.addSaving(this.currentSaving, this.userId).then(() => {
      this.resetForm();
    }).catch(err => {
      console.error('Error adding saving:', err);
    });
  }

  editSaving(index: number) {
    this.isEditMode = true;
    this.editIndex = index;
    const saving = this.savingsList[index];
    this.currentSaving = { name: saving.name, amount: saving.amount };
  }

  updateSaving() {
  if (this.editIndex === null) return;

  if (!this.currentSaving.name || this.currentSaving.amount <= 0) {
    alert('Please enter a valid name and amount');
    return;
  }

  const savingId = this.savingsList[this.editIndex].id;
  this.expenseService.updateSaving(this.currentSaving, this.userId, savingId).then(() => {
    this.resetForm();
  }).catch(err => {
    console.error('Error updating saving:', err);
  });
}


  deleteSaving(index: number) {
    const savingId = this.savingsList[index].id;
    if(confirm('Are you sure you want to delete this saving?')){
      this.expenseService.deleteSaving(this.userId, savingId).catch(err => {
        console.error('Error deleting saving:', err);
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.currentSaving = { name: '', amount: 0 };
    this.isEditMode = false;
    this.editIndex = null;
  }
}
