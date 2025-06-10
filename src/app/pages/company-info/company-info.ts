import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-info.html',
  styleUrls: ['./company-info.css']
})
export class CompanyInfoComponent {
  company = {
    name: '',
    address: '',
    taxId: '',
    phone: '',
    logoBase64: ''
  };

  ngOnInit() {
    const saved = localStorage.getItem('companyInfo');
    if (saved) {
      this.company = JSON.parse(saved);
    }
  }

  save() {
    localStorage.setItem('companyInfo', JSON.stringify(this.company));
    alert('✅ Đã lưu thông tin doanh nghiệp');
  }

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.company.logoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
