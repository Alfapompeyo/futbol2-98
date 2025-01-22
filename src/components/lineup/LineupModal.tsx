import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";

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

const defaultFormations = [
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
  const [substitutePlayers, setSubstitutePlayers] = useState<string[]>([]);
  const [customFormation, setCustomFormation] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [savedFormations, setSavedFormations] = useState<Array<{ value: string; label: string }>>(defaultFormations);
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
        if (data.substitutes && Array.isArray(data.substitutes)) {
          setSubstitutePlayers(data.substitutes.map(sub => String(sub)));
        }
        if (!savedFormations.some(f => f.value === data.formation)) {
          setSavedFormations(prev => [...prev, { value: data.formation, label: data.formation }]);
        }
      }
    };

    fetchPlayers();
    fetchExistingLineup();
  }, [categoryId, matchId]);

  const validateCustomFormation = (value: string) => {
    const pattern = /^\d+-\d+-\d+(-\d+)?$/;
    if (!pattern.test(value)) return false;
    
    const numbers = value.split('-').map(Number);
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum === 10;
  };

  const handleCustomFormationChange = (value: string) => {
    setCustomFormation(value);
    if (validateCustomFormation(value)) {
      setFormation(value);
    }
  };

  const handleFormationSelect = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setFormation(value);
      setIsCustom(false);
    }
  };

  const handleSaveCustomFormation = () => {
    if (validateCustomFormation(customFormation)) {
      const newFormation = { value: customFormation, label: customFormation };
      setSavedFormations(prev => [...prev, newFormation]);
      setFormation(customFormation);
      setIsCustom(false);
      toast({
        title: "Éxito",
        description: "Formación personalizada guardada",
      });
    } else {
      toast({
        title: "Error",
        description: "Formación inválida",
        variant: "destructive",
      });
    }
  };

  const getPositionsFromFormation = (formation: string) => {
    const positions: { top: string; left: string; position: string }[] = [];
    const numbers = formation.split("-").map(Number);

    positions.push({ top: "85%", left: "50%", position: "GK" });

    let currentTop = 70;
    const spacing = 15;

    const distributePlayersInLine = (count: number, top: number, prefix: string) => {
      for (let i = 0; i < count; i++) {
        positions.push({
          top: `${top}%`,
          left: `${(100 / (count + 1)) * (i + 1)}%`,
          position: `${prefix}${i + 1}`,
        });
      }
    };

    distributePlayersInLine(numbers[0], 70, "DEF");

    if (numbers.length === 3) {
      distributePlayersInLine(numbers[1], 45, "MID");
      distributePlayersInLine(numbers[2], 20, "FWD");
    } else if (numbers.length === 4) {
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

  const handleSubstituteSelect = (playerId: string) => {
    if (substitutePlayers.includes(playerId)) {
      setSubstitutePlayers(prev => prev.filter(id => id !== playerId));
    } else {
      setSubstitutePlayers(prev => [...prev, playerId]);
    }
  };

  const isPlayerSelected = (playerId: string) => {
    return Object.values(selectedPlayers).includes(playerId) || substitutePlayers.includes(playerId);
  };

  const handleSaveLineup = async () => {
    try {
      const lineupData = {
        match_id: matchId,
        formation: formation,
        positions: selectedPlayers,
        substitutes: substitutePlayers
      };

      const { error } = await supabase
        .from("match_lineups")
        .upsert(lineupData, {
          onConflict: 'match_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Alineación guardada correctamente",
      });
      onClose();
    } catch (error) {
      console.error('Error saving lineup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la alineación",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Alineación del Equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            {!isCustom ? (
              <Select value={formation} onValueChange={handleFormationSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona formación" />
                </SelectTrigger>
                <SelectContent>
                  {savedFormations.map((f) => (
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
                  onClick={handleSaveCustomFormation}
                  disabled={!validateCustomFormation(customFormation)}
                >
                  Guardar
                </Button>
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

          <div className="flex gap-4">
            <div className="relative w-[70%] h-[600px] bg-green-600 rounded-lg overflow-hidden">
              <div className="absolute inset-0 border-2 border-white">
                <div className="absolute bottom-0 left-[20%] right-[20%] h-[20%] border-2 border-white" />
                <div className="absolute top-0 left-[20%] right-[20%] h-[20%] border-2 border-white" />
                <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] border-2 border-white rounded-full" />
                <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-white" />
              </div>

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
                      {players
                        .filter(player => !isPlayerSelected(player.id) || selectedPlayers[pos.position] === player.id)
                        .map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="w-[30%] h-[600px] bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">Banca</h3>
              </div>
              <div className="space-y-2">
                {players
                  .filter(player => !Object.values(selectedPlayers).includes(player.id))
                  .map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSubstituteSelect(player.id)}
                    >
                      <input
                        type="checkbox"
                        checked={substitutePlayers.includes(player.id)}
                        onChange={() => {}}
                        className="h-4 w-4"
                      />
                      <span>{player.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
