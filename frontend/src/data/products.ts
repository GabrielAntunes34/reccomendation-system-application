import type { Product } from "@/components/ProductCard";

export type { Product };

export const products: Product[] = [
  {
    id: "1",
    name: "Vestido Floral Delicado",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop",
    category: "Vestidos",
    colors: ["#FFB6D9", "#E8D5F2", "#FFE5EC", "#B8E6F5"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido artesanal com estampa floral delicada, perfeito para ocasiões especiais. Confeccionado com tecidos macios e detalhes em renda.",
    collection: "Novidades"
  },
  {
    id: "2",
    name: "Conjunto Laço Encantado",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=500&fit=crop",
    category: "Conjuntos",
    colors: ["#FFD6E8", "#E5D4F7", "#FFF0E5"],
    sizes: ["1", "2", "3", "4"],
    description: "Conjunto charmoso com detalhes de laço bordado à mão. Ideal para o dia a dia com muito estilo e conforto.",
    collection: "Mais Vendidos"
  },
  {
    id: "3",
    name: "Sapatinho de Princesa",
    price: 45.50,
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=500&h=500&fit=crop",
    category: "Calçados",
    colors: ["#FFB8D1", "#C5A3E8", "#FFE8F0"],
    sizes: ["15", "16", "17", "18"],
    description: "Sapatinhos artesanais super confortáveis com detalhes brilhantes. Perfeitos para completar qualquer look especial.",
    collection: "Novidades"
  },
  {
    id: "4",
    name: "Body Bordado Amor",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop",
    category: "Bodies",
    colors: ["#FFE5EC", "#FFF0E5", "#F0E5FF"],
    sizes: ["RN", "P", "M", "G"],
    description: "Body em algodão orgânico com bordado delicado de corações. Maciez e estilo para os pequenos.",
    collection: "Ofertas"
  },
  {
    id: "5",
    name: "Macacão Estrelinhas",
    price: 72.00,
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=500&fit=crop",
    category: "Macacões",
    colors: ["#E8D5F2", "#FFD6E8", "#B8E6F5", "#FFE8F0"],
    sizes: ["1", "2", "3", "4"],
    description: "Macacão com estampa de estrelas, super confortável e charmoso. Perfeito para brincadeiras e passeios.",
    collection: "Mais Vendidos"
  },
  {
    id: "6",
    name: "Laço Gigante Premium",
    price: 28.90,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Acessórios",
    colors: ["#FFB6D9", "#E8D5F2", "#FFE5EC", "#C5A3E8", "#FFF0E5"],
    sizes: ["Único"],
    description: "Laço tamanho grande feito em tecido nobre com acabamento impecável. Perfeito para arrasar no visual.",
    collection: "Novidades"
  },
  {
    id: "7",
    name: "Saia Tule Princesa",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500&h=500&fit=crop",
    category: "Saias",
    colors: ["#FFD6E8", "#E5D4F7", "#FFE8F0", "#B8E6F5"],
    sizes: ["2", "4", "6", "8"],
    description: "Saia de tule com várias camadas, criando um efeito princesa encantador. Ideal para festas e fotos.",
    collection: "Mais Vendidos"
  },
  {
    id: "8",
    name: "Pijama Coelhinho Soft",
    price: 52.00,
    image: "https://images.unsplash.com/photo-1578863495797-5c2f6e37c7c2?w=500&h=500&fit=crop",
    category: "Pijamas",
    colors: ["#FFE5EC", "#E8D5F2", "#FFF0E5"],
    sizes: ["1", "2", "3", "4"],
    description: "Pijama super macio com estampa de coelhinhos. Garantia de noites de sono confortáveis e fofas.",
    collection: "Ofertas"
  },
  {
    id: "9",
    name: "Tiara Flores Primavera",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1595642527925-4d41cb781653?w=500&h=500&fit=crop",
    category: "Acessórios",
    colors: ["#FFB6D9", "#FFE5EC", "#E8D5F2", "#FFF0E5"],
    sizes: ["Único"],
    description: "Tiara artesanal com flores delicadas feitas à mão. Um toque especial para qualquer ocasião.",
    collection: "Novidades"
  },
  {
    id: "10",
    name: "Jardineira Vintage",
    price: 68.00,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&h=500&fit=crop",
    category: "Conjuntos",
    colors: ["#E8D5F2", "#FFD6E8", "#B8E6F5"],
    sizes: ["2", "4", "6", "8"],
    description: "Jardineira com estilo vintage e detalhes bordados. Charme e personalidade para os pequenos.",
    collection: "Mais Vendidos"
  },
  {
    id: "11",
    name: "Meia Calça Estampada",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1586083702768-190ae093d34d?w=500&h=500&fit=crop",
    category: "Acessórios",
    colors: ["#FFB6D9", "#E8D5F2", "#FFE5EC"],
    sizes: ["P", "M", "G"],
    description: "Meia calça confortável com estampas exclusivas. Perfeita para compor looks encantadores.",
    collection: "Ofertas"
  },
  {
    id: "12",
    name: "Casaco Pompom Deluxe",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&h=500&fit=crop",
    category: "Casacos",
    colors: ["#FFD6E8", "#E8D5F2", "#FFF0E5", "#B8E6F5"],
    sizes: ["2", "4", "6", "8"],
    description: "Casaco artesanal com detalhes de pompons. Aquecimento e estilo em uma peça única.",
    collection: "Novidades"
  }
];
