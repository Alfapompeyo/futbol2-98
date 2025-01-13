import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Player {
  id: string;
  name: string;
  position?: string;
}

interface PlayerEvaluationProps {
  categoryId: string;
  matchId: string;
  onBack: () => void;
}

interface EvaluationForm {
  yellowCards: number;
  redCards: number;
  goals: number;
  assists: number;
}

export function PlayerEvaluation({ categoryId, matchId, onBack }: PlayerEvaluationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationForm>({
    yellowCards: 0,
    redCards: 0,
    goals: 0,
    assists: 0,
  });
  const { toast } = useToast();

  const fetchPlayers = async () => {
    let query = supabase
      .from("players")
      .select("id, name, position")
      .eq("category_id", categoryId);
    
    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setPlayers(data);
      setShowDropdown(true);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setSearchQuery(player.name);
    setShowDropdown(false);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedPlayer) return;

    const { error } = await supabase.from("match_statistics").insert([
      {
        match_id: matchId,
        player_id: selectedPlayer.id,
        yellow_cards: evaluation.yellowCards,
        red_cards: evaluation.redCards,
        goals: evaluation.goals,
        assists: evaluation.assists,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la evaluación",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Evaluación guardada correctamente",
    });

    // Reset form
    setSelectedPlayer(null);
    setSearchQuery("");
    setEvaluation({
      yellowCards: 0,
      redCards: 0,
      goals: 0,
      assists: 0,
    });
  };

  return (
    <div className="h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Evaluación de Jugadores</h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar jugadores..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchPlayers();
            }}
            onFocus={() => {
              fetchPlayers();
            }}
            className="pl-10"
          />
          
          {showDropdown && players.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePlayerSelect(player)}
                >
                  <div className="font-medium">{player.name}</div>
                  {player.position && (
                    <div className="text-sm text-gray-500">{player.position}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPlayer && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Evaluación para {selectedPlayer.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarjetas Amarillas
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.yellowCards}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    yellowCards: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarjetas Rojas
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.redCards}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    redCards: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goles
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.goals}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    goals: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asistencias
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.assists}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    assists: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSubmitEvaluation}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B]"
            >
              Guardar Evaluación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}