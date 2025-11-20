import type { Product } from "./ProductCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface RecommendedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function RecommendedProducts({ products, onProductClick }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6 pt-6 border-t border-border/50">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-display font-semibold">Você também pode gostar</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-soft hover:-translate-y-1 hover:brightness-105 transition-smooth text-left cursor-pointer"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {product.category}
              </p>
              <p className="font-semibold line-clamp-2">{product.name}</p>
              <p className="text-xl text-primary font-display font-bold">
                R$ {product.price.toFixed(2)}
              </p>
              {product.collection && (
                <Badge className="text-xs gradient-primary border-0 mt-2">
                  {product.collection}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
