import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: any) => void;
}

export function AddPlayerModal({ isOpen, onClose, onAdd }: AddPlayerModalProps) {
  const [player, setPlayer] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    position: "",
  });

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
          <DialogTitle>Añadir Jugador a sub-17</DialogTitle>
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
            Añadir Jugador
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}