import ExcelJS from 'exceljs';

export interface ExcelData {
  [key: string]: any;
}

/**
 * 读取 Excel 文件并转换为 JSON 数据
 */
export async function readExcelFile(buffer: Buffer): Promise<ExcelData[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error('未找到工作表');
  }

  const data: ExcelData[] = [];
  const headers: string[] = [];

  // 获取表头
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = cell.value?.toString() || '';
  });

  // 读取数据行
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // 跳过表头
    
    const rowData: ExcelData = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        rowData[header] = cell.value;
      }
    });
    
    // 只添加非空行
    if (Object.keys(rowData).length > 0) {
      data.push(rowData);
    }
  });

  return data;
}

/**
 * 创建 Excel 文件
 */
export async function createExcelFile(data: ExcelData[], sheetName = 'Sheet1'): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (data.length === 0) {
    return Buffer.from('');
  }

  // 添加表头
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // 添加数据
  data.forEach(row => {
    const values = headers.map(header => row[header]);
    worksheet.addRow(values);
  });

  // 设置列宽
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // 设置表头样式
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * 将 JSON 数据转换为 Excel 格式的工作表
 */
export function jsonToSheet(data: ExcelData[]): ExcelJS.Worksheet {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (data.length === 0) {
    return worksheet;
  }

  // 添加表头
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // 添加数据
  data.forEach(row => {
    const values = headers.map(header => row[header]);
    worksheet.addRow(values);
  });

  return worksheet;
}
