import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/excel-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any[] = [];
  columns: any[];
  footerData: any[][] = [];
  totalSalesAmount = 0;

  constructor(public excelService: ExcelService) {

  }

  ngOnInit() {
    this.columns = ['Invoice ID', 'Invoice Date', 'Device Name', 'Amount'];
    this.data = [
      {
        InvoiceID : 'INV0001',
        DeviceName: 'Redmi Note 6 Pro',
        Date: '25-06-2020',
        Amount: 16000,
      }, {
        InvoiceID : 'INV0002',
        DeviceName: 'iPhone XR',
        Date: '25-06-2020',
        Amount: 19000,
      },
      {
        InvoiceID : 'INV0003',
        DeviceName: 'iPaid Mini 5',
        Date: '26-06-2020',
        Amount: 35000,
      },
      {
        InvoiceID : 'INV0004',
        DeviceName: 'Samsung S10',
        Date: '26-06-2020',
        Amount: 35000,
      }
    ];

    this.totalSalesAmount = this.data.reduce((sum, item) => sum + item.Amount, 0);
    this.footerData.push(['Total', '', '', this.totalSalesAmount]);
  }

  exportExcel() {
    this.excelService.exportAsExcelFile('Sales Report', '', this.columns, this.data, this.footerData, 'sales-report', 'Sheet1');
  }
}
