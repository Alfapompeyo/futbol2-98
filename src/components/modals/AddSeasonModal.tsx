import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (season: { name: string }) => void;
}

export function AddSeasonModal({ isOpen, onClose, onAdd }: AddSeasonModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name });
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Temporada</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre de la Temporada
            </label>
            <Input
              id="name"
              placeholder="Ej: Temporada 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Añadir Temporada
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}