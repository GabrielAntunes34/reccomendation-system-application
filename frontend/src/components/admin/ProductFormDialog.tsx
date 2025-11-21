import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export type AdminProductFormData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collectionId?: number;
  collection?: string;
  image: string;
  colors: string[];
  sizes: string[];
  model?: string;
};

type CollectionOption = { id: number; name: string };

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProductFormData | null;
  onSubmit: (product: AdminProductFormData) => void;
  collections?: CollectionOption[];
}

export function ProductFormDialog({ open, onOpenChange, product, onSubmit, collections = [] }: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    collectionId: '',
    image: '',
    colors: [] as string[],
    sizes: [] as string[],
    model: 'manual',
  });
  const [newColor, setNewColor] = useState('#000000');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        collectionId: product.collectionId ? String(product.collectionId) : '',
        image: product.image,
        colors: product.colors,
        sizes: product.sizes,
        model: product.model || 'manual',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        collectionId: '',
        image: '',
        colors: [],
        sizes: [],
        model: 'manual',
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.collectionId) {
      toast.error('Selecione uma coleção');
      return;
    }

    const productData: AdminProductFormData = {
      ...(product ? { id: product.id } : {}),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      collectionId: Number(formData.collectionId),
      image: formData.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
      colors: formData.colors.length > 0 ? formData.colors : ['#000000'],
      sizes: formData.sizes.length > 0 ? formData.sizes : ['U'],
      model: formData.model || 'manual',
    };

    onSubmit(productData);
  };

  const addColor = () => {
    if (!formData.colors.includes(newColor)) {
      setFormData({ ...formData, colors: [...formData.colors, newColor] });
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
  };

  const addSize = () => {
    const size = newSize.trim().toUpperCase();
    if (size && !formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do produto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer hover:border-primary/40 transition-smooth"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ou cole uma URL de imagem abaixo
                </p>
                <Input
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e:any) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-2 hover:border-primary/40 transition-smooth"
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e:any) => setFormData({ ...formData, name: e.target.value })}
                className="hover:border-primary/40 transition-smooth"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e:any) => setFormData({ ...formData, price: e.target.value })}
                className="hover:border-primary/40 transition-smooth"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e:any) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Calçados"
                className="hover:border-primary/40 transition-smooth"
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="collection">Coleção *</Label>
              <select
                id="collection"
                value={formData.collectionId}
                onChange={(e:any) => setFormData({ ...formData, collectionId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:border-primary/40 transition-smooth"
                required
              >
                <option value="">Selecione</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e:any) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label>Cores Disponíveis</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={newColor}
                onChange={(e:any) => setNewColor(e.target.value)}
                className="w-20"
              />
              <Button type="button" onClick={addColor} variant="outline" size="sm">
                Adicionar Cor
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color) => (
                <div key={color} className="relative group">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-border"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <Label>Tamanhos Disponíveis</Label>
            <div className="flex gap-2">
              <Input
                value={newSize}
                onChange={(e:any) => setNewSize(e.target.value)}
                placeholder="Ex: P, M, G, 38, 40..."
                onKeyPress={(e:any) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <Button type="button" onClick={addSize} variant="outline" size="sm">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size) => (
                <Badge key={size} variant="secondary" className="gap-2">
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gradient-primary">
              {product ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
