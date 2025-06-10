import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css']
})
export class InvoiceListComponent {
  invoices: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    const saved = localStorage.getItem('invoices');
    this.invoices = saved ? JSON.parse(saved) : [];
  }

  deleteInvoice(index: number) {
    if (confirm('Bạn có chắc muốn xóa hóa đơn này?')) {
      this.invoices.splice(index, 1);
      localStorage.setItem('invoices', JSON.stringify(this.invoices));
    }
  }

  viewInvoice(index: number) {
    // Chuyển tới trang xem/sửa hóa đơn, truyền index
    this.router.navigate(['/invoice-view', index]);
  }
}
