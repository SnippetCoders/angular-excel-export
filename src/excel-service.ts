import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    public exportAsExcelFile(
        reportHeading: string,
        reportSubHeading: string,
        headersArray: any[],
        json: any[],
        footerData: any,
        excelFileName: string,
        sheetName: string
    ) {
        const header = headersArray;
        const data = json;

        /* Create workbook and worksheet */
        const workbook = new Workbook();
        workbook.creator = 'Snippet Coder';
        workbook.lastModifiedBy = 'SnippetCoder';
        workbook.created = new Date();
        workbook.modified = new Date();
        const worksheet = workbook.addWorksheet(sheetName);

        /* Add Header Row */
        worksheet.addRow([]);
        worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
        worksheet.getCell('A1').value = reportHeading;
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.getCell('A1').font = { size: 15, bold: true };

        if (reportSubHeading !== '') {
            worksheet.addRow([]);
            worksheet.mergeCells('A2:' + this.numToAlpha(header.length - 1) + '2');
            worksheet.getCell('A2').value = reportSubHeading;
            worksheet.getCell('A2').alignment = { horizontal: 'center' };
            worksheet.getCell('A2').font = { size: 12, bold: false };
        }

        worksheet.addRow([]);

        /* Add Header Row */
        const headerRow = worksheet.addRow(header);

        // Cell Style : Fill and Border
        headerRow.eachCell((cell, index) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.font = { size: 12, bold: true };

            worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
        });

        // Get all columns from JSON
        let columnsArray: any[];
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                columnsArray = Object.keys(json[key]);
            }
        }

        // Add Data and Conditional Formatting
        data.forEach((element: any) => {

            const eachRow = [];
            columnsArray.forEach((column) => {
                eachRow.push(element[column]);
            });

            if (element.isDeleted === 'Y') {
                const deletedRow = worksheet.addRow(eachRow);
                deletedRow.eachCell((cell) => {
                    cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
                });
            } else {
                worksheet.addRow(eachRow);
            }
        });

        worksheet.addRow([]);

        /*Footer Data Row*/
        if (footerData != null) {
            footerData.forEach((element: any) => {

                const eachRow = [];
                element.forEach((val: any) => {
                    eachRow.push(val);
                });

                const footerRow = worksheet.addRow(eachRow);
                footerRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });
            });
        }

        /*Save Excel File*/
        workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
            const blob = new Blob([data], { type: EXCEL_TYPE });
            fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
        });
    }

    private numToAlpha(num: number) {

        let alpha = '';

        for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
            alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
        }

        return alpha;
    }
}
