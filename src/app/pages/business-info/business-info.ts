import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-info.html',
  styleUrls: ['./business-info.css']
})
export class BusinessInfoComponent {
  business = {
    name: '',
    address: '',
    taxCode: '',
    logoUrl: ''
  };

  ngOnInit(): void {
    const saved = localStorage.getItem('business');
    if (saved) {
      this.business = JSON.parse(saved);
    }
  }

  saveBusinessInfo() {
    localStorage.setItem('business', JSON.stringify(this.business));
    alert('Đã lưu thông tin doanh nghiệp!');
  }
}
