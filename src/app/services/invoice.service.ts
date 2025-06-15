import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvoiceTemplate {
  id?: number;
  templateName: string;
  htmlContent: string;
  createdBy: string;
  createdAt: string;
  companyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/api/templates';

  constructor(private http: HttpClient) {}

  // Lấy tất cả hóa đơn
  getAllInvoices(): Observable<InvoiceTemplate[]> {
    return this.http.get<InvoiceTemplate[]>(this.apiUrl);
  }

  // Lấy hóa đơn theo companyId
  getInvoicesByCompany(companyId: number): Observable<InvoiceTemplate[]> {
    return this.http.get<InvoiceTemplate[]>(`${this.apiUrl}/company/${companyId}`);
  }

  // Lấy hóa đơn theo ID
  getInvoiceById(id: number): Observable<InvoiceTemplate> {
    return this.http.get<InvoiceTemplate>(`${this.apiUrl}/${id}`);
  }

  // Tạo hóa đơn mới
  createInvoice(invoice: InvoiceTemplate): Observable<InvoiceTemplate> {
    return this.http.post<InvoiceTemplate>(this.apiUrl, invoice);
  }

  // Cập nhật hóa đơn
  updateInvoice(id: number, invoice: InvoiceTemplate): Observable<InvoiceTemplate> {
    return this.http.put<InvoiceTemplate>(`${this.apiUrl}/${id}`, invoice);
  }

  // Xóa hóa đơn
  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Tìm kiếm hóa đơn
  searchInvoices(templateName: string, companyId?: number): Observable<InvoiceTemplate[]> {
    let params = new HttpParams().set('templateName', templateName);
    if (companyId) {
      params = params.set('companyId', companyId.toString());
    }
    return this.http.get<InvoiceTemplate[]>(`${this.apiUrl}/search`, { params });
  }
}