import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ExpenseTrackerService } from 'src/app/service/expense-tracker.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  expenses: any[] = [];
  filteredExpenses: any[] = [];
  searchTerm: string = '';

  constructor(
    private service: ExpenseTrackerService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.authservice.getuser().subscribe((data) => {
      if (data) {
        this.service.getUserExpenses(data.uid).subscribe((expenses) => {
          this.expenses = expenses;
          this.filteredExpenses = expenses;
        });
      }
    });
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredExpenses = this.expenses.filter(tx =>
      (tx.description && tx.description.toLowerCase().includes(term)) ||
      (tx.category && tx.category.toLowerCase().includes(term)) ||
      (tx.type && tx.type.toLowerCase().includes(term))
    );
  }

  generatePDF() {
    const data = document.getElementById('printSection');
    if (!data) {
      alert('No content to generate PDF.');
      return;
    }

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Transaction_History.pdf');
    }).catch(err => {
      console.error('PDF generation error:', err);
      alert('Error generating PDF. Please try again.');
    });
  }
}
