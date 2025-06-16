import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvoiceType {
  id?: number;
  typeName: string;
  htmlContent: string;
  createdBy: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceTypeService {
  private apiUrl = 'http://localhost:8080/api/types';

  constructor(private http: HttpClient) {}

  // Lấy tất cả hóa đơn
  getAllInvoiceTypes(): Observable<InvoiceType[]> {
    return this.http.get<InvoiceType[]>(this.apiUrl);
  }

  // Lấy hóa đơn theo ID
  getInvoiceTypeById(id: number): Observable<InvoiceType> {
    return this.http.get<InvoiceType>(`${this.apiUrl}/${id}`);
  }

}