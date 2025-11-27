import type { Product } from "@/components/ProductCard";
import { recommendationApi, getAuthToken } from "@/lib/api";

export async function fetchRecommendedProducts(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4,
  onAuthRequired?: () => void,
): Promise<Product[]> {
  const token = getAuthToken();
  if (!token) {
    onAuthRequired?.();
    return [];
  }
  try {
    const recs = await recommendationApi.list(currentProduct.id);
    return (recs as any[])
      .map((p) => ({
        id: String(p.id),
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        colors: Array.isArray(p.color) ? p.color : [],
        sizes: p.size ? String(p.size).split(",").map((s: string) => s.trim()).filter(Boolean) : ["Único"],
        description: p.description,
        collection: undefined,
      }))
      .slice(0, limit);
  } catch (err: any) {
    if (err?.status === 401) {
      onAuthRequired?.();
    }
    console.warn("Falha ao buscar recomendações da API", err);
    return [];
  }
}

// Algoritmo local anterior, mantido como fallback
export function getRecommendedProductsLocal(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4,
): Product[] {
  const otherProducts = allProducts.filter((p) => p.id !== currentProduct.id);

  const scored = otherProducts.map((product) => {
    let score = 0;

    if (product.category === currentProduct.category) {
      score += 50;
    }

    const priceDiff = Math.abs(product.price - currentProduct.price);
    const priceThreshold = currentProduct.price * 0.3;
    if (priceDiff <= priceThreshold) {
      score += 30 * (1 - priceDiff / priceThreshold);
    }

    const currentColorNames = currentProduct.colors.map((c) => c.name);
    const matchingColors = product.colors.filter((color) => currentColorNames.includes(color.name));
    score += matchingColors.length * 10;

    if (product.collection === currentProduct.collection) {
      score += 15;
    }

    return { product, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
}
