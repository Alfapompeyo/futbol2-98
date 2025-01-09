import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Player {
  name: string;
  age: string;
  height: string;
  weight: string;
  position: string;
}

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: Player) => void;
  initialData?: {
    name: string;
    age?: number;
    height?: string;
    weight?: string;
    position?: string;
  };
}

export function AddPlayerModal({ isOpen, onClose, onAdd, initialData }: AddPlayerModalProps) {
  const [player, setPlayer] = useState<Player>({
    name: "",
    age: "",
    height: "",
    weight: "",
    position: "",
  });

  useEffect(() => {
    if (initialData) {
      setPlayer({
        name: initialData.name || "",
        age: initialData.age?.toString() || "",
        height: initialData.height || "",
        weight: initialData.weight || "",
        position: initialData.position || "",
      });
    } else {
      setPlayer({
        name: "",
        age: "",
        height: "",
        weight: "",
        position: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(player);
    setPlayer({ name: "", age: "", height: "", weight: "", position: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Jugador" : "Añadir Jugador"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="playerName"
              placeholder="Nombre del jugador"
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">
              Edad
            </label>
            <Input
              id="age"
              placeholder="Edad"
              value={player.age}
              onChange={(e) => setPlayer({ ...player, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              Estatura (cm)
            </label>
            <Input
              id="height"
              placeholder="Estatura"
              value={player.height}
              onChange={(e) => setPlayer({ ...player, height: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Peso (kg)
            </label>
            <Input
              id="weight"
              placeholder="Peso"
              value={player.weight}
              onChange={(e) => setPlayer({ ...player, weight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium">
              Posición
            </label>
            <Input
              id="position"
              placeholder="Posición del jugador"
              value={player.position}
              onChange={(e) => setPlayer({ ...player, position: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B]">
            {initialData ? "Guardar Cambios" : "Añadir Jugador"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}