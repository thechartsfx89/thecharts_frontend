import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const downloadInvoice = async () => {
  const element = document.getElementById("invoice-root");
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("invoice.pdf");
};
export default downloadInvoice;