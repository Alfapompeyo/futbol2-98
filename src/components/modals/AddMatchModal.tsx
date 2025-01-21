import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (match: any) => void;
  seasonId: string;
}

export function AddMatchModal({ isOpen, onClose, onAdd, seasonId }: AddMatchModalProps) {
  const [match, setMatch] = useState({
    opponent: "",
    date: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...match, season_id: seasonId });
    setMatch({ opponent: "", date: "", location: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Partido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="opponent" className="text-sm font-medium">
              Oponente
            </label>
            <Input
              id="opponent"
              placeholder="Nombre del equipo oponente"
              value={match.opponent}
              onChange={(e) => setMatch({ ...match, opponent: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Fecha
            </label>
            <Input
              id="date"
              type="datetime-local"
              value={match.date}
              onChange={(e) => setMatch({ ...match, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Ubicación
            </label>
            <Input
              id="location"
              placeholder="Lugar del partido"
              value={match.location}
              onChange={(e) => setMatch({ ...match, location: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            Añadir Partido
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}