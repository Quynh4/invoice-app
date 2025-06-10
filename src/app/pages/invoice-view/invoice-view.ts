import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-view.html',
  styleUrls: ['./invoice-view.css']
})
export class InvoiceViewComponent {
  invoiceIndex: number = -1;
  invoiceData: Array<{ [key: string]: any }>= [];
  createdAt: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.invoiceIndex = +this.route.snapshot.paramMap.get('id')!;
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    if (invoices[this.invoiceIndex]) {
      this.invoiceData = invoices[this.invoiceIndex].data;
      this.createdAt = invoices[this.invoiceIndex].createdAt;
    }
  }

  save() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices[this.invoiceIndex] = {
      data: this.invoiceData,
      createdAt: this.createdAt
    };
    localStorage.setItem('invoices', JSON.stringify(invoices));
    alert('✅ Hóa đơn đã được cập nhật!');
    this.router.navigate(['/invoice-list']);
  }

  print() {
    window.print();
  }
}
