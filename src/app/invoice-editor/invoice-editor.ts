import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { Company, CompanyService } from '../services/company.service';
import { InvoiceType } from '../services/invoice-type.service';

interface InvoiceTemplate {
  id: number;
  templateName: string | null;
  htmlContent: string;
  createdBy: string | null;
  createdAt: string | null;
}

interface TemplateOption {
  id: string;
  name: string;
  content: string;
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
  selectedTemplateId: string = 'template1';

  // Predefined templates
  templateOptions: TemplateOption[] = [
    {
      id: 'template1',
      name: 'Template Cơ bản',
      content: this.getBasicTemplate()
    },
    {
      id: 'template2', 
      name: 'Template Chuyên nghiệp',
      content: this.getProfessionalTemplate()
    },
    {
      id: 'template3',
      name: 'Template Hiện đại',
      content: this.getModernTemplate()
    }
  ];

  private readonly apiBaseUrl = 'http://localhost:8080/api/templates';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
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
    if (!this.isEditMode) {
      const selectedTemplate = this.templateOptions.find(t => t.id === this.selectedTemplateId);
      if (selectedTemplate) {
        this.loadContentToIframe(selectedTemplate.content);
      }
    }
  }

  // Template methods
  private getBasicTemplate(): string {
    return `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #333;">HÓA ĐƠN BÁN HÀNG</h1>
        
        <div id="companyInfo" style="margin: 20px 0;">
          <h3>Thông tin công ty:</h3>
          <p><strong>Tên công ty:</strong> <span class="company-name">[Chọn công ty]</span></p>
          <p><strong>Địa chỉ:</strong> <span class="company-address">[Địa chỉ công ty]</span></p>
          <p><strong>Điện thoại:</strong> <span class="company-phone">[Số điện thoại]</span></p>
          <p><strong>Email:</strong> <span class="company-email">[Email]</span></p>
          <p><strong>Mã số thuế:</strong> <span class="company-tax">[Mã số thuế]</span></p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Thông tin khách hàng:</h3>
          <p><strong>Tên khách hàng:</strong> [Nhập tên khách hàng]</p>
          <p><strong>Địa chỉ:</strong> [Nhập địa chỉ khách hàng]</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">STT</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Tên hàng hóa</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Số lượng</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Đơn giá</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Sản phẩm mẫu</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">100,000</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">100,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng:</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">100,000 VNĐ</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div style="text-align: center;">
            <p><strong>Người mua hàng</strong></p>
            <p style="margin-top: 60px;">(Ký, ghi rõ họ tên)</p>
          </div>
          <div style="text-align: center;">
            <p><strong>Người bán hàng</strong></p>
            <p style="margin-top: 60px;">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    `;
  }

  private getProfessionalTemplate(): string {
    return `
      <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff;">
        <div style="border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="text-align: center; color: #2c3e50; font-size: 28px; margin: 0;">HÓA ĐƠN BÁN HÀNG</h1>
          <p style="text-align: center; color: #7f8c8d; margin-top: 5px;">SALES INVOICE</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div id="companyInfo" style="flex: 1; margin-right: 20px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">THÔNG TIN CÔNG TY</h3>
            <p><strong>Công ty:</strong> <span class="company-name">[Chọn công ty]</span></p>
            <p><strong>Địa chỉ:</strong> <span class="company-address">[Địa chỉ công ty]</span></p>
            <p><strong>Điện thoại:</strong> <span class="company-phone">[Số điện thoại]</span></p>
            <p><strong>Email:</strong> <span class="company-email">[Email]</span></p>
            <p><strong>Mã số thuế:</strong> <span class="company-tax">[Mã số thuế]</span></p>
          </div>
          
          <div style="flex: 1;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 5px;">THÔNG TIN KHÁCH HÀNG</h3>
            <p><strong>Khách hàng:</strong> [Nhập tên khách hàng]</p>
            <p><strong>Địa chỉ:</strong> [Nhập địa chỉ khách hàng]</p>
            <p><strong>Điện thoại:</strong> [Số điện thoại KH]</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="border: none; padding: 15px; text-align: center;">STT</th>
              <th style="border: none; padding: 15px; text-align: left;">Tên hàng hóa</th>
              <th style="border: none; padding: 15px; text-align: center;">Số lượng</th>
              <th style="border: none; padding: 15px; text-align: right;">Đơn giá</th>
              <th style="border: none; padding: 15px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #f8f9fa;">
              <td style="border-bottom: 1px solid #dee2e6; padding: 12px; text-align: center;">1</td>
              <td style="border-bottom: 1px solid #dee2e6; padding: 12px;">Sản phẩm chuyên nghiệp</td>
              <td style="border-bottom: 1px solid #dee2e6; padding: 12px; text-align: center;">1</td>
              <td style="border-bottom: 1px solid #dee2e6; padding: 12px; text-align: right;">150,000</td>
              <td style="border-bottom: 1px solid #dee2e6; padding: 12px; text-align: right;">150,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background-color: #2c3e50; color: white; font-weight: bold; font-size: 16px;">
              <td colspan="4" style="border: none; padding: 15px; text-align: right;">TỔNG CỘNG:</td>
              <td style="border: none; padding: 15px; text-align: right;">150,000 VNĐ</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <p style="font-weight: bold; color: #2c3e50;">NGƯỜI MUA HÀNG</p>
            <p style="margin-top: 70px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
          </div>
          <div style="text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <p style="font-weight: bold; color: #2c3e50;">NGƯỜI BÁN HÀNG</p>
            <p style="margin-top: 70px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    `;
  }

  private getModernTemplate(): string {
    return `
      <div style="padding: 40px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 700; margin: 0;">HÓA ĐƠN BÁN HÀNG</h1>
            <div style="width: 100px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 10px auto; border-radius: 2px;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
            <div id="companyInfo" style="background: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #667eea;">
              <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; font-weight: 600;">🏢 THÔNG TIN CÔNG TY</h3>
              <div style="space-y: 8px;">
                <p style="margin: 8px 0;"><strong>Công ty:</strong> <span class="company-name">[Chọn công ty]</span></p>
                <p style="margin: 8px 0;"><strong>Địa chỉ:</strong> <span class="company-address">[Địa chỉ công ty]</span></p>
                <p style="margin: 8px 0;"><strong>Điện thoại:</strong> <span class="company-phone">[Số điện thoại]</span></p>
                <p style="margin: 8px 0;"><strong>Email:</strong> <span class="company-email">[Email]</span></p>
                <p style="margin: 8px 0;"><strong>Mã số thuế:</strong> <span class="company-tax">[Mã số thuế]</span></p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #764ba2;">
              <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; font-weight: 600;">👤 THÔNG TIN KHÁCH HÀNG</h3>
              <div style="space-y: 8px;">
                <p style="margin: 8px 0;"><strong>Khách hàng:</strong> [Nhập tên khách hàng]</p>
                <p style="margin: 8px 0;"><strong>Địa chỉ:</strong> [Nhập địa chỉ khách hàng]</p>
                <p style="margin: 8px 0;"><strong>Điện thoại:</strong> [Số điện thoại KH]</p>
              </div>
            </div>
          </div>

          <div style="background: #f8f9fa; border-radius: 10px; overflow: hidden; margin: 30px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                  <th style="padding: 20px; text-align: center; font-weight: 600;">STT</th>
                  <th style="padding: 20px; text-align: left; font-weight: 600;">Tên hàng hóa</th>
                  <th style="padding: 20px; text-align: center; font-weight: 600;">Số lượng</th>
                  <th style="padding: 20px; text-align: right; font-weight: 600;">Đơn giá</th>
                  <th style="padding: 20px; text-align: right; font-weight: 600;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: white; border-bottom: 1px solid #e0e6ed;">
                  <td style="padding: 15px; text-align: center;">1</td>
                  <td style="padding: 15px;">Sản phẩm hiện đại</td>
                  <td style="padding: 15px; text-align: center;">1</td>
                  <td style="padding: 15px; text-align: right;">200,000</td>
                  <td style="padding: 15px; text-align: right;">200,000</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white;">
                  <td colspan="4" style="padding: 20px; text-align: right; font-weight: 700; font-size: 16px;">TỔNG CỘNG:</td>
                  <td style="padding: 20px; text-align: right; font-weight: 700; font-size: 16px;">200,000 VNĐ</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px;">
            <div style="text-align: center; background: #f8f9fa; padding: 30px; border-radius: 10px; border: 2px dashed #667eea;">
              <p style="font-weight: 700; color: #2c3e50; font-size: 16px; margin-bottom: 20px;">👤 NGƯỜI MUA HÀNG</p>
              <div style="height: 80px;"></div>
              <p style="font-style: italic; color: #6c757d;">(Ký, ghi rõ họ tên)</p>
            </div>
            <div style="text-align: center; background: #f8f9fa; padding: 30px; border-radius: 10px; border: 2px dashed #764ba2;">
              <p style="font-weight: 700; color: #2c3e50; font-size: 16px; margin-bottom: 20px;">👔 NGƯỜI BÁN HÀNG</p>
              <div style="height: 80px;"></div>
              <p style="font-style: italic; color: #6c757d;">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Event handlers
  onTemplateChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedTemplateId = select.value;
    
    const selectedTemplate = this.templateOptions.find(t => t.id === this.selectedTemplateId);
    if (selectedTemplate) {
      this.loadContentToIframe(selectedTemplate.content);
      // Update company info if a company is selected
      if (this.selectedCompany) {
        setTimeout(() => this.updateCompanyInfo(), 100);
      }
    }
  }

  onInvoiceTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedInvoiceTypeId = select.value ? +select.value : null;
    
    if (this.selectedInvoiceTypeId) {
      this.selectedInvoiceTypeId = this.invoiceTypes.find(c => c.id === this.selectedCompanyId) || null;
      this.updateCompanyInfo();
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
      createdBy: 'current_user' // Thay thế bằng user thực tế
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