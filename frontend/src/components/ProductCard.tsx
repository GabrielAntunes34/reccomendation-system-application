import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { isFavorite as isFavoriteStored, toggleFavorite } from "@/utils/favorites";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  description: string;
  collection?: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isFavoriteStored(product.id));
  }, [product.id]);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-smooth hover:shadow-card bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            const next = toggleFavorite(product.id);
            setIsFavorite(next);
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-smooth shadow-soft"
        >
          <Heart
            className={`w-5 h-5 transition-smooth ${
              isFavorite ? "fill-primary text-primary" : "text-foreground/60"
            }`}
          />
        </button>
        {product.collection && (
          <Badge className="absolute top-3 left-3 gradient-primary border-0 shadow-soft">
            {product.collection}
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {product.category}
          </p>
          <h3 className="font-display font-semibold text-base mt-1 line-clamp-2 group-hover:text-primary transition-smooth">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-card shadow-sm ring-1 ring-border/20"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-display font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </p>
          <div className="flex gap-1">
            {product.sizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="px-2 py-1 text-xs font-medium bg-muted rounded text-foreground/80"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
