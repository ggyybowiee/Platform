const URI = 'data:application/vnd.ms-excel;base64,';
const XLS_TEMPLATE = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta charset="UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

const toBase64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
const formatTemplateOf = templateStr => model =>
  templateStr.replace(/{(\w+)}/g, (match, placeholder) => model[placeholder]);
const formatXls = formatTemplateOf(XLS_TEMPLATE);

export const tableToXls = (tableEltOrSelector, workSheetName) => {
  const table = tableEltOrSelector.nodeType ? tableEltOrSelector : document.querySelector(tableEltOrSelector);
  const model = {
    worksheet: workSheetName || 'Worksheet',
    table: table.innerHTML,
  };
  return `${URI}${toBase64(formatXls(model))}`;
}

export const downloadTableAsXls = (tableEltOrSelector, workSheetName) => {
  const link = document.createElement('a');
  link.href = tableToXls(tableEltOrSelector, workSheetName);
  link.download = `${workSheetName}.xls`;
  link.click();
}
