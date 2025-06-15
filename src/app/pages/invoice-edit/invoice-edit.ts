// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { ActivatedRoute, Router } from '@angular/router';
// import { catchError, of } from 'rxjs';

// interface InvoiceTemplate {
//   id: number;
//   templateName: string | null;
//   htmlContent: string;
//   createdBy: string | null;
//   createdAt: string | null;
// }

// @Component({
//   selector: 'app-invoice-create',
//   templateUrl: './invoice-create.html',
//   styleUrls: ['./invoice-create.css']
// })
// export class InvoiceCreateComponent implements OnInit, AfterViewInit {
//   @ViewChild('myIframe', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;
  
//   isEditMode = false;
//   invoiceId: number | null = null;
//   invoiceData: InvoiceTemplate | null = null;
//   isLoading = false;
//   errorMessage = '';

//   // Watermark controls
//   watermarkSize = 200;
//   watermarkOpacity = 0.3;

//   private readonly apiBaseUrl = 'http://localhost:8080/api/templates';

//   constructor(
//     private http: HttpClient,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Check if we're in edit mode by looking for ID in route params
//     this.route.params.subscribe(params => {
//       if (params['id']) {
//         this.invoiceId = +params['id'];
//         this.isEditMode = true;
//         this.loadInvoiceData(this.invoiceId);
//       }
//     });

//     // Also check query params for ID
//     this.route.queryParams.subscribe(queryParams => {
//       if (queryParams['id'] && !this.invoiceId) {
//         this.invoiceId = +queryParams['id'];
//         this.isEditMode = true;
//         this.loadInvoiceData(this.invoiceId);
//       }
//     });
//   }

//   ngAfterViewInit(): void {
//     // Setup watermark controls after view init
//     this.setupWatermarkControls();
    
//     // If not in edit mode, setup default content
//     if (!this.isEditMode) {
//       this.setupDefaultContent();
//     }
//   }

//   private loadInvoiceData(id: number): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.http.get<InvoiceTemplate>(`${this.apiBaseUrl}/${id}`)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error('Error loading invoice:', error);
//           this.errorMessage = `Lỗi khi tải dữ liệu: ${error.status} - ${error.message}`;
//           this.isLoading = false;
//           return of(null);
//         })
//       )
//       .subscribe(data => {
//         this.isLoading = false;
//         if (data) {
//           this.invoiceData = data;
//           this.loadHtmlContentToIframe(data.htmlContent);
//         }
//       });
//   }

//   private loadHtmlContentToIframe(htmlContent: string): void {
//     if (!this.iframe?.nativeElement) {
//       // If iframe is not ready yet, try again after a short delay
//       setTimeout(() => this.loadHtmlContentToIframe(htmlContent), 100);
//       return;
//     }

//     const iframe = this.iframe.nativeElement;
    
//     // Create complete HTML document for iframe
//     const fullHtmlContent = `
//       <!DOCTYPE html>
//       <html lang="vi">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Invoice Content</title>
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             margin: 20px; 
//             background: white;
//             position: relative;
//           }
//           table { 
//             border-collapse: collapse; 
//             width: 100%; 
//             margin: 20px 0;
//           }
//           th, td { 
//             border: 1px solid #ddd; 
//             padding: 8px; 
//             text-align: left; 
//           }
//           th { 
//             background-color: #f2f2f2; 
//           }
//           .watermark {
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             z-index: 1000;
//             pointer-events: none;
//           }
//           .JCLRgrips {
//             position: absolute;
//             top: 0;
//             left: 0;
//             pointer-events: none;
//           }
//           .JCLRgrip {
//             width: 5px;
//             background: #007cba;
//             cursor: col-resize;
//             pointer-events: all;
//           }
//           .JColResizer {
//             width: 100%;
//             height: 100%;
//             background: rgba(0, 124, 186, 0.3);
//           }
//         </style>
//       </head>
//       <body>
//         ${htmlContent}
//       </body>
//       </html>
//     `;

