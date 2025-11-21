import type { Product } from "@/components/ProductCard";

export function getRecommendedProducts(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  // Exclude current product
  const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
  
  // Calculate similarity scores
  const scored = otherProducts.map(product => {
    let score = 0;
    
    // Same category gets high priority
    if (product.category === currentProduct.category) {
      score += 50;
    }
    
    // Similar price range (+/- 30%)
    const priceDiff = Math.abs(product.price - currentProduct.price);
    const priceThreshold = currentProduct.price * 0.3;
    if (priceDiff <= priceThreshold) {
      score += 30 * (1 - priceDiff / priceThreshold);
    }
    
    // Matching colors
    const matchingColors = product.colors.filter(color => 
      currentProduct.colors.includes(color)
    );
    score += matchingColors.length * 10;
    
    // Same collection bonus
    if (product.collection === currentProduct.collection) {
      score += 15;
    }
    
    return { product, score };
  });
  
  // Sort by score and return top products
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}
