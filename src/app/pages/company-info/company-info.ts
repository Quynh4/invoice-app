import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [CompanyService],
  templateUrl: './company-info.html',
  styleUrls: ['./company-info.css']
})
export class CompanyInfoComponent implements OnInit {
  companies: Company[] = [];
  currentCompany: Company = {
    name: '',
    address: '',
    phone: '',
    email: '',
    taxCode: ''
  };
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Lỗi khi tải danh sách công ty';
        this.loading = false;
        console.error('Error loading companies:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.loading = true;
      this.clearMessages();

      if (this.isEditing && this.editingId) {
        this.companyService.updateCompany(this.editingId, this.currentCompany).subscribe({
          next: (updatedCompany) => {
            this.successMessage = 'Cập nhật thông tin công ty thành công!';
            this.loadCompanies();
            this.resetForm();
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Lỗi khi cập nhật thông tin công ty';
            this.loading = false;
            console.error('Error updating company:', error);
          }
        });
      } else {
        this.companyService.createCompany(this.currentCompany).subscribe({
          next: (newCompany) => {
            this.successMessage = 'Thêm công ty mới thành công!';
            this.loadCompanies();
            this.resetForm();
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Lỗi khi thêm công ty mới';
            this.loading = false;
            console.error('Error creating company:', error);
          }
        });
      }
    }
  }

  editCompany(company: Company): void {
    this.currentCompany = { ...company };
    this.isEditing = true;
    this.editingId = company.id || null;
    this.clearMessages();
  }

  deleteCompany(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa công ty này?')) {
      this.loading = true;
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.successMessage = 'Xóa công ty thành công!';
          this.loadCompanies();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Lỗi khi xóa công ty';
          this.loading = false;
          console.error('Error deleting company:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.currentCompany = {
      name: '',
      address: '',
      phone: '',
      email: '',
      taxCode: ''
    };
    this.isEditing = false;
    this.editingId = null;
  }

  isFormValid(): boolean {
    return this.currentCompany.name.trim() !== '' && 
           this.currentCompany.taxCode.trim() !== '';
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}