import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-edit.html',
  styleUrls: ['./invoice-edit.css']
})
export class InvoiceEditComponent {
  invoice: any = {
    customer: {},
    items: []
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const found = invoices.find((i: any) => i.id === id);
    if (found) this.invoice = found;
  }

  updateInvoice() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const index = invoices.findIndex((i: any) => i.id === this.invoice.id);
    if (index > -1) {
      invoices[index] = this.invoice;
      localStorage.setItem('invoices', JSON.stringify(invoices));
      alert('Cập nhật thành công!');
      this.router.navigate(['/invoice-list']);
    }
  }

  getTotal(): number {
    return this.invoice.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }
}
