import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPDF(ref, filename = "reports.pdf") {
  const element = ref.current;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0);
  pdf.save(filename);
}
 