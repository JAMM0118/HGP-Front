import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  imports: [],
  template: `<p>data-table works!</p>`,
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable { }
