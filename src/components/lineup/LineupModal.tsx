import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [customFormation, setCustomFormation] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const { toast } = useToast();

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

    const fetchExistingLineup = async () => {
      const { data, error } = await supabase
        .from("match_lineups")
        .select("*")
        .eq("match_id", matchId)
        .single();

      if (!error && data) {
        setFormation(data.formation);
        if (typeof data.positions === 'object' && data.positions !== null) {
          setSelectedPlayers(data.positions as Record<string, string>);
        }
      }
    };

    fetchPlayers();
    fetchExistingLineup();
  }, [categoryId, matchId]);

  const validateCustomFormation = (value: string) => {
    // Actualizado para aceptar formaciones de 3 o 4 números
    const pattern = /^\d+-\d+-\d+(-\d+)?$/;
    if (!pattern.test(value)) return false;
    
    const numbers = value.split('-').map(Number);
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum === 10; // 10 jugadores de campo (sin contar el portero)
  };

  const handleCustomFormationChange = (value: string) => {
    setCustomFormation(value);
    if (validateCustomFormation(value)) {
      setFormation(value);
    }
  };

  const getPositionsFromFormation = (formation: string) => {
    const positions: { top: string; left: string; position: string }[] = [];
    const numbers = formation.split("-").map(Number);

    // Portero
    positions.push({ top: "85%", left: "50%", position: "GK" });

    let currentTop = 70;
    const spacing = 15;

    // Función auxiliar para distribuir jugadores en una línea
    const distributePlayersInLine = (count: number, top: number, prefix: string) => {
      for (let i = 0; i < count; i++) {
        positions.push({
          top: `${top}%`,
          left: `${(100 / (count + 1)) * (i + 1)}%`,
          position: `${prefix}${i + 1}`,
        });
      }
    };

    // Defensas
    distributePlayersInLine(numbers[0], 70, "DEF");

    // Distribuir el resto de líneas según la cantidad de números en la formación
    if (numbers.length === 3) {
      // Formación tradicional (ej: 4-3-3)
      distributePlayersInLine(numbers[1], 45, "MID");
      distributePlayersInLine(numbers[2], 20, "FWD");
    } else if (numbers.length === 4) {
      // Formación con 4 líneas (ej: 4-2-3-1)
      const midTop1 = 55;
      const midTop2 = 40;
      const fwdTop = 20;

      distributePlayersInLine(numbers[1], midTop1, "DMF");
      distributePlayersInLine(numbers[2], midTop2, "AMF");
      distributePlayersInLine(numbers[3], fwdTop, "FWD");
    }

    return positions;
  };

  const handlePlayerSelect = (position: string, playerId: string) => {
    setSelectedPlayers((prev) => ({
      ...prev,
      [position]: playerId,
    }));
  };

  const handleSaveLineup = async () => {
    const { error } = await supabase
      .from("match_lineups")
      .upsert({
        match_id: matchId,
        formation: formation,
        positions: selectedPlayers,
      }, {
        onConflict: 'match_id'
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la alineación",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Éxito",
        description: "Alineación guardada correctamente",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Alineación del Equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            {!isCustom ? (
              <Select value={formation} onValueChange={(value) => {
                if (value === "custom") {
                  setIsCustom(true);
                } else {
                  setFormation(value);
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona formación" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Formación personalizada</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Ej: 4-3-3 o 4-2-3-1"
                  value={customFormation}
                  onChange={(e) => handleCustomFormationChange(e.target.value)}
                  className="w-[180px]"
                />
                <Button
                  variant="outline"
                  onClick={() => setIsCustom(false)}
                >
                  Volver
                </Button>
              </div>
            )}
            <Button onClick={handleSaveLineup}>
              Guardar Alineación
            </Button>
          </div>

          <div className="relative w-full h-[600px] bg-green-600 rounded-lg overflow-hidden">
            {/* Campo de fútbol */}
            <div className="absolute inset-0 border-2 border-white">
              {/* Área grande inferior */}
              <div className="absolute bottom-0 left-[20%] right-[20%] h-[20%] border-2 border-white" />
              {/* Área grande superior */}
              <div className="absolute top-0 left-[20%] right-[20%] h-[20%] border-2 border-white" />
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