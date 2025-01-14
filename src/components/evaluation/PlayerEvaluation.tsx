import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  position?: string;
  image_url?: string;
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationForm>({
    yellowCards: 0,
    redCards: 0,
    goals: 0,
    assists: 0,
  });
  const { toast } = useToast();

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, position, image_url")
      .eq("category_id", categoryId);

    if (!error && data) {
      setPlayers(data);
    }
  };

  useState(() => {
    fetchPlayers();
  }, [categoryId]);

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

    setSelectedPlayer(null);
    setEvaluation({
      yellowCards: 0,
      redCards: 0,
      goals: 0,
      assists: 0,
    });
  };

  const getPositionLabel = (value: string) => {
    const positions = {
      portero: "Portero",
      defensa_central: "Defensa Central",
      lateral_izquierdo: "Lateral Izquierdo",
      lateral_derecho: "Lateral Derecho",
      mediocampista_ofensivo: "Mediocampista Ofensivo",
      mediocampista_defensivo: "Mediocampista Defensivo",
      mediocampista_mixto: "Mediocampista Mixto",
      delantero_centro: "Delantero Centro",
      extremo_izquierdo: "Extremo Izquierdo",
      extremo_derecho: "Extremo Derecho",
    };
    return positions[value as keyof typeof positions] || value;
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

        {!selectedPlayer ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Posición</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={player.image_url} alt={player.name} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {player.position ? getPositionLabel(player.position) : ''}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      Evaluar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Evaluación para {selectedPlayer.name}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedPlayer(null)}
              >
                Volver a la lista
              </Button>
            </div>
            
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