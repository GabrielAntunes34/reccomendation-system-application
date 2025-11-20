import { useState } from "react";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { products } from "@/data/products";
import { Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("whatsapp_phone");
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handlePhoneSubmit = (phone: string) => {
    localStorage.setItem("whatsapp_phone", phone);
    setShowWhatsAppModal(false);
    console.log("WhatsApp saved:", phone);
  };

  const collections = [
    { title: "Novidades", products: products.filter(p => p.collection === "Novidades") },
    { title: "Mais Vendidos", products: products.filter(p => p.collection === "Mais Vendidos") },
    { title: "Ofertas", products: products.filter(p => p.collection === "Ofertas") },
  ];

  return (
    <>
      <WhatsAppModal open={showWhatsAppModal} onSubmit={handlePhoneSubmit} />

      <div className="min-h-screen bg-gradient-subtle">
        {/* Botão Admin Discreto */}
        <a
          href="/admin"
          className="fixed bottom-4 left-4 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted border border-border/30 flex items-center justify-center opacity-30 hover:opacity-100 transition-smooth z-50"
          title="Área Administrativa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </a>

        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg shadow-soft">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1
                className="text-xl font-display font-bold bg-clip-text text-transparent inline-block"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                Arte Em Laço
              </h1>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              Produtos artesanais com amor 💕
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4 py-8 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight space-y-1">
              <span className="block">
                Produtos{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  Encantadores
                </span>
              </span>
              <span className="block">para Momentos Especiais</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção exclusiva de peças artesanais feitas com carinho para os pequenos
            </p>
          </section>

          {/* Collections Sections */}
          {collections.map((collection, index) => (
            <section key={collection.title} className="space-y-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-2xl md:text-3xl font-display font-bold">
                  {collection.title}
                </h3>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {collection.products.map((product) => (
                    <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ProductCard
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </section>
          ))}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-16 py-8 bg-card/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Catálogo Infantil - Produtos artesanais com amor 💕</p>
          </div>
        </footer>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductChange={setSelectedProduct}
      />
    </>
  );
};

export default Index;
