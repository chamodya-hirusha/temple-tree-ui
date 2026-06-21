"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileSpreadsheet, AlertCircle, CheckCircle, RefreshCw, HelpCircle, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock CSV Parsed Data
const MOCK_CSV_ROWS = [
  {
    rowNum: 1,
    title: "Premium Ceylon White Tea (Silver Tips)",
    sku: "TEA-SILV-TIPS",
    priceLKR: 36000,
    priceUSD: 120,
    stock: 45,
    weight: 0.25,
    dimensions: "15x15x8",
    hsCode: "0902.10.00"
  },
  {
    rowNum: 2,
    title: "Ayurvedic Sandalwood Soap Pack",
    sku: "AYU-SOAP-02",
    priceLKR: 5400,
    priceUSD: 18,
    stock: 120,
    weight: 0.5,
    dimensions: "12x8x6",
    hsCode: "" // Missing HS Code (Invalid)
  },
  {
    rowNum: 3,
    title: "Hand-Carved Mahogany Yaka Mask",
    sku: "CRT-MASK-03",
    priceLKR: 28500,
    priceUSD: 95,
    stock: 8,
    weight: 0, // Missing Weight (Invalid)
    dimensions: "25x20x10",
    hsCode: "4420.10.00"
  },
  {
    rowNum: 4,
    title: "Spiced Cinnamon Herbal Honey",
    sku: "SP-HNY-04",
    priceLKR: 9600,
    priceUSD: 32,
    stock: 85,
    weight: 0.4,
    dimensions: "10x10x15",
    hsCode: "0409.00.00"
  },
  {
    rowNum: 5,
    title: "Fine Woven Handloom Sarong",
    sku: "TEX-SRG-05",
    priceLKR: 12000,
    priceUSD: 40,
    stock: 50,
    weight: 0.35,
    dimensions: "20x15x4",
    hsCode: "6211.42.00"
  }
];

