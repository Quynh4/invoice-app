import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-detail.html',
  styleUrls: ['./invoice-detail.css']
})
export class InvoiceDetailComponent {
  invoice: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    this.invoice = invoices.find((i: any) => i.id === id);
  }

  print() {
    window.print();
  }

  editInvoice() {
    this.router.navigate(['/invoice-edit', this.invoice.id]);
  }
}
