import { useEffect, useMemo, useState } from "react";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import {
  productApi,
  collectionApi,
  userApi,
  interactionApi,
  authApi,
  setAuthToken,
  getSessionIdFromToken,
} from "@/lib/api";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ApiProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  color: { name: string; hex: string }[];
  size: string;
  description: string;
  model: string;
  collection_id?: number | null;
};

type ApiCollection = {
  id: number;
  name: string;
};

const Index = () => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const clearAuthState = () => {
    setAuthToken(undefined);
    setUserId(null);
    setSessionId(null);
    setShowWhatsAppModal(true);
  };
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (phone: string) => {
    setShowWhatsAppModal(false);
    try {
      const created = await userApi.create({ name: "Cliente", phone_nmr: phone }) as { id?: number };
      if (created && created.id) {
        setUserId(created.id);
        const login = await authApi.login(phone);
        setAuthToken(login.access_token);
        const decodedSession = getSessionIdFromToken();
        setSessionId(decodedSession);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar usuário";
      toast.error(message);
      clearAuthState();
    }
  };

  useEffect(() => {
    const mapApiProduct = (p: ApiProduct, collectionLookup: Map<number, string>): Product => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      colors: Array.isArray(p.color)
        ? p.color.map((c: any, idx) => ({
            name: c?.name ?? `Cor ${idx + 1}`,
            hex: c?.hex ?? String(c ?? "#000000"),
          }))
        : [],
      sizes: p.size
        ? p.size.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Único"],
      description: p.description,
      collection: p.collection_id ? collectionLookup.get(p.collection_id) ?? undefined : undefined,
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const [apiProducts, apiCollections] = await Promise.all([
          productApi.list().catch(() => []),
          collectionApi.list().catch(() => []),
        ]);

        const collectionLookup = new Map<number, string>(
          (apiCollections as ApiCollection[]).map((c) => [c.id, c.name]),
        );

        const mappedProducts =
          (apiProducts as ApiProduct[]).map((p) => mapApiProduct(p, collectionLookup)) || [];

        setCatalog(mappedProducts);
        setCollections(apiCollections as ApiCollection[]);
        setError(mappedProducts.length ? null : "Nenhum produto cadastrado no backend.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar produtos";
        setCatalog([]);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const collectionsToShow = useMemo(() => {
    if (!catalog.length) return [];

    if (collections.length) {
      const sections = collections
        .map((col) => ({
          title: col.name,
          products: catalog.filter((p) => p.collection === col.name),
        }))
        .filter((section) => section.products.length);

      const noCollection = catalog.filter(
        (p) => !p.collection || !collections.find((c) => c.name === p.collection),
      );
      if (noCollection.length) {
        sections.push({ title: "Outros", products: noCollection });
      }
      return sections;
    }

    return [{ title: "Produtos", products: catalog }];
  }, [collections, catalog]);

  const getInteraction = async (productId: string) => {
    if (!userId || !sessionId) return null;
    try {
      const current = await interactionApi.get(userId, productId, sessionId);
      return current as { times_viewed?: number; liked?: boolean; contacted?: boolean };
    } catch {
      return null;
    }
  };

  const recordView = async (productId: string) => {
    if (!userId || !sessionId) return;
    try {
      const current = await getInteraction(productId);
      const times = (current?.times_viewed ?? 0) + 1;
      if (current) {
        await interactionApi.update(userId, productId, sessionId, {
          times_viewed: times,
          liked: current?.liked ?? false,
          contacted: current?.contacted ?? false,
        });
      } else {
        await interactionApi.create({
          user_id: userId,
          product_id: Number(productId),
          session_id: sessionId,
          times_viewed: times,
          liked: false,
          contacted: false,
        });
      }
    } catch (err) {
      console.error("Erro ao registrar visualização", err);
    }
  };

  const recordFavorite = async (productId: string, liked: boolean) => {
    if (!userId || !sessionId) return;
    try {
      const current = await getInteraction(productId);
      if (current) {
        await interactionApi.update(userId, productId, sessionId, {
          times_viewed: current?.times_viewed ?? 1,
          liked,
          contacted: current?.contacted ?? false,
        });
      } else {
        await interactionApi.create({
          user_id: userId,
          product_id: Number(productId),
          session_id: sessionId,
          times_viewed: 1,
          liked,
          contacted: false,
        });
      }
    } catch (err) {
      console.error("Erro ao registrar like", err);
    }
  };

  const recordContact = async (productId: string) => {
    if (!userId || !sessionId) return;
    try {
      const current = await getInteraction(productId);
      if (current) {
        await interactionApi.update(userId, productId, sessionId, {
          times_viewed: current?.times_viewed ?? 1,
          liked: current?.liked ?? false,
          contacted: true,
        });
      } else {
        await interactionApi.create({
          user_id: userId,
          product_id: Number(productId),
          session_id: sessionId,
          times_viewed: 1,
          liked: false,
          contacted: true,
        });
      }
    } catch (err) {
      console.error("Erro ao registrar contato", err);
    }
  };

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
          {error && (
            <div className="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

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
          {loading && (
            <div className="text-center text-muted-foreground">Carregando catálogo...</div>
          )}

          {!loading && !collectionsToShow.length && (
            <div className="p-6 rounded-md border border-border/60 bg-card/60 text-center text-muted-foreground">
              Nenhum produto disponível no momento.
            </div>
          )}

          {!loading &&
            collectionsToShow.map((collection, index) => (
              <section
                key={collection.title}
                className="space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
                      <CarouselItem
                        key={product.id}
                        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <ProductCard
                          product={product}
                          onClick={() => {
                            if (!sessionId) {
                              clearAuthState();
                              return;
                            }
                            setSelectedProduct(product);
                            recordView(product.id);
                          }}
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
        allProducts={catalog}
        onFavoriteChange={recordFavorite}
        onContact={recordContact}
        onProductView={recordView}
        onAuthRequired={clearAuthState}
      />
    </>
  );
};

export default Index;