export default function BulkCSVImportPage() {
  const { addProduct } = useStore();
  const [importState, setImportState] = useState<"idle" | "processing" | "preview">("idle");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file format. Please upload a .csv spreadsheet.");
      return;
    }
    setFileName(file.name);
    setImportState("processing");

    // Simulate server processing times
    setTimeout(() => {
      setImportState("preview");
      toast.success("CSV parsed successfully! Check the preview tables below.");
    }, 1500);
  };

  const handleConfirmImport = () => {
    // Filter down to rows containing valid international e-commerce metrics
    const validRows = MOCK_CSV_ROWS.filter((r) => r.hsCode && r.weight > 0);
    
    // Add valid products to store provider context
    validRows.forEach((row) => {
      addProduct({
        id: `p-csv-${row.rowNum}-${Math.floor(100 + Math.random() * 900)}`,
        title: row.title,
        brand: "CSV Import",
        category: "Imported Products",
        price: row.priceUSD,
        priceLKR: row.priceLKR,
        comparePrice: Math.round(row.priceUSD * 1.25),
        rating: 5.0,
        reviews: 0,
        sold: 0,
        stock: row.stock,
        sku: row.sku,
        badge: "New",
        images: ["/assets/product-1.png"], // Placeholder
        description: `Imported via CSV: ${row.title}. Validated HS Code ${row.hsCode}.`,
        specs: [
          { label: "HS Code", value: row.hsCode },
          { label: "Weight", value: `${row.weight} kg` }
        ],
        weight: row.weight,
        dimensions: {
          length: Number(row.dimensions.split("x")[0]) || 10,
          width: Number(row.dimensions.split("x")[1]) || 10,
          height: Number(row.dimensions.split("x")[2]) || 10
        },
        hsCode: row.hsCode,
        volumetricWeight: row.weight * 0.9 // Simple volumetric estimation
      });
    });

    console.log("Imported product array:", validRows);
    toast.success(`Successfully imported ${validRows.length} valid products into the catalog! 🎉`);
    
    // Reset page back to initial upload state
    setImportState("idle");
    setFileName("");
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  // Check validation rules per row
  const getRowValidationError = (row: typeof MOCK_CSV_ROWS[0]) => {
    if (!row.hsCode) return "Missing HS Code";
    if (row.weight <= 0) return "Missing Weight";
    return null;
  };

  const validRowsCount = MOCK_CSV_ROWS.filter((r) => !getRowValidationError(r)).length;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand transition"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Bulk Product CSV Import</h1>
        <p className="text-sm text-muted-foreground">
          Import new products in bulk. Files must contain required columns: SKU, Weight, and HS code for international customs.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      {importState === "idle" && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className="rounded-3xl border-2 border-dashed border-border/80 bg-muted/10 hover:border-brand/40 transition duration-300 p-12 text-center cursor-pointer select-none space-y-4 shadow-sm"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
            <Upload className="text-brand-foreground" size={24} />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-foreground">Upload Products via CSV</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Drag and drop your spreadsheet here or click to browse. Supports .csv formats up to 10MB.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="#"
              onClick={(e) => {
                e.stopPropagation();
                toast.info("Downloading sample template... Aura_Product_Import_Template.csv");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold hover:underline"
            >
              <FileSpreadsheet size={13} /> Download Sample CSV Template
            </a>
          </div>
        </div>
      )}

      {/* Uploading/Processing Loader */}
      {importState === "processing" && (
        <div className="rounded-3xl bg-card border border-border p-12 text-center shadow-card space-y-4 flex flex-col items-center">
          <Loader2 className="animate-spin text-brand" size={40} />
          <div className="space-y-1">
            <div className="text-sm font-bold text-foreground">Parsing CSV File...</div>
            <p className="text-xs text-muted-foreground">
              Processing <span className="font-semibold text-foreground">{fileName}</span> and auditing international compliance columns.
            </p>
          </div>
          {/* Subtle Progress Bar */}
          <div className="h-1.5 w-64 rounded-full bg-muted overflow-hidden relative mt-2">
            <div className="absolute top-0 bottom-0 left-0 bg-brand animate-pulse w-1/2 h-full" />
          </div>
        </div>
      )}

      {/* Preview Table */}
      {importState === "preview" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-card space-y-4">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold">Import Data Preview</h3>
                <p className="text-xs text-muted-foreground">
                  File: <span className="font-semibold text-foreground">{fileName}</span> ({MOCK_CSV_ROWS.length} rows detected)
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setImportState("idle");
                    setFileName("");
                  }}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted transition"
                >
                  Cancel & Reset
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
                >
                  <CheckCircle size={14} /> Confirm and Import {validRowsCount} Products
                </button>
              </div>
            </div>

            {/* Validation warning block */}
            {validRowsCount < MOCK_CSV_ROWS.length && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 text-destructive p-4 text-xs border border-destructive/20">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Compliance Validation Errors Found</div>
                  <p className="mt-0.5 text-destructive/80">
                    {MOCK_CSV_ROWS.length - validRowsCount} rows are missing critical weight or HS code metrics required for international logistics. Invalid rows will be ignored on import.
                  </p>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/20">
                    <th className="p-3">Row</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-right">Price LKR</th>
                    <th className="p-3 text-right">Price USD</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Weight</th>
                    <th className="p-3 text-center">Dimensions</th>
                    <th className="p-3 text-center">HS Code</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {MOCK_CSV_ROWS.map((row) => {
                    const validationError = getRowValidationError(row);
                    return (
                      <tr
                        key={row.rowNum}
                        className={cn("hover:bg-muted/10 transition-all", validationError && "bg-destructive/5 hover:bg-destructive/10")}
                      >
                        <td className="p-3 text-muted-foreground font-semibold">{row.rowNum}</td>
                        <td className="p-3 font-bold text-foreground truncate max-w-[180px]">{row.title}</td>
                        <td className="p-3 font-mono font-medium">{row.sku}</td>
                        <td className="p-3 text-right tabular-nums text-muted-foreground">Rs. {row.priceLKR.toLocaleString()}</td>
                        <td className="p-3 text-right tabular-nums font-semibold">${row.priceUSD.toFixed(2)}</td>
                        <td className="p-3 text-center font-semibold tabular-nums">{row.stock}</td>
                        <td className="p-3 text-center tabular-nums">{row.weight > 0 ? `${row.weight} kg` : "—"}</td>
                        <td className="p-3 text-center font-mono text-[10px] text-muted-foreground">{row.dimensions}</td>
                        <td className="p-3 text-center font-mono font-semibold">{row.hsCode || "—"}</td>
                        <td className="p-3 text-right">
                          {validationError ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/15 text-destructive px-2.5 py-1 text-[9px] font-bold border border-destructive/20">
                              <AlertCircle size={9} /> {validationError}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 text-success px-2.5 py-1 text-[9px] font-bold border border-success/20">
                              Ready
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
          
          {/* Help Box */}
          <div className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            <HelpCircle size={10} /> Confused about customs parameters? Read our international shipping guidelines in the <Link href="/admin/settings" className="text-brand hover:underline font-semibold">Settings hub</Link>.
          </div>
        </div>
      )}

    </div>
  );
}
