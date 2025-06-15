import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService, InvoiceTemplate } from '../../services/invoice.service';
@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invoice-list.html',
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .filter-section {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      gap: 10px;
    }

    .search-box input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 200px;
    }

    .company-filter {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .company-filter select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-search {
      background-color: #17a2b8;
      color: white;
    }

    .btn-search:hover {
      background-color: #138496;
    }

    .btn-refresh {
      background-color: #6c757d;
      color: white;
    }

    .btn-refresh:hover {
      background-color: #545b62;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .invoice-table th,
    .invoice-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .invoice-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .invoice-table tr:hover {
      background-color: #f5f5f5;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-view {
      background-color: #28a745;
      color: white;
      font-size: 12px;
      padding: 6px 10px;
    }

    .btn-view:hover {
      background-color: #218838;
    }

    .btn-edit {
      background-color: #ffc107;
      color: #212529;
      font-size: 12px;
      padding: 6px 10px;
    }

    .btn-edit:hover {
      background-color: #e0a800;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
      font-size: 12px;
      padding: 6px 10px;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .no-data,
    .loading,
    .error-message {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .filter-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        flex-direction: column;
      }

      .search-box input {
        min-width: auto;
      }

      .invoice-table {
        font-size: 14px;
      }

      .actions {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: InvoiceTemplate[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedCompanyId = '';

  constructor(
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.loadAllInvoices();
  }

  loadAllInvoices() {
    this.loading = true;
    this.errorMessage = '';
    
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.errorMessage = 'Có lỗi xảy ra khi tải danh sách hóa đơn';
        this.loading = false;
      }
    });
  }

  filterByCompany() {
    if (this.selectedCompanyId) {
      this.loading = true;
      this.invoiceService.getInvoicesByCompany(Number(this.selectedCompanyId)).subscribe({
        next: (data) => {
          this.invoices = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering by company:', error);
          this.errorMessage = 'Có lỗi xảy ra khi lọc theo công ty';
          this.loading = false;
        }
      });
    } else {
      this.loadAllInvoices();
    }
  }

  searchInvoices() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      const companyId = this.selectedCompanyId ? Number(this.selectedCompanyId) : undefined;
      
      this.invoiceService.searchInvoices(this.searchTerm, companyId).subscribe({
        next: (data) => {
          this.invoices = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching invoices:', error);
          this.errorMessage = 'Có lỗi xảy ra khi tìm kiếm';
          this.loading = false;
        }
      });
    } else {
      this.filterByCompany(); // Nếu không có từ khóa, thực hiện filter theo company
    }
  }

  viewInvoice(id: number) {
    this.router.navigate(['/invoice-detail', id]);
  }

  editInvoice(id: number) {
    this.router.navigate(['/invoice-edit', id]);
  }

  deleteInvoice(id: number) {
    if (confirm('Bạn có chắc muốn xóa hóa đơn này?')) {
      this.loading = true;
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          this.loadAllInvoices(); // Reload danh sách sau khi xóa
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          this.errorMessage = 'Có lỗi xảy ra khi xóa hóa đơn';
          this.loading = false;
        }
      });
    }
  }

  createNewInvoice() {
    this.router.navigate(['/invoice-create']);
  }
}