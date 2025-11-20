import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Heart } from "lucide-react";
import type { Product } from "./ProductCard";
import { useState } from "react";
import { RecommendedProducts } from "./RecommendedProducts";
import { getRecommendedProducts } from "@/utils/recommendations";
import { products } from "@/data/products";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onProductChange?: (product: Product) => void;
}

export function ProductDetailModal({ product, open, onClose, onProductChange }: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!product) return null;

  const recommendedProducts = getRecommendedProducts(product, products);

  const handleRecommendedClick = (recommendedProduct: Product) => {
    setSelectedColor("");
    setSelectedSize("");
    if (onProductChange) {
      onProductChange(recommendedProduct);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.collection && (
                    <Badge className="absolute top-4 left-4 gradient-primary border-0 shadow-soft">
                      {product.collection}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <DialogHeader>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                    {product.category}
                  </p>
                  <DialogTitle className="text-3xl font-display font-bold mt-2">
                    {product.name}
                  </DialogTitle>
                  <p className="text-3xl font-display font-bold text-primary mt-4">
                    R$ {product.price.toFixed(2)}
                  </p>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Descrição</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Cores Disponíveis</h4>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-smooth shadow-sm ${
                            selectedColor === color
                              ? "border-primary ring-2 ring-primary/30 scale-110"
                              : "border-card ring-1 ring-border/20 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Tamanhos</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                            selectedSize === size
                              ? "bg-primary text-primary-foreground shadow-soft"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      size="lg"
                      className="flex-1 gradient-primary shadow-soft hover:shadow-elevated transition-smooth"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/5 transition-smooth"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Products - Full Width */}
            <RecommendedProducts 
              products={recommendedProducts}
              onProductClick={handleRecommendedClick}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
