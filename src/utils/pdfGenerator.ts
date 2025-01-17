import { Product } from "../types/product";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function printProductsTable(products: Product[], contactInfo: any) {
  generatePDF(products, contactInfo);
}

export function printSingleProduct(product: Product, contactInfo: any) {
  generatePDF([product], contactInfo);
}

function generatePDF(products: Product[], contactInfo: any) {
  // Convert the logo to base64
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const base64Logo = canvas.toDataURL('image/jpeg');
    
    const content = document.createElement("div");
    content.style.position = "absolute";
    content.style.left = "-9999px";
    content.style.width = "1200px";
    content.style.padding = "20px";
    content.style.backgroundColor = "white";
    content.style.color = "black";
    content.style.fontFamily = "Arial, sans-serif";

    content.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Company Header -->
        <div style="background-color: #0d9488; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px;">
            <img src="${base64Logo}" alt="MCB Logo" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid white;" />
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">MCB OFFICE</h1>
              <p style="margin: 5px 0 0 0; color: #99f6e4;">For general trade from China to Mauritania and the import of all goods</p>
            </div>
          </div>
        </div>

        <!-- Company Information -->
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div>
              <p style="margin: 0 0 10px 0;"><strong>Location:</strong> Friendship Bridge (Carrefour Madrid)</p>
              <p style="margin: 0;"><strong>Email:</strong> ${contactInfo.email}</p>
            </div>
            <div>
              <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${contactInfo.phone1} / ${contactInfo.phone2}</p>
              <p style="margin: 0;"><strong>WhatsApp:</strong> ${contactInfo.whatsapp1} / ${contactInfo.whatsapp2}</p>
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead style="background-color: #f3f4f6;">
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Customer</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Phone</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Image</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Product Name</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Quantity</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Price</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Shipping</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Duration</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.customerName}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.phoneNumber}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    ${
                      product.image && product.image.startsWith("data:image")
                        ? `<img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />`
                        : ""
                    }
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.name}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.quantity}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.price.toFixed(2)} ${product.currency}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.shippingType === 'air' ? 'Aerial' : 'Marine'}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.shippingDuration}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4f46e5;">
                    ${(product.quantity * product.price).toFixed(2)} ${product.currency}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Total Amount -->
        <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: right;">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">
            Total Amount: ${products
              .reduce((sum, product) => sum + product.quantity * product.price, 0)
              .toFixed(2)} ${products[0]?.currency || 'USD'}
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      imageTimeout: 0,
      scale: 2
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pageWidth = 297;
      const pageHeight = 210;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("products.pdf");

      document.body.removeChild(content);
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { 
                  margin: 2cm;
                  size: landscape;
                }
              }
              ${content.innerHTML.match(/<style>(.*?)<\/style>/s)?.[1] || ''}
            </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  img.src = '/logo.jpg';
}