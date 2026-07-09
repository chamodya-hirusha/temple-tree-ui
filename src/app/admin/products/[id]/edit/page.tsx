"use client";

import { useParams, notFound } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { products } = useStore();
  
  if (!id) return null; // Wait for router to be ready

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}
