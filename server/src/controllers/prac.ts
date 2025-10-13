import * as pdfjsLib from "pdfjs-dist";
import fs from "fs";
import { Items } from "openai/resources/conversations.mjs";
import { PDFDocument, rgb } from "pdf-lib";
import path from "path";
import fontkit from "@pdf-lib/fontkit";

export const extractLayout = async () => {
  const dataBuffer = new Uint8Array(fs.readFileSync("Resume2.pdf"));
  //  console.log(dataBuffer);
  const loadTask = pdfjsLib.getDocument({ data: dataBuffer });

  const pdf = await loadTask.promise;
  // console.log("pdf:", pdf);

  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();

  // Extract layout data
  const layoutData = textContent.items.map((item: any) => ({
    text: item.str,
    x: item.transform[4],
    y: item.transform[5],
    width: item.width,
    height: item.height,
    font: item.fontName,
    size: Math.abs(item.transform[3]),
  }));
  console.log("layoutData:", layoutData);

  //Recreate
  const newPDF: any = await PDFDocument.create();
  const newPage = newPDF.addPage([page?.view[0], page.view[3]]);
  newPDF.registerFontkit(fontkit);

  // Recreate layout with new content
  const fontPath = path.resolve(__dirname, "../../fonts/NotoSans-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const unicodeFont = await newPDF.embedFont(fontBytes);
  //const font: any = await newPDF.embedFont(PDFDocument.Font.Helvetica);
  layoutData.forEach((item, index) => {
    newPage.drawText(`Replaced text ${index + 1}`, {
      x: item.x,
      y: item.y,
      size: item.size || 12,
      font: unicodeFont,
      color: rgb(0, 0, 0),
    });
  });
  // Save
  const newPdfBytes = await newPDF.save();
  fs.writeFileSync("updated_pdf.pdf", newPdfBytes);
};
