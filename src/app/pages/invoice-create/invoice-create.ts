import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-create.html',
  styleUrls: ['./invoice-create.css']
})

export class InvoiceCreateComponent {
  invoice = {
    company: {
      name: '',
      address: '',
      taxCode: '',
      phone: ''
    },
    customer: {
      name: '',
      address: '',
      phone: ''
    },
    items: [
      { description: '', quantity: 1, price: 0 }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const companyData = localStorage.getItem('company');
    if (companyData) {
      this.invoice.company = JSON.parse(companyData);
    }
  }

  addItem() {
    this.invoice.items.push({ description: '', quantity: 1, price: 0 });
  }

  removeItem(i: number) {
    this.invoice.items.splice(i, 1);
  }

  getTotal() {
    return this.invoice.items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  saveInvoice() {
    const invoiceToSave = {
      id: Date.now(),
      company: this.invoice.company,
      customer: this.invoice.customer,
      items: this.invoice.items,
      total: this.getTotal(),
      createdAt: new Date().toISOString()
    };

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.push(invoiceToSave);
    localStorage.setItem('invoices', JSON.stringify(invoices));

    alert('✅ Hóa đơn đã được lưu!');
    this.router.navigate(['/invoice-list']);
  }

}


