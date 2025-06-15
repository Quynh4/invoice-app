import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NgIf } from '@angular/common';

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
  imports: [NgIf],
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

  private readonly apiBaseUrl = 'http://localhost:8080/api/templates';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkModeAndLoadData();
  }

  ngAfterViewInit(): void {
    // Đợi một chút để DOM render xong
    setTimeout(() => {
      this.initializeIframeContent();
    }, 100);
  }

  private checkModeAndLoadData(): void {
    // Kiểm tra route params trước
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = +params['id'];
        this.isEditMode = true;
        this.loadInvoiceData(this.invoiceId);
        return;
      }
    });

    // Kiểm tra query params nếu không có route params
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
      // Tạo nội dung mặc định cho chế độ CREATE
      const defaultContent = this.getDefaultInvoiceContent();
      this.loadContentToIframe(defaultContent);
    }
  }

  private getDefaultInvoiceContent(): string {
    return `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #333;">HÓA ĐƠN BÁN HÀNG</h1>
        
        <div style="margin: 20px 0;">
          <h3>Thông tin công ty:</h3>
          <p><strong>Tên công ty:</strong> [Nhập tên công ty]</p>
          <p><strong>Địa chỉ:</strong> [Nhập địa chỉ]</p>
          <p><strong>Điện thoại:</strong> [Nhập số điện thoại]</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Thông tin khách hàng:</h3>
          <p><strong>Tên khách hàng:</strong> [Nhập tên khách hàng]</p>
          <p><strong>Địa chỉ:</strong> [Nhập địa chỉ khách hàng]</p>
        </div>

        <table id="invoiceTable" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
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
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Sản phẩm mẫu 2</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">50,000</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">100,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng:</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">200,000 VNĐ</td>
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

      // Setup các chức năng sau khi load xong
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
    // Setup table resize nếu cần
    this.setupTableResize();
  }

  private setupTableResize(): void {
    // Implement table resize functionality if needed
    console.log('Table resize setup');
  }

  // Public methods for template
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

    // Remove existing watermark
    const existingWatermark = iframeDoc.querySelector('.watermark');
    if (existingWatermark) {
      existingWatermark.remove();
    }

    // Create new watermark
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