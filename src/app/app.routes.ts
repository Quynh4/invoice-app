import { Routes } from '@angular/router';
import { BusinessInfoComponent } from './pages/business-info/business-info';
import { InvoiceTemplate } from './pages/invoice-template/invoice-template';
import { InvoiceCreateComponent } from './pages/invoice-create/invoice-create';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view';
import { CompanyInfoComponent } from './pages/company-info/company-info';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail';
import { InvoiceEditComponent } from './pages/invoice-edit/invoice-edit';
import { ResizableTableComponent } from './resizable-table/resizable-table';

export const routes: Routes = [
  { path: '', redirectTo: 'business-info', pathMatch: 'full' },
  { path: 'business-info', component: BusinessInfoComponent },
  { path: 'invoice-template', component: InvoiceTemplate },
  { path: 'invoice-create', component: InvoiceCreateComponent },
  { path: 'invoice-list', component: InvoiceListComponent },
  { path: 'invoice-view/:id', component: InvoiceViewComponent },
  { path: 'company-info', component: CompanyInfoComponent },
  { path: 'invoice-detail/:id', component: InvoiceDetailComponent},
  { path: 'invoice-edit/:id', component: InvoiceEditComponent },
  { path: 'resizable-table', component: ResizableTableComponent }



];
