import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { Company, CompanyService } from '../services/company.service';
import { InvoiceType, InvoiceTypeService } from '../services/invoice-type.service';
interface InvoiceTemplate {
  id: number;
  templateName: string | null;
  htmlContent: string;
  createdBy: string | null;
  createdAt: string | null;
}

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.html',
  imports: [NgIf, NgFor],
  standalone: true,
  styleUrls: ['./invoice-editor.css']
})
export class InvoiceEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('invoiceIframe', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;
  
  // Component state
  isEditMode = false;
  invoiceId: number | null = null;
  invoiceData: InvoiceTemplate | null = null;
  isLoading = false;
  errorMessage = '';

  // Watermark settings
  watermarkSize = 200;
  watermarkOpacity = 0.3;
  watermarkImageUrl = '';

  // Template and Company data
  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  selectedCompany: Company | null = null;
  invoiceTypes: InvoiceType[] = [];
  selectedInvoiceTypeId: number | null = null;
  selectedInvoiceType: InvoiceType | null = null;

  private readonly apiBaseUrl = 'http://localhost:8080/api/templates';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private invoiceTypeService: InvoiceTypeService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadInvoiceTypes();
    this.checkModeAndLoadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeIframeContent();
    }, 100);
  }

  private loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
      }
    });
  }

  private loadInvoiceTypes(): void {
    this.invoiceTypeService.getAllInvoiceTypes().subscribe({
      next: (invoiceTypes) => {
        this.invoiceTypes = invoiceTypes;
      },
      error: (error) => {
        console.error('Error loading invoice types:', error);
      }
    });
  }

  private checkModeAndLoadData(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = +params['id'];
        this.isEditMode = true;
        this.loadInvoiceData(this.invoiceId);
        return;
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['id'] && !this.invoiceId) {
        this.invoiceId = +queryParams['id'];
        this.isEditMode = true;
        this.loadInvoiceData(this.invoiceId);
      }
    });
  }

  private loadInvoiceData(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<InvoiceTemplate>(`${this.apiBaseUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading invoice:', error);
          this.errorMessage = `Lỗi khi tải dữ liệu: ${error.status} - ${error.message}`;
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(data => {
        this.isLoading = false;
        if (data) {
          this.invoiceData = data;
          this.loadContentToIframe(data.htmlContent);
        }
      });
  }

  private initializeIframeContent(): void {
    if (!this.isEditMode && this.selectedInvoiceType) {
      this.loadContentToIframe(this.selectedInvoiceType.htmlContent);
    } else if (!this.isEditMode && this.invoiceTypes.length > 0) {
      // Load first invoice type as default if no type is selected
      this.selectedInvoiceTypeId = this.invoiceTypes[0].id? this.invoiceTypes[0].id : null;
      this.selectedInvoiceType = this.invoiceTypes[0];
      this.loadContentToIframe(this.selectedInvoiceType.htmlContent);
    }
  }

  // Event handlers
  onInvoiceTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedInvoiceTypeId = select.value ? +select.value : null;
    
    if (this.selectedInvoiceTypeId) {
      this.selectedInvoiceType = this.invoiceTypes.find(t => t.id === this.selectedInvoiceTypeId) || null;
      
      if (this.selectedInvoiceType) {
        this.loadContentToIframe(this.selectedInvoiceType.htmlContent);
        // Update company info if a company is selected
        if (this.selectedCompany) {
          setTimeout(() => this.updateCompanyInfo(), 100);
        }
      }
    } else {
      this.selectedInvoiceType = null;
    }
  }

  onCompanyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCompanyId = select.value ? +select.value : null;
    
    if (this.selectedCompanyId) {
      this.selectedCompany = this.companies.find(c => c.id === this.selectedCompanyId) || null;
      this.updateCompanyInfo();
    } else {
      this.selectedCompany = null;
      this.clearCompanyInfo();
    }
  }

  private updateCompanyInfo(): void {
    if (!this.iframe?.nativeElement || !this.selectedCompany) return;

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    if (!iframeDoc) return;

    // Update company information in the iframe
    const companyName = iframeDoc.querySelector('.company-name');
    const companyAddress = iframeDoc.querySelector('.company-address');
    const companyPhone = iframeDoc.querySelector('.company-phone');
    const companyEmail = iframeDoc.querySelector('.company-email');
    const companyTax = iframeDoc.querySelector('.company-tax');

    if (companyName) companyName.textContent = this.selectedCompany.name;
    if (companyAddress) companyAddress.textContent = this.selectedCompany.address;
    if (companyPhone) companyPhone.textContent = this.selectedCompany.phone;
    if (companyEmail) companyEmail.textContent = this.selectedCompany.email;
    if (companyTax) companyTax.textContent = this.selectedCompany.taxCode;
  }

  private clearCompanyInfo(): void {
    if (!this.iframe?.nativeElement) return;

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    if (!iframeDoc) return;

    const companyName = iframeDoc.querySelector('.company-name');
    const companyAddress = iframeDoc.querySelector('.company-address');
    const companyPhone = iframeDoc.querySelector('.company-phone');
    const companyEmail = iframeDoc.querySelector('.company-email');
    const companyTax = iframeDoc.querySelector('.company-tax');

    if (companyName) companyName.textContent = '[Chọn công ty]';
    if (companyAddress) companyAddress.textContent = '[Địa chỉ công ty]';
    if (companyPhone) companyPhone.textContent = '[Số điện thoại]';
    if (companyEmail) companyEmail.textContent = '[Email]';
    if (companyTax) companyTax.textContent = '[Mã số thuế]';
  }

  private loadContentToIframe(htmlContent: string): void {
    if (!this.iframe?.nativeElement) {
      setTimeout(() => this.loadContentToIframe(htmlContent), 100);
      return;
    }

    const iframe = this.iframe.nativeElement;
    const fullHtmlContent = this.createFullHtmlDocument(htmlContent);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHtmlContent);
      iframeDoc.close();

      iframe.onload = () => {
        this.setupIframeFeatures();
      };
    }
  }

  private createFullHtmlDocument(htmlContent: string): string {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Content</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background: white;
            position: relative;
            min-height: 100vh;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 20px 0;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
            opacity: 0.3;
          }
          @media print {
            body { margin: 0; }
            .watermark { opacity: 0.1; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }

  private setupIframeFeatures(): void {
    this.setupTableResize();
  }

  private setupTableResize(): void {
    console.log('Table resize setup');
  }

  // Watermark methods
  onWatermarkUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.watermarkImageUrl = e.target?.result as string;
        this.addWatermarkToIframe();
      };
      reader.readAsDataURL(file);
    }
  }

  onSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.watermarkSize = +input.value;
    this.updateWatermark();
  }

  onOpacityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.watermarkOpacity = +input.value;
    this.updateWatermark();
  }

  private addWatermarkToIframe(): void {
    if (!this.iframe?.nativeElement || !this.watermarkImageUrl) return;

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    if (!iframeDoc) return;

    const existingWatermark = iframeDoc.querySelector('.watermark');
    if (existingWatermark) {
      existingWatermark.remove();
    }

    const watermark = iframeDoc.createElement('img');
    watermark.src = this.watermarkImageUrl;
    watermark.className = 'watermark';
    watermark.style.width = `${this.watermarkSize}px`;
    watermark.style.opacity = this.watermarkOpacity.toString();

    iframeDoc.body.appendChild(watermark);
  }

  private updateWatermark(): void {
    if (!this.iframe?.nativeElement) return;

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    const watermark = iframeDoc?.querySelector('.watermark') as HTMLImageElement;
    
    if (watermark) {
      watermark.style.width = `${this.watermarkSize}px`;
      watermark.style.opacity = this.watermarkOpacity.toString();
    }
  }

  printInvoice(): void {
    if (this.iframe?.nativeElement?.contentWindow) {
      this.iframe.nativeElement.contentWindow.print();
    }
  }

  resetWatermark(): void {
    if (!this.iframe?.nativeElement) return;

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    const watermark = iframeDoc?.querySelector('.watermark');
    
    if (watermark) {
      watermark.remove();
    }
    
    this.watermarkImageUrl = '';
  }

  saveInvoice(): void {
    if (!this.iframe?.nativeElement) {
      this.errorMessage = 'Không thể lấy nội dung hóa đơn';
      return;
    }

    const iframeDoc = this.iframe.nativeElement.contentDocument;
    if (!iframeDoc) {
      this.errorMessage = 'Không thể truy cập nội dung iframe';
      return;
    }

    // Lấy HTML content từ iframe body
    const htmlContent = iframeDoc.body.innerHTML;
    
    const payload = {
      templateName: this.isEditMode ? 
        (this.invoiceData?.templateName || 'Updated Invoice') : 
        'New Invoice',
      htmlContent: htmlContent,
      createdBy: 'current_user', // Thay thế bằng user thực tế
      invoiceTypeId: this.selectedInvoiceTypeId, // Thêm invoice type ID
      companyId: this.selectedCompanyId // Thêm company ID
    };

    this.isLoading = true;
    this.errorMessage = '';

    // Chọn API call dựa trên mode
    const apiCall = this.isEditMode && this.invoiceId
      ? this.http.put(`${this.apiBaseUrl}/${this.invoiceId}`, payload)
      : this.http.post(this.apiBaseUrl, payload);

    apiCall.pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving invoice:', error);
        this.errorMessage = `Lỗi khi lưu: ${error.status} - ${error.message}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      this.isLoading = false;
      if (response) {
        const message = this.isEditMode ? 
          'Cập nhật hóa đơn thành công!' : 
          'Tạo hóa đơn thành công!';
        
        alert(message);
        
        // Nếu là chế độ create, chuyển sang edit mode với ID mới
        if (!this.isEditMode && (response as any).id) {
          this.router.navigate(['/invoice-editor', (response as any).id]);
        }
      }
    });
  }

  // Getter cho template
  get pageTitle(): string {
    return this.isEditMode ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới';
  }

  get saveButtonText(): string {
    return this.isEditMode ? '💾 Cập nhật hóa đơn' : '💾 Lưu hóa đơn';
  }
}