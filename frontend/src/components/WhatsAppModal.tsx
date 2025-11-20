import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface WhatsAppModalProps {
  open: boolean;
  onSubmit: (phone: string) => void;
}

export function WhatsAppModal({ open, onSubmit }: WhatsAppModalProps) {
  const [phone, setPhone] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("whatsapp_phone") ?? "";
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      localStorage.setItem("whatsapp_phone", phone);
      onSubmit(phone);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md gradient-card border-primary/20">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <Phone className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-display text-center">
            Bem-vinda! 💕
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Para começar a explorar nossos produtos encantadores, deixe seu WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e:any) => setPhone(formatPhone(e.target.value))}
              className="h-12 text-center text-lg border-primary/30 focus:border-primary transition-smooth"
              maxLength={15}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 gradient-primary text-base font-medium shadow-soft hover:shadow-elevated transition-smooth"
            disabled={phone.length < 14}
          >
            Continuar para o Catálogo
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Usaremos seu número apenas para melhorar sua experiência de compra
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
