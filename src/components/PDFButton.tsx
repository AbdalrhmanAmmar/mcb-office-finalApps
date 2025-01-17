import { FileDown } from "lucide-react";
import { Product } from "../types/product";
import { printProductsTable } from "../utils/pdfGenerator";
import { useContact } from "../context/ContactContext";

interface PDFButtonProps {
  products: Product[];
}

export function PDFButton({ products }: PDFButtonProps) {
  const { contactInfo } = useContact();

  return (
    <button
      onClick={() => printProductsTable(products, contactInfo)}
      className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      disabled={products.length === 0}
    >
      <FileDown className="w-4 h-4 mr-2" />
      Download PDF
    </button>
  );
}