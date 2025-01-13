import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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

export function PlayerEvaluation({ categoryId, matchId, onBack }: PlayerEvaluationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, position")
      .eq("category_id", categoryId)
      .ilike("name", `%${searchQuery}%`);

    if (!error && data) {
      setPlayers(data);
    }
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
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <h3 className="font-medium">{player.name}</h3>
              {player.position && (
                <p className="text-sm text-gray-600">{player.position}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}