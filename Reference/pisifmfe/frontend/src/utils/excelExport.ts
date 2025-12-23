// utils/excelExport.ts
import * as XLSX from "xlsx";

interface ExcelStyle {
  font?: {
    bold?: boolean;
    sz?: number;
    color?: { rgb: string };
    name?: string;
  };
  fill?: { fgColor: { rgb: string } };
  alignment?: { horizontal?: string; vertical?: string; wrapText?: boolean };
  border?: {
    top?: { style: string; color: { rgb: string } };
    bottom?: { style: string; color: { rgb: string } };
    left?: { style: string; color: { rgb: string } };
    right?: { style: string; color: { rgb: string } };
  };
  numFmt?: string;
}

export function createCorporateWorkbook(
  sheetName: string,
  headers: string[],
  data: any[][],
  title?: string
) {
  const wb = XLSX.utils.book_new();

  // Prepare data with title row if provided
  const wsData: any[][] = [];

  if (title) {
    wsData.push([title]);
    wsData.push([]); // Empty row
  }

  wsData.push(headers);
  wsData.push(...data);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = headers.map((h) => ({ wch: Math.max(h.length + 2, 12) }));
  ws["!cols"] = colWidths;

  // Apply corporate styling
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

  // Style title if exists
  if (title) {
    const titleCell = ws["A1"];
    if (titleCell) {
      titleCell.s = {
        font: { bold: true, sz: 16, color: { rgb: "0E4C92" }, name: "Calibri" },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
    // Merge title across all columns
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  }

  // Style header row
  const headerRow = title ? 2 : 0;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: C });
    if (!ws[cellAddress]) continue;

    ws[cellAddress].s = {
      font: { bold: true, sz: 11, color: { rgb: "FFFFFF" }, name: "Calibri" },
      fill: { fgColor: { rgb: "0E4C92" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Style data rows with alternating colors
  for (let R = headerRow + 1; R <= range.e.r; ++R) {
    const isEven = (R - headerRow - 1) % 2 === 0;
    const fillColor = isEven ? "F2F2F2" : "FFFFFF";

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      const cell = ws[cellAddress];
      const isNumeric = typeof cell.v === "number";

      cell.s = {
        font: { sz: 10, name: "Calibri" },
        fill: { fgColor: { rgb: fillColor } },
        alignment: {
          horizontal: isNumeric ? "right" : "left",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "D0D0D0" } },
          bottom: { style: "thin", color: { rgb: "D0D0D0" } },
          left: { style: "thin", color: { rgb: "D0D0D0" } },
          right: { style: "thin", color: { rgb: "D0D0D0" } },
        },
      };

      // Format numbers to 2 decimal places
      if (isNumeric && C > 2) {
        // Skip first few columns (usually text)
        cell.z = "#,##0.00";
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
}

export function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

export function createMultiSheetWorkbook(
  sheets: { name: string; headers: string[]; data: any[][]; title?: string }[]
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const wsData: any[][] = [];

    if (sheet.title) {
      wsData.push([sheet.title]);
      wsData.push([]);
    }

    wsData.push(sheet.headers);
    wsData.push(...sheet.data);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = sheet.headers.map((h) => ({
      wch: Math.max(h.length + 2, 12),
    }));
    ws["!cols"] = colWidths;

    // Apply styling
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

    if (sheet.title) {
      const titleCell = ws["A1"];
      if (titleCell) {
        titleCell.s = {
          font: {
            bold: true,
            sz: 16,
            color: { rgb: "0E4C92" },
            name: "Calibri",
          },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: sheet.headers.length - 1 } },
      ];
    }

    const headerRow = sheet.title ? 2 : 0;
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: C });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        font: { bold: true, sz: 11, color: { rgb: "FFFFFF" }, name: "Calibri" },
        fill: { fgColor: { rgb: "0E4C92" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    for (let R = headerRow + 1; R <= range.e.r; ++R) {
      const isEven = (R - headerRow - 1) % 2 === 0;
      const fillColor = isEven ? "F2F2F2" : "FFFFFF";

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;

        const cell = ws[cellAddress];
        const isNumeric = typeof cell.v === "number";

        cell.s = {
          font: { sz: 10, name: "Calibri" },
          fill: { fgColor: { rgb: fillColor } },
          alignment: {
            horizontal: isNumeric ? "right" : "left",
            vertical: "center",
          },
          border: {
            top: { style: "thin", color: { rgb: "D0D0D0" } },
            bottom: { style: "thin", color: { rgb: "D0D0D0" } },
            left: { style: "thin", color: { rgb: "D0D0D0" } },
            right: { style: "thin", color: { rgb: "D0D0D0" } },
          },
        };

        if (isNumeric && C > 2) {
          cell.z = "#,##0.00";
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  return wb;
}