//     // Write content to iframe
//     const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
//     if (iframeDoc) {
//       iframeDoc.open();
//       iframeDoc.write(fullHtmlContent);
//       iframeDoc.close();

//       // Setup resize functionality after content loads
//       iframe.onload = () => {
//         this.setupTableResize();
//       };
//     }
//   }

//   private setupDefaultContent(): void {
//     // Setup default content for create mode
//     const defaultContent = `
//       <div>
//         <h1>Hóa đơn mới</h1>
//         <p>Nhập nội dung hóa đơn tại đây...</p>
//         <table id="invoiceTable">
//           <thead>
//             <tr>
//               <th>Sản phẩm</th>
//               <th>Số lượng</th>
//               <th>Đơn giá</th>
//               <th>Thành tiền</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>Sản phẩm mẫu</td>
//               <td>1</td>
//               <td>100,000</td>
//               <td>100,000</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     `;
    
//     setTimeout(() => {
//       this.loadHtmlContentToIframe(defaultContent);
//     }, 100);
//   }

//   private setupWatermarkControls(): void {
//     // Setup size range control
//     const sizeRange = document.getElementById('sizeRange') as HTMLInputElement;
//     const sizeValue = document.getElementById('sizeValue');
    
//     if (sizeRange && sizeValue) {
//       sizeRange.addEventListener('input', (e) => {
//         const target = e.target as HTMLInputElement;
//         this.watermarkSize = +target.value;
//         sizeValue.textContent = `${this.watermarkSize}px`;
//         this.updateWatermark();
//       });
//     }

//     // Setup opacity range control
//     const opacityRange = document.getElementById('opacityRange') as HTMLInputElement;
//     const opacityValue = document.getElementById('opacityValue');
    
//     if (opacityRange && opacityValue) {
//       opacityRange.addEventListener('input', (e) => {
//         const target = e.target as HTMLInputElement;
//         this.watermarkOpacity = +target.value;
//         opacityValue.textContent = this.watermarkOpacity.toString();
//         this.updateWatermark();
//       });
//     }

//     // Setup watermark upload
//     const watermarkUpload = document.getElementById('watermarkUpload') as HTMLInputElement;
//     if (watermarkUpload) {
//       watermarkUpload.addEventListener('change', (e) => {
//         this.handleWatermarkUpload(e);
//       });
//     }

//     // Setup save button
//     const saveBtn = document.getElementById('saveBtn');
//     if (saveBtn) {
//       saveBtn.addEventListener('click', () => {
//         this.saveInvoice();
//       });
//     }
//   }

