import { Routes } from '@angular/router';
import { BusinessInfoComponent } from './pages/business-info/business-info';
import { InvoiceTemplate } from './pages/invoice-template/invoice-template';
import { InvoiceCreateComponent } from './pages/invoice-create/invoice-create';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail';
// import { InvoiceEditComponent } from './pages/invoice-edit/invoice-edit';
// import { ResizableTableComponent } from './pages/resizable-table/resizable-table';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor';
import { CompanyInfoComponent } from './pages/company-info/company-info';

export const routes: Routes = [
  { path: '', redirectTo: 'company-info', pathMatch: 'full' },
  { path: 'business-info', component: BusinessInfoComponent },
  { path: 'invoice-template', component: InvoiceTemplate },
  { path: 'invoice-create', component: InvoiceCreateComponent },
  { path: 'invoice-list', component: InvoiceListComponent },
  { path: 'invoice-view/:id', component: InvoiceViewComponent },
  { path: 'company-info', component: CompanyInfoComponent },
  { path: 'invoice-detail/:id', component: InvoiceDetailComponent},
  // { path: 'invoice-edit/:id', component: InvoiceEditComponent },
  // { path: 'resizable-table', component: ResizableTableComponent },
  // Route cho tạo hóa đơn mới
  {
    path: 'invoice-editor',
    component: InvoiceEditorComponent,
    data: { title: 'Tạo hóa đơn mới' }
  },
  
  // Route cho chỉnh sửa hóa đơn với ID
  {
    path: 'invoice-editor/:id',
    component: InvoiceEditorComponent,
    data: { title: 'Chỉnh sửa hóa đơn' }
  },
  



];
