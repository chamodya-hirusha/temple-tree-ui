"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, UploadCloud, Info, Trash2, Check, Stars, ChevronDown
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductFormProps = {
  product?: Product | null;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Ceylon Tea");
  const [sku, setSku] = useState("");
  const [priceLKR, setPriceLKR] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [hsCode, setHsCode] = useState("");

  // SEO Fields
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Advanced Multiple Image Gallery State
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [flashSale, setFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState("");

  const [dragActive, setDragActive] = useState(false);

  // Fill in states if editing
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setCategory(product.category);
      setSku(product.sku);
      setPriceLKR(String(product.priceLKR));
      setPriceUSD(String(product.price));
      setStock(String(product.stock));
      setWeight(String(product.weight));
      setLength(String(product.dimensions.length));
      setWidth(String(product.dimensions.width));
      setHeight(String(product.dimensions.height));
      setHsCode(product.hsCode);
      setFlashSale(!!product.flashSale);
      setFlashSalePrice(product.flashSalePrice ? String(product.flashSalePrice) : "");

      const prodImages = product.images && product.images.length > 0 ? product.images : ["/assets/product-1.png"];
      setImages(prodImages);
      setCoverImage(prodImages[0]);
      setSlug(product.sku.toLowerCase() + "-" + product.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
      setMetaDescription(product.description.slice(0, 150));
      setMetaKeywords(product.category + ", organic, ceylon, export");
    } else {
      // Setup default mock values for a new product
      setTitle("");
      setSlug("");
      setDescription("");
      setCategory("Ceylon Tea");
      setSku("");
      setPriceLKR("");
      setPriceUSD("");
      setStock("");
      setWeight("");
      setLength("");
      setWidth("");
      setHeight("");
      setHsCode("");
      setImages(["/assets/product-1.png"]);
      setCoverImage("/assets/product-1.png");
      setMetaDescription("");
      setMetaKeywords("");
    }
  }, [product]);

  // Generate URL slug from title in real-time
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
      .replace(/\s+/g, "-")         // replace spaces with hyphens
      .replace(/-+/g, "-")          // merge consecutive hyphens
      .trim();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(generateSlug(val));
  };

  // Volumetric Weight Calculation
  const lVal = parseFloat(length) || 0;
  const wVal = parseFloat(width) || 0;
  const hVal = parseFloat(height) || 0;
  const volumetricWeight = ((lVal * wVal * hVal) / 5000).toFixed(3);

  // Numeric checks
  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setter(cleaned);
  };

  const handleIntegerInput = (val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setter(cleaned);
  };

  // Gallery handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropMultiple = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newFiles]);
      if (!coverImage || coverImage === "/assets/product-1.png") {
        setCoverImage(newFiles[0]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newFiles]);
      if (!coverImage || coverImage === "/assets/product-1.png") {
        setCoverImage(newFiles[0]);
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById("image-file-input")?.click();
  };

  const handleToggleSelectImage = (imgSrc: string) => {
    setSelectedImages(prev =>
      prev.includes(imgSrc) ? prev.filter(x => x !== imgSrc) : [...prev, imgSrc]
    );
  };

  const handleSelectAllImages = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages([...images]);
    }
  };

  const handleDeleteSelectedImages = () => {
    const remaining = images.filter(img => !selectedImages.includes(img));
    setImages(remaining);
    setSelectedImages([]);
    if (selectedImages.includes(coverImage)) {
      setCoverImage(remaining[0] || "/assets/product-1.png");
    }
  };

  const handleClose = () => {
    router.push("/admin/products");
  };

  // Validation checkers per step
  const isStep1Valid = title.trim() !== "" && description.trim() !== "" && slug.trim() !== "";
  const isStep2Valid =
    priceLKR.trim() !== "" &&
    priceUSD.trim() !== "" &&
    sku.trim() !== "" &&
    stock.trim() !== "" &&
    (!flashSale ||
      (flashSalePrice.trim() !== "" &&
        !isNaN(Number(flashSalePrice)) &&
        Number(flashSalePrice) > 0 &&
        Number(flashSalePrice) < (Number(priceUSD) || Infinity)));
  const isStep3Valid = weight.trim() !== "" && length.trim() !== "" && width.trim() !== "" && height.trim() !== "" && hsCode.trim() !== "";

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      alert("Please ensure all fields are filled out correctly.");
      return;
    }

    // Rearrange images so cover photo is always first
    const activeImages = images.length > 0
      ? (images.includes(coverImage) ? [coverImage, ...images.filter(x => x !== coverImage)] : images)
      : ["/assets/product-1.png"];

    const payload = {
      title,
      description,
      category,
      sku,
      priceLKR: Number(priceLKR),
      priceUSD: Number(priceUSD),
      stock: Number(stock),
      weight: Number(weight),
      dimensions: {
        length: Number(length),
        width: Number(width),
        height: Number(height),
      },
      hsCode,
      volumetricWeight: Number(volumetricWeight),
      images: activeImages,
      flashSale,
      flashSalePrice: flashSale ? Number(flashSalePrice) : undefined,
      seo: {
        slug,
        metaDescription,
        metaKeywords,
      }
    };

    console.log("Payload for Backend:", payload);

    if (product) {
      updateProduct(product.id, {
        title,
        description,
        category,
        sku,
        priceLKR: Number(priceLKR),
        price: Number(priceUSD),
        stock: Number(stock),
        weight: Number(weight),
        dimensions: {
          length: Number(length),
          width: Number(width),
          height: Number(height),
        },
        hsCode,
        volumetricWeight: Number(volumetricWeight),
        images: activeImages,
        flashSale,
        flashSalePrice: flashSale ? Number(flashSalePrice) : undefined,
      });
    } else {
      addProduct({
        id: `p${Date.now()}`,
        title,
        brand: "SlmalkohaPremium",
        category,
        price: Number(priceUSD),
        priceLKR: Number(priceLKR),
        comparePrice: Number(priceUSD) * 1.3,
        rating: 5.0,
        reviews: 0,
        sold: 0,
        stock: Number(stock),
        sku,
        badge: "New",
        images: activeImages,
        description,
        specs: [
          { label: "Origin", value: "Sri Lanka" },
          { label: "HS Code", value: hsCode },
        ],
        weight: Number(weight),
        dimensions: {
          length: Number(length),
          width: Number(width),
          height: Number(height),
        },
        hsCode,
        volumetricWeight: Number(volumetricWeight),
        flashSale,
        flashSalePrice: flashSale ? Number(flashSalePrice) : undefined,
      });
    }

    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button and Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-3 font-semibold"
        >
          <ArrowLeft size={14} /> Back to Products Catalog
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {product ? "Edit Export Product" : "Add Export Product"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {product ? "Modify the global catalog listing details." : "Complete steps to publish new Sri Lankan artisan goods."}
        </p>
      </div>

      {/* Standalone Card container */}
      <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden flex flex-col">
        {/* Stepper Tabs Bar */}
        <div className="px-6 py-4 bg-muted/10 border-b border-border flex flex-wrap gap-2 justify-between">
          {[
            { stepNum: 1, label: "General Info", valid: isStep1Valid },
            { stepNum: 2, label: "Price & Stock", valid: isStep2Valid },
            { stepNum: 3, label: "Intl Shipping", valid: isStep3Valid },
          ].map((s) => (
            <button
              key={s.stepNum}
              type="button"
              onClick={() => setStep(s.stepNum as 1 | 2 | 3)}
              className={cn(
                "flex-1 min-w-[120px] text-center py-2.5 text-xs font-bold rounded-xl border transition-all duration-150 flex items-center justify-center gap-1.5",
                step === s.stepNum
                  ? "bg-brand text-brand-foreground border-brand shadow-glow"
                  : s.valid
                    ? "bg-card text-success border-success/30 hover:bg-muted"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <span className="h-5 w-5 rounded-full bg-white/20 inline-flex items-center justify-center text-[10px]">
                {s.stepNum}
              </span>
              {s.label}
              {s.valid && <CheckCircle2 size={12} className="text-success inline" />}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: GENERAL INFO */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Title</label>
                <input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Premium Organic Ceylon Cinnamon Quills"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  required
                />
              </div>

              {/* URL Slug Generator Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product URL Slug</label>
                  <span className="text-[10px] text-muted-foreground font-semibold">{slug.length} chars</span>
                </div>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                  placeholder="premium-organic-ceylon-cinnamon-quills"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground font-medium">
                  Lowercase, hyphen-separated string used in public storefront URL paths for SEO health.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a rich product story, harvesting conditions, grading info, and usage instructions…"
                  rows={6}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>

                  {/* Custom Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="font-semibold text-foreground">{category}</span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200",
                          dropdownOpen && "rotate-180 text-brand"
                        )}
                      />
                    </button>

                    {/* Custom Dropdown Options */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          {/* Close overlay on click outside */}
                          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-1.5 w-full z-20 bg-card border border-border shadow-lg rounded-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
                          >
                            {CATEGORIES.map((c) => {
                              const isSelected = c.name === category;
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => {
                                    setCategory(c.name);
                                    setDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm transition-all duration-150 flex items-center justify-between",
                                    isSelected
                                      ? "bg-brand/5 text-brand font-bold animate-fade-in"
                                      : "text-foreground hover:bg-brand/5 hover:text-brand"
                                  )}
                                >
                                  <span>{c.name}</span>
                                  {isSelected && <Check size={14} className="text-brand shrink-0" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Label</label>
                  <input
                    value="CeylonArtisan"
                    disabled
                    className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none text-muted-foreground font-medium"
                  />
                </div>
              </div>

              {/* Advanced Multiple Image Upload Component */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Product Images Gallery</label>

                {/* Dashed Dropzone Container */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDropMultiple}
                  onClick={triggerFileInput}
                  className={cn(
                    "rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[160px]",
                    dragActive ? "border-brand bg-brand/5 scale-[0.99]" : "border-border hover:border-brand/60 bg-muted/10"
                  )}
                >
                  <input
                    type="file"
                    multiple
                    id="image-file-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="text-muted-foreground mb-3 animate-pulse text-brand" size={32} />
                  <div className="text-sm font-bold text-foreground">Drag & drop your product images here, or browse files</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Supports PNG, JPG, or WEBP formats. Click to upload multiple.</div>
                </div>

                {/* Preview Grid and controls */}
                {images.length > 0 && (
                  <div className="space-y-3 border border-border/80 bg-muted/10 rounded-2xl p-4 mt-2">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                        <span>Gallery ({images.length} images)</span>
                        <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-extrabold">Live Grid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllImages}
                          className="text-xs text-muted-foreground hover:text-foreground font-bold transition-all px-2 py-1 rounded-lg hover:bg-muted"
                        >
                          {selectedImages.length === images.length ? "Deselect All" : "Select All"}
                        </button>
                        {selectedImages.length > 0 && (
                          <button
                            type="button"
                            onClick={handleDeleteSelectedImages}
                            className="text-xs text-destructive hover:text-destructive-dark font-extrabold transition-all px-2.5 py-1 rounded-lg bg-destructive/10 flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Delete Selected ({selectedImages.length})
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {images.map((imgSrc, index) => {
                        const isSelected = selectedImages.includes(imgSrc);
                        const isCover = coverImage === imgSrc;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "group relative aspect-square rounded-xl overflow-hidden border bg-background flex flex-col justify-between transition-all",
                              isCover ? "border-brand ring-2 ring-brand/30 scale-[1.01]" : "border-border/60 hover:border-brand/40"
                            )}
                          >
                            <img src={imgSrc} alt="" className="h-full w-full object-cover" />

                            {/* Sleek round check ring */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectImage(imgSrc);
                              }}
                              className="absolute top-2 left-2 z-10 flex items-center justify-center h-5 w-5 rounded-full border border-white/80 bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-105"
                            >
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full transition-all",
                                  isSelected ? "bg-brand scale-100" : "bg-transparent scale-0"
                                )}
                              />
                            </button>

                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute bottom-2 left-2 bg-brand text-brand-foreground px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shadow-sm">
                                Cover Photo
                              </div>
                            )}

                            {/* Hover overlay to set cover */}
                            {!isCover && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCoverImage(imgSrc);
                                  }}
                                  className="bg-white text-foreground hover:bg-muted text-[10px] font-extrabold rounded-lg px-2.5 py-1.5 shadow transition-all hover:scale-105"
                                >
                                  Set as Cover
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Sub Section */}
              <div className="pt-5 border-t border-border/80 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                    Search Engine Optimization (SEO)
                    <span className="text-[9px] bg-success/10 text-success px-1.5 py-0.5 rounded font-extrabold">SEO Pack</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Customize how this export listing appears in search results globally.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      metaDescription.length >= 160 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                    )}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                    placeholder="Type a brief search preview description that matches Google guidelines..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Focus Keywords / Meta Tags</label>
                  <input
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="e.g. Ceylon Cinnamon, Organic Spices, Sri Lanka Export"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium">Comma-separated tags to optimize search indexing.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PRICING & INVENTORY */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Local Price (LKR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground">Rs.</span>
                    <input
                      value={priceLKR}
                      onChange={(e) => handleNumericInput(e.target.value, setPriceLKR)}
                      placeholder="7500"
                      className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Domestic pricing for customers based in Sri Lanka.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">International Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground">$</span>
                    <input
                      value={priceUSD}
                      onChange={(e) => handleNumericInput(e.target.value, setPriceUSD)}
                      placeholder="25.00"
                      className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Pricing for global export destinations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SKU Code</label>
                  <input
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. CA-CINM-01"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stock Quantity</label>
                  <input
                    value={stock}
                    onChange={(e) => handleIntegerInput(e.target.value, setStock)}
                    placeholder="e.g. 50"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                    required
                  />
                </div>
              </div>

              {/* Flash Sale Fields */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">Include in Hourly Flash Sale</label>
                    <p className="text-[10px] text-muted-foreground font-medium">Apply a global time-limited discount to this item.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlashSale(!flashSale)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                      flashSale ? "bg-brand" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                        flashSale ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {flashSale && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Flash Sale Price (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground">$</span>
                        <input
                          value={flashSalePrice}
                          onChange={(e) => handleNumericInput(e.target.value, setFlashSalePrice)}
                          placeholder="19.00"
                          className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                          required={flashSale}
                        />
                      </div>
                      {flashSalePrice && Number(priceUSD) > 0 && Number(flashSalePrice) >= Number(priceUSD) && (
                        <p className="text-[10px] text-destructive font-bold mt-1">
                          Flash sale price must be lower than the normal price (${priceUSD}).
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Set the discount price in USD. LKR price is computed automatically based on this.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Equivalent LKR Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground">Rs.</span>
                        <input
                          value={flashSalePrice ? (Number(flashSalePrice) * 300).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                          disabled
                          className="w-full rounded-xl border border-border bg-muted/40 pl-11 pr-4 py-3 text-sm outline-none text-muted-foreground font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Calculated dynamically at a fixed 1 USD = 300 LKR rate.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: INTERNATIONAL SHIPPING */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Actual Weight (kg)</label>
                  <input
                    value={weight}
                    onChange={(e) => handleNumericInput(e.target.value, setWeight)}
                    placeholder="0.5"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground font-medium">Net parcel weight including container.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">HS Customs Code</label>
                  <input
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="e.g. 0906.11.00"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all font-mono"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground font-medium">Harmonized System Code for exports.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Package Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">L</span>
                    <input
                      value={length}
                      onChange={(e) => handleNumericInput(e.target.value, setLength)}
                      placeholder="25"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all pr-7"
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">W</span>
                    <input
                      value={width}
                      onChange={(e) => handleNumericInput(e.target.value, setWidth)}
                      placeholder="8"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all pr-7"
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">H</span>
                    <input
                      value={height}
                      onChange={(e) => handleNumericInput(e.target.value, setHeight)}
                      placeholder="8"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all pr-7"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Volumetric Weight Calculator Result */}
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 flex gap-3.5 items-start animate-fade-in">
                <Info size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Volumetric Weight Calculator</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Courier services charge based on the greater of actual weight or volumetric weight.
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-5">
                    <div className="bg-card px-3.5 py-2 rounded-xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Volumetric Weight</span>
                      <span className="text-sm font-extrabold text-brand tabular-nums">{volumetricWeight} kg</span>
                    </div>
                    <div className="bg-card px-3.5 py-2 rounded-xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Actual Weight</span>
                      <span className="text-sm font-extrabold text-foreground tabular-nums">{weight || "0"} kg</span>
                    </div>
                    <div className="bg-card px-3.5 py-2 rounded-xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Billable Weight</span>
                      <span className="text-sm font-extrabold text-success tabular-nums">
                        {Math.max(parseFloat(weight) || 0, parseFloat(volumetricWeight) || 0).toFixed(3)} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stepper Footer Controls */}
          <div className="pt-6 border-t border-border flex items-center justify-between gap-3">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4.5 py-3 text-xs font-bold hover:bg-muted transition"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-border bg-card px-4.5 py-3 text-xs font-bold hover:bg-muted text-muted-foreground transition"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && isStep1Valid) setStep(2);
                    else if (step === 2 && isStep2Valid) setStep(3);
                  }}
                  disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                  className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-5 py-3 text-xs font-bold disabled:opacity-55 shadow-glow hover:bg-brand-dark transition-all"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!isStep1Valid || !isStep2Valid || !isStep3Valid}
                  className="rounded-xl bg-brand text-brand-foreground px-6 py-3 text-xs font-extrabold shadow-glow hover:bg-brand-dark transition-all disabled:opacity-55"
                >
                  {product ? "Save Changes" : "Create Product"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