//   private handleWatermarkUpload(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
    
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const imageUrl = e.target?.result as string;
//         this.addWatermarkToIframe(imageUrl);
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   private addWatermarkToIframe(imageUrl: string): void {
//     if (!this.iframe?.nativeElement) return;

//     const iframeDoc = this.iframe.nativeElement.contentDocument;
//     if (!iframeDoc) return;

//     // Remove existing watermark
//     const existingWatermark = iframeDoc.querySelector('.watermark');
//     if (existingWatermark) {
//       existingWatermark.remove();
//     }

//     // Create new watermark
//     const watermark = iframeDoc.createElement('img');
//     watermark.src = imageUrl;
//     watermark.className = 'watermark';
//     watermark.style.width = `${this.watermarkSize}px`;
//     watermark.style.opacity = this.watermarkOpacity.toString();

//     iframeDoc.body.appendChild(watermark);
//   }

//   private updateWatermark(): void {
//     if (!this.iframe?.nativeElement) return;

//     const iframeDoc = this.iframe.nativeElement.contentDocument;
//     const watermark = iframeDoc?.querySelector('.watermark') as HTMLImageElement;
    
//     if (watermark) {
//       watermark.style.width = `${this.watermarkSize}px`;
//       watermark.style.opacity = this.watermarkOpacity.toString();
//     }
//   }

//   private setupTableResize(): void {
//     if (!this.iframe?.nativeElement?.contentWindow) return;

//     // Add table resize functionality to iframe content
//     const iframeWindow = this.iframe.nativeElement.contentWindow;
    
//     // This function will be called inside the iframe
//     const resizeScript = `
//       function createResizeOverlay(tableId) {
//         const table = document.getElementById(tableId);
//         if (!table) return;
        
//         const thead = table.querySelector("thead");
//         if (!thead) return;
        
//         const headerCells = thead.querySelectorAll("th");
        
//         const grips = document.createElement("div");
//         grips.className = "JCLRgrips";
//         grips.style.position = "relative";
//         grips.style.width = table.offsetWidth + "px";
//         grips.style.height = table.offsetHeight + "px";
        
//         headerCells.forEach((th, index) => {
//           const colLeft = th.offsetLeft + th.offsetWidth;
          
//           const grip = document.createElement("div");
//           grip.className = "JCLRgrip";
//           if (index === headerCells.length - 1) {
//             grip.classList.add("JCLRLastGrip");
//           }
          
//           grip.style.position = "absolute";
//           grip.style.left = colLeft + "px";
//           grip.style.height = table.offsetHeight + "px";
          
//           const resizer = document.createElement("div");
//           resizer.className = "JColResizer";
          
//           grip.appendChild(resizer);
//           grips.appendChild(grip);
//         });
        
//         table.parentNode.insertBefore(grips, table);
//       }
      
//       // Initialize resize overlay
//       setTimeout(() => {
//         createResizeOverlay("invoiceTable");
//       }, 100);
//     `;

//     // Execute the script in iframe context
//     const script = this.iframe.nativeElement.contentDocument?.createElement('script');
//     if (script) {
//       script.textContent = resizeScript;
//       this.iframe.nativeElement.contentDocument?.head.appendChild(script);
//     }
//   }

//   printInvoice(): void {
//     if (this.iframe?.nativeElement?.contentWindow) {
//       this.iframe.nativeElement.contentWindow.print();
//     }
//   }

//   resetWatermark(): void {
//     if (!this.iframe?.nativeElement) return;

//     const iframeDoc = this.iframe.nativeElement.contentDocument;
//     const watermark = iframeDoc?.querySelector('.watermark');
    
//     if (watermark) {
//       watermark.remove();
//     }
//   }

//   saveInvoice(): void {
//     if (!this.iframe?.nativeElement) {
//       this.errorMessage = 'Không thể lấy nội dung hóa đơn';
//       return;
//     }

//     const iframeDoc = this.iframe.nativeElement.contentDocument;
//     if (!iframeDoc) {
//       this.errorMessage = 'Không thể truy cập nội dung iframe';
//       return;
//     }

//     // Get HTML content from iframe body
//     const htmlContent = iframeDoc.body.innerHTML;
    
//     const payload = {
//       templateName: this.isEditMode ? this.invoiceData?.templateName : 'New Invoice',
//       htmlContent: htmlContent,
//       createdBy: 'current_user' // Replace with actual user
//     };

//     this.isLoading = true;
//     this.errorMessage = '';

//     const apiCall = this.isEditMode && this.invoiceId
//       ? this.http.put(`${this.apiBaseUrl}/${this.invoiceId}`, payload)
//       : this.http.post(this.apiBaseUrl, payload);

//     apiCall.pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Error saving invoice:', error);
//         this.errorMessage = `Lỗi khi lưu: ${error.status} - ${error.message}`;
//         this.isLoading = false;
//         return of(null);
//       })
//     ).subscribe(response => {
//       this.isLoading = false;
//       if (response) {
//         alert(this.isEditMode ? 'Cập nhật hóa đơn thành công!' : 'Tạo hóa đơn thành công!');
        
//         // If it was create mode, redirect to edit mode with the new ID
//         if (!this.isEditMode && (response as any).id) {
//           this.router.navigate(['/invoice-edit'], { 
//             queryParams: { id: (response as any).id } 
//           });
//         }
//       }
//     });
//   }
// }