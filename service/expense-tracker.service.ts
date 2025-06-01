import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Budget } from '../model/budget';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerService {

  constructor(private auth: AuthService, private store: AngularFirestore) { }


  getUserExpenses(id: string) {
    return this.store.collection('user').doc(id).collection('expenses', ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  addExpense(expense: any, uid: string) {
    return this.store.collection('user').doc(uid).collection('expenses').add(expense);
  }

  setBudget(budget: number, uid: string) {
    return this.store.collection('user').doc(uid).collection('budget').add({
      monthlyBudget: budget,
      isMonthlyBudgetSet: true
    })
  }

  getBudget(uid: string) {
    return this.store.collection('user').doc(uid).collection('budget').valueChanges({ idField: 'id' });
  }

  addSaving(saving: any, userId: string) {
    return this.store.collection('user').doc(userId).collection('savings').add(saving);
  }

  // Get Savings List
  getSavings(userId: string) {
    return this.store.collection('user').doc(userId).collection('savings').valueChanges({ idField: 'id' });
  }

  // Delete Savings Entry
  deleteSaving(userId: string, savingId: string) {
    return this.store.collection('user').doc(userId).collection('savings').doc(savingId).delete();
  }

  updateSaving(saving: any, userId: string, savingId: string) {
  return this.store.collection('user').doc(userId).collection('savings').doc(savingId).update(saving);
}



}
