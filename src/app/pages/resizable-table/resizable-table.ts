import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-resizable-table',
  standalone: true,
  templateUrl: './resizable-table.html',
  styleUrls: ['./resizable-table.css']
})
export class ResizableTableComponent implements AfterViewInit {
  @ViewChild('gripsContainer') gripsContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('table') tableRef!: ElementRef<HTMLTableElement>;

  ngAfterViewInit(): void {
    this.updateGrips();
    this.attachResizeListeners();
  }

  updateGrips() {
    const gripsContainer = this.gripsContainerRef.nativeElement;
    const table = this.tableRef.nativeElement;
    const headerCells = table.querySelectorAll('thead th') as NodeListOf<HTMLTableCellElement>;

    gripsContainer.innerHTML = '';
    gripsContainer.style.width = `${table.offsetWidth}px`;
    gripsContainer.style.height = `${table.offsetHeight}px`;

    let totalLeft = 0;

    headerCells.forEach((th, index) => {
      totalLeft += th.offsetWidth;
      if (index === headerCells.length - 1) return;

      const grip = document.createElement('div');
      grip.className = 'JCLRgrip';
      grip.style.left = `${totalLeft}px`;

      const resizer = document.createElement('div');
      resizer.className = 'JColResizer';
      grip.appendChild(resizer);

      gripsContainer.appendChild(grip);
    });
  }

  attachResizeListeners() {
    const grips = this.gripsContainerRef.nativeElement.querySelectorAll('.JCLRgrip') as NodeListOf<HTMLDivElement>;
    const table = this.tableRef.nativeElement;
    const headerCells = table.querySelectorAll('thead th') as NodeListOf<HTMLTableCellElement>;

    let isResizing = false;
    let startX = 0;
    let col1: HTMLElement | null = null;
    let col2: HTMLElement | null = null;

    grips.forEach((grip, index) => {
      const resizer = grip.querySelector('.JColResizer') as HTMLElement;
      if (!resizer || index >= headerCells.length - 1) return;

      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        startX = e.pageX;
        col1 = headerCells[index] as HTMLElement;
        col2 = headerCells[index + 1] as HTMLElement;
        document.body.style.cursor = 'col-resize';
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing || !col1 || !col2) return;

      const dx = e.pageX - startX;
      const col1Width = col1.offsetWidth + dx;
      const col2Width = col2.offsetWidth - dx;

      if (col1Width > 50 && col2Width > 50) {
        col1.style.width = `${col1Width}px`;
        col2.style.width = `${col2Width}px`;
        startX = e.pageX;
        this.updateGrips();
      }
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = '';
      col1 = col2 = null;
    });
  }
}
