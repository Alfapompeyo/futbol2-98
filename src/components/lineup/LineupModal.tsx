import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  position: string;
}

interface LineupModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  categoryId: string;
}

const formations = [
  { value: "4-3-3", label: "4-3-3" },
  { value: "4-4-2", label: "4-4-2" },
  { value: "3-5-2", label: "3-5-2" },
  { value: "5-3-2", label: "5-3-2" },
  { value: "4-2-3-1", label: "4-2-3-1" },
];

export function LineupModal({ isOpen, onClose, matchId, categoryId }: LineupModalProps) {
  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("category_id", categoryId);

      if (!error && data) {
        setPlayers(data);
      }
    };

    fetchPlayers();
  }, [categoryId]);

  const getPositionsFromFormation = (formation: string) => {
    const positions: { top: string; left: string; position: string }[] = [];
    const [defenders, midfielders, forwards] = formation.split("-").map(Number);

    // Goalkeeper
    positions.push({ top: "85%", left: "50%", position: "GK" });

    // Defenders
    for (let i = 0; i < defenders; i++) {
      positions.push({
        top: "70%",
        left: `${(100 / (defenders + 1)) * (i + 1)}%`,
        position: `DEF${i + 1}`,
      });
    }

    // Midfielders
    for (let i = 0; i < midfielders; i++) {
      positions.push({
        top: "45%",
        left: `${(100 / (midfielders + 1)) * (i + 1)}%`,
        position: `MID${i + 1}`,
      });
    }

    // Forwards
    for (let i = 0; i < forwards; i++) {
      positions.push({
        top: "20%",
        left: `${(100 / (forwards + 1)) * (i + 1)}%`,
        position: `FWD${i + 1}`,
      });
    }

    return positions;
  };

  const handlePlayerSelect = (position: string, playerId: string) => {
    setSelectedPlayers((prev) => ({
      ...prev,
      [position]: playerId,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Alineación del Equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={formation} onValueChange={setFormation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona formación" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full h-[600px] bg-green-600 rounded-lg overflow-hidden">
            {/* Campo de fútbol */}
            <div className="absolute inset-0 border-2 border-white">
              {/* Área grande */}
              <div className="absolute top-[75%] left-[20%] right-[20%] h-[20%] border-2 border-white" />
              <div className="absolute top-[0%] left-[20%] right-[20%] h-[20%] border-2 border-white" />
              {/* Círculo central */}
              <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] border-2 border-white rounded-full" />
              {/* Línea media */}
              <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-white" />
            </div>

            {/* Jugadores */}
            {getPositionsFromFormation(formation).map((pos) => (
              <div
                key={pos.position}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                <Select
                  value={selectedPlayers[pos.position] || ""}
                  onValueChange={(value) => handlePlayerSelect(pos.position, value)}
                >
                  <SelectTrigger className="w-[120px] bg-white">
                    <SelectValue placeholder="Jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
