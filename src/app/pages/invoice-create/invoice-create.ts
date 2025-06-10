import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

interface HangHoa {
  stt: number;
  ten: string;
  dvt: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

interface FormData {
  donVi: string;
  maSoThue: string;
  diaChi: string;
  soTaiKhoan: string;
  dienThoai: string;
  tieuDe: string;
  ngayThang: string;
  tenNguoiMua: string;
  cccd: string;
  soHoChieu: string;
  maSoThueNguoiMua: string;
  hinhThucThanhToan: string;
  stkNguoiMua: string;
  hangHoa: HangHoa[];
  congTien: string;
  bangChu: string;
  nguoiMuaKy: string;
  thuTruongKy: string;
  phatHanh: string;
}

@Component({
  selector: 'app-iframe',
  templateUrl: './invoice-create.html',

  styles: [`
    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
    }
    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
    }
    .controls label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
    }
    .a4-iframe {
      width: 50%;
      height: 700px;
      border: 2px solid #ddd;
      display: block;
      margin: 0 auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class InvoiceCreateComponent implements AfterViewInit {
  @ViewChild('myIframe') iframeRef!: ElementRef;

  formData: FormData = {
    donVi: 'Công ty TNHH ABC',
    maSoThue: '0312345678',
    diaChi: '123 Lê Lợi, Q.1, TP.HCM',
    soTaiKhoan: '0123456789012',
    dienThoai: '0901234567',
    tieuDe: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
    ngayThang: '03/06/2025',
    tenNguoiMua: 'Nguyễn Văn A',
    cccd: '123456789012',
    soHoChieu: 'B12345678',
    maSoThueNguoiMua: '0405678910',
    hinhThucThanhToan: 'Chuyển khoản',
    stkNguoiMua: '0123456789999',
    hangHoa: [
      { stt: 1, ten: 'Laptop Dell XPS 13', dvt: 'Chiếc', soLuong: 2, donGia: 30000000, thanhTien: 60000000 }
    ],
    congTien: '60.000.000',
    bangChu: 'Sáu mươi triệu đồng',
    nguoiMuaKy: '',
    thuTruongKy: '',
    phatHanh: 'Công ty TNHH ABC'
  };

  watermarkDataUrl: string | null = null;
  watermarkSize: number = 200;
  watermarkOpacity: number = 0.3;

  ngAfterViewInit() {
    // Delay để đảm bảo view đã render xong
    setTimeout(() => {
      this.loadIframeContent();
    }, 100);
  }

  loadIframeContent() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;

    // Tạo content HTML
    const htmlContent = this.generateHTMLContent();

    // Load content vào iframe
    iframe.srcdoc = htmlContent;

    // Hoặc sử dụng cách khác:
    iframe.onload = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      // Setup event listeners cho editing
      // this.setupEditableFields(doc);
      this.setupColumnResize(doc);
    };
  }

  generateHTMLContent(): string {
    const rows = this.formData.hangHoa.map((item: HangHoa) => `
      <tr>
        <td>${item.stt}</td>
        <td contenteditable="true" data-key="ten">${item.ten}</td>
        <td contenteditable="true" data-key="dvt">${item.dvt}</td>
        <td contenteditable="true" data-key="soLuong">${item.soLuong.toLocaleString()}</td>
        <td contenteditable="true" data-key="donGia">${item.donGia.toLocaleString()}</td>
        <td contenteditable="true" data-key="thanhTien">${item.thanhTien.toLocaleString()}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
          #resizeLine {
              position: absolute;
              top: 0;
              bottom: 0;
              width: 2px;
              background: blue;
              display: none;
              z-index: 9999;
            }

            body { 
              font-family: 'Times New Roman', serif; 
              padding: 15px; 
              margin: 0;
              font-size: 12px;
              max-width: 100%;
              overflow-x: hidden;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              table-layout: fixed; 
              margin-bottom: 8px;
              font-size: 11px;
            }
            td, th {
              border: 1px solid #000;
              padding: 4px;
              vertical-align: top;
              position: relative;
              overflow: hidden;
              word-wrap: break-word;
            }
            .editable[contenteditable="true"] {
              background-color: #fefcc7;
            }
            .editable[contenteditable="true"]:hover {
              background-color: #fef9a7;
            }

            .resize-handle {
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 5px;
              cursor: col-resize;
              z-index: 10;
            }

            .resize-handle:hover {
              background: rgba(0,0,0,0.3);
            }
            h2, h4 { 
              text-align: center; 
              margin: 8px 0; 
              font-size: 14px;
            }
            h2 { font-size: 16px; }
            .field-label { 
              width: 25%; 
              font-weight: bold; 
              background-color: #f5f5f5;
            }
            .center { 
              text-align: center; 
            }
            #goodsTable th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
              font-size: 10px;
            }
            #goodsTable td:first-child {
              text-align: center;
              width: 5%;
            }
            #goodsTable td:nth-child(4),
            #goodsTable td:nth-child(5),
            #goodsTable td:nth-child(6) {
              text-align: right;
            }
            /* Watermark resize handles */
            .watermark-container {
              position: absolute;
              cursor: move;
            }
            .watermark-container:hover .resize-handles {
              opacity: 1;
            }
            .resize-handles {
              opacity: 0;
              transition: opacity 0.2s;
            }
            .resize-handle-corner, .resize-handle-edge {
              position: absolute;
              background: #007bff;
              border: 1px solid #fff;
            }
            .resize-handle-corner {
              width: 8px;
              height: 8px;
              border-radius: 50%;
            }
            .resize-handle-edge {
              background: rgba(0, 123, 255, 0.7);
            }
            /* Corner handles */
            .nw { top: -4px; left: -4px; cursor: nw-resize; }
            .ne { top: -4px; right: -4px; cursor: ne-resize; }
            .sw { bottom: -4px; left: -4px; cursor: sw-resize; }
            .se { bottom: -4px; right: -4px; cursor: se-resize; }
            /* Edge handles */
            .n { top: -2px; left: 8px; right: 8px; height: 4px; cursor: n-resize; }
            .s { bottom: -2px; left: 8px; right: 8px; height: 4px; cursor: s-resize; }
            .w { left: -2px; top: 8px; bottom: 8px; width: 4px; cursor: w-resize; }
            .e { right: -2px; top: 8px; bottom: 8px; width: 4px; cursor: e-resize; }
          </style>
        </head>
        <body>
          <h2>${this.formData.tieuDe}</h2>
          <h4>Ngày ${this.formData.ngayThang}</h4>

          <table>
            <tr><td class="field-label">Đơn vị bán hàng:</td><td contenteditable="true" class="editable" data-key="donVi">${this.formData.donVi}</td></tr>
            <tr><td class="field-label">Mã số thuế:</td><td contenteditable="true" class="editable" data-key="maSoThue">${this.formData.maSoThue}</td></tr>
            <tr><td class="field-label">Địa chỉ:</td><td contenteditable="true" class="editable" data-key="diaChi">${this.formData.diaChi}</td></tr>
            <tr><td class="field-label">Số tài khoản:</td><td contenteditable="true" class="editable" data-key="soTaiKhoan">${this.formData.soTaiKhoan}</td></tr>
            <tr><td class="field-label">Điện thoại:</td><td contenteditable="true" class="editable" data-key="dienThoai">${this.formData.dienThoai}</td></tr>
          </table>

          <table>
            <tr><td class="field-label">Tên người mua hàng:</td><td contenteditable="true" class="editable" data-key="tenNguoiMua">${this.formData.tenNguoiMua}</td></tr>
            <tr><td class="field-label">Căn cước công dân:</td><td contenteditable="true" class="editable" data-key="cccd">${this.formData.cccd}</td></tr>
            <tr><td class="field-label">Số hộ chiếu:</td><td contenteditable="true" class="editable" data-key="soHoChieu">${this.formData.soHoChieu}</td></tr>
            <tr><td class="field-label">Mã số thuế:</td><td contenteditable="true" class="editable" data-key="maSoThueNguoiMua">${this.formData.maSoThueNguoiMua}</td></tr>
            <tr><td class="field-label">Hình thức thanh toán:</td><td contenteditable="true" class="editable" data-key="hinhThucThanhToan">${this.formData.hinhThucThanhToan}</td></tr>
            <tr><td class="field-label">Số tài khoản:</td><td contenteditable="true" class="editable" data-key="stkNguoiMua">${this.formData.stkNguoiMua}</td></tr>
          </table>

          <table id="goodsTable">
            <thead>
              <tr>
                <td>STT<div class="resize-handle"></div></td>
                <td>Tên hàng hóa<div class="resize-handle"></div></td>
                <td>Đơn vị tính<div class="resize-handle"></div></td>
                <td>Số lượng<div class="resize-handle"></div></td>
                <td>Đơn giá<div class="resize-handle"></div></td>
                <td>Thành tiền<div class="resize-handle"></div></td>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
            <tfoot>
              <tr><td colspan="5" style="font-weight: bold;">Cộng tiền hàng:</td><td contenteditable="true" data-key="congTien" style="text-align: right; font-weight: bold;">${this.formData.congTien}</td></tr>
              <tr><td colspan="6">Số tiền viết bằng chữ: <span contenteditable="true" data-key="bangChu" style="font-style: italic;">${this.formData.bangChu}</span></td></tr>
            </tfoot>
          </table>

          <br/>
          <table>
            <tr>
              <td class="center" style="width: 50%;">
                <strong>Người mua hàng</strong><br/><br/><br/>
                <div contenteditable="true" class="editable" data-key="nguoiMuaKy">${this.formData.nguoiMuaKy}</div>
              </td>
              <td class="center" style="width: 50%;">
                <strong>Thủ trưởng đơn vị</strong><br/><br/><br/>
                <div contenteditable="true" class="editable" data-key="thuTruongKy">${this.formData.thuTruongKy}</div>
              </td>
            </tr>
          </table>

          <p style="text-align:right; margin-top: 20px;">
            Phát hành bởi: <span contenteditable="true" class="editable" data-key="phatHanh">${this.formData.phatHanh}</span>
          </p>

        <div id="resizeLine"></div>
        </body>
      </html>
    `;
  }
setupColumnResize(doc: Document) {
  const table = doc.getElementById('goodsTable');
  const resizeLine = doc.getElementById('resizeLine');
  if (!table || !resizeLine) return;

  const headers = table.querySelectorAll('th, td') as NodeListOf<HTMLElement>;
  headers.forEach(th => {
    if (!th.style.width) {
      th.style.width = `${th.offsetWidth}px`;
    }
  });

  const cols = table.querySelectorAll('th, td');

  let startX: number, col: HTMLElement | null, nextCol: HTMLElement | null;
  let startWidth: number, nextStartWidth: number;

  cols.forEach(th => {
    const handle = th.querySelector('.resize-handle') as HTMLElement;
    if (handle) {
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        col = th as HTMLElement;
        nextCol = th.nextElementSibling as HTMLElement;

        if (!nextCol) return; // bỏ qua nếu là cột cuối

        startX = e.pageX;
        startWidth = col.offsetWidth;
        nextStartWidth = nextCol.offsetWidth;

        const rect = col.getBoundingClientRect();
        resizeLine.style.left = `${rect.right + window.scrollX}px`;
        resizeLine.style.top = `${rect.top + window.scrollY}px`;
        resizeLine.style.height = `${table.offsetHeight}px`;
        resizeLine.style.display = 'block';

        doc.addEventListener('mousemove', onMouseMove);
        doc.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      });
    }
  });

  const onMouseMove = (e: MouseEvent) => {
    if (!col || !nextCol || !resizeLine) return;

    const delta = e.pageX - startX;
    const newWidth = startWidth + delta;
    const newNextWidth = nextStartWidth - delta;

    if (newWidth > 30 && newNextWidth > 30) {
      resizeLine.style.left = `${col.getBoundingClientRect().left + window.scrollX + newWidth}px`;
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!col || !nextCol || !resizeLine) return;

    const delta = e.pageX - startX;
    const newWidth = startWidth + delta;
    const newNextWidth = nextStartWidth - delta;

    if (newWidth > 30 && newNextWidth > 30) {
      col.style.width = `${newWidth}px`;
      nextCol.style.width = `${newNextWidth}px`;
    }

    resizeLine.style.display = 'none';
    doc.removeEventListener('mousemove', onMouseMove);
    doc.removeEventListener('mouseup', onMouseUp);
    col = null;
    nextCol = null;
  };
}



  // Watermark functions
  onWatermarkUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.watermarkDataUrl = reader.result as string;
      this.injectWatermark();
    };
    reader.readAsDataURL(file);
  }

  onSizeChange(event: Event) {
    this.watermarkSize = +(event.target as HTMLInputElement).value;
    this.updateWatermarkStyle();
  }

  onOpacityChange(event: Event) {
    this.watermarkOpacity = +(event.target as HTMLInputElement).value;
    this.updateWatermarkStyle();
  }

  injectWatermark() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !this.watermarkDataUrl) return;

    const existing = doc.getElementById('watermark-container');
    if (existing) existing.remove();

    // Create container for watermark with resize handles
    const container = doc.createElement('div');
    container.id = 'watermark-container';
    container.className = 'watermark-container';
    container.style.position = 'absolute';
    container.style.top = '50px';
    container.style.left = '50px';
    container.style.zIndex = '1000';
    container.style.userSelect = 'none';

    // Create watermark image
    const watermark = doc.createElement('img');
    watermark.src = this.watermarkDataUrl;
    watermark.id = 'watermark';
    watermark.style.width = '100%';
    watermark.style.height = 'auto';
    watermark.style.opacity = this.watermarkOpacity.toString();
    watermark.style.display = 'block';

    // Set container size
    container.style.width = this.watermarkSize + 'px';
    container.style.height = 'auto';

    // Create resize handles
    const resizeHandles = doc.createElement('div');
    resizeHandles.className = 'resize-handles';

    // Corner handles
    const corners = ['nw', 'ne', 'sw', 'se'];
    corners.forEach(corner => {
      const handle = doc.createElement('div');
      handle.className = `resize-handle-corner ${corner}`;
      resizeHandles.appendChild(handle);
    });

    // Edge handles
    const edges = ['n', 's', 'w', 'e'];
    edges.forEach(edge => {
      const handle = doc.createElement('div');
      handle.className = `resize-handle-edge ${edge}`;
      resizeHandles.appendChild(handle);
    });

    container.appendChild(watermark);
    container.appendChild(resizeHandles);

    // Dragging functionality
    let isDragging = false;
    let isResizing = false;
    let offsetX = 0, offsetY = 0;
    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;
    let resizeType = '';

    // Mouse down on container (for dragging)
    container.onmousedown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).className.includes('resize-handle')) {
        // Resizing
        isResizing = true;
        resizeType = (e.target as HTMLElement).className.split(' ').pop() || '';
        startX = e.clientX;
        startY = e.clientY;
        startWidth = container.offsetWidth;
        startHeight = container.offsetHeight;
      } else {
        // Dragging
        isDragging = true;
        const rect = container.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();
        offsetX = e.clientX - rect.left + iframeRect.left;
        offsetY = e.clientY - rect.top + iframeRect.top;
      }
      e.preventDefault();
    };

    // Mouse move
    doc.onmousemove = (e: MouseEvent) => {
      if (isDragging) {
        const iframeRect = iframe.getBoundingClientRect();
        container.style.left = (e.clientX - offsetX - iframeRect.left) + 'px';
        container.style.top = (e.clientY - offsetY - iframeRect.top) + 'px';
      } else if (isResizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        switch (resizeType) {
          case 'se': // Southeast
            newWidth = startWidth + deltaX;
            break;
          case 'sw': // Southwest
            newWidth = startWidth - deltaX;
            container.style.left = (parseInt(container.style.left) + deltaX) + 'px';
            break;
          case 'ne': // Northeast
            newWidth = startWidth + deltaX;
            container.style.top = (parseInt(container.style.top) + deltaY) + 'px';
            break;
          case 'nw': // Northwest
            newWidth = startWidth - deltaX;
            container.style.left = (parseInt(container.style.left) + deltaX) + 'px';
            container.style.top = (parseInt(container.style.top) + deltaY) + 'px';
            break;
          case 'e': // East
            newWidth = startWidth + deltaX;
            break;
          case 'w': // West
            newWidth = startWidth - deltaX;
            container.style.left = (parseInt(container.style.left) + deltaX) + 'px';
            break;
          case 'n': // North
            container.style.top = (parseInt(container.style.top) + deltaY) + 'px';
            break;
          case 's': // South
            // Height auto-adjusts for images
            break;
        }

        if (newWidth > 30) {
          container.style.width = newWidth + 'px';
          this.watermarkSize = newWidth;
        }
      }
    };

    // Mouse up
    doc.onmouseup = () => {
      isDragging = false;
      isResizing = false;
      resizeType = '';
    };

    doc.body.appendChild(container);
  }

  updateWatermarkStyle() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const container = doc.getElementById('watermark-container');
    const watermark = doc.getElementById('watermark') as HTMLImageElement;
    if (container && watermark) {
      container.style.width = this.watermarkSize + 'px';
      watermark.style.opacity = this.watermarkOpacity.toString();
    }
  }

  // Method để in hóa đơn
  printInvoice() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  }

  // Method để xuất PDF (cần thêm library như jsPDF)
  exportToPDF() {
    // Implementation cho xuất PDF
    console.log('Export to PDF functionality');
  }
}