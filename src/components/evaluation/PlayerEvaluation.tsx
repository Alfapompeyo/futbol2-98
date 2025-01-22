import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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
  goalTypes: string[];
  assists: number;
  minutesPlayed: number;
  saves: number;
  crosses: number;
  rating: number;
  comments: string;
  playedPosition: string;
}

interface PlayerEvaluation {
  id: string;
  yellow_cards: number;
  red_cards: number;
  goals: number;
  goal_types: { type: string }[];
  assists: number;
  minutes_played: number;
  saves: number;
  crosses: number;
  rating: number;
  comments: string;
  player_id: string;
  played_position: string;
}

const goalTypeOptions = [
  { value: "header", label: "De cabeza" },
  { value: "penalty", label: "De penal" },
  { value: "outside_box", label: "Fuera del área con pie" },
  { value: "inside_box", label: "Dentro del área con pie" },
];

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

export function PlayerEvaluation({ categoryId, matchId, onBack }: PlayerEvaluationProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationForm>({
    yellowCards: 0,
    redCards: 0,
    goals: 0,
    goalTypes: [],
    assists: 0,
    minutesPlayed: 0,
    saves: 0,
    crosses: 0,
    rating: 1,
    comments: "",
    playedPosition: "",
  });
  const [evaluations, setEvaluations] = useState<Record<string, PlayerEvaluation>>({});
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

  const fetchEvaluations = async () => {
    const { data, error } = await supabase
      .from("match_statistics")
      .select("*")
      .eq("match_id", matchId);

    if (!error && data) {
      const evaluationsMap: Record<string, PlayerEvaluation> = {};
      data.forEach((evaluation) => {
        evaluationsMap[evaluation.player_id] = {
          ...evaluation,
          goal_types: Array.isArray(evaluation.goal_types) 
            ? evaluation.goal_types.map((gt: any) => ({ type: gt.type })) 
            : []
        };
      });
      setEvaluations(evaluationsMap);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchEvaluations();
  }, [categoryId, matchId]);

  const handleAddGoalType = (value: string) => {
    if (evaluation.goalTypes.length < evaluation.goals) {
      setEvaluation({
        ...evaluation,
        goalTypes: [...evaluation.goalTypes, value]
      });
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedPlayer) return;

    const formattedGoalTypes = evaluation.goalTypes.map(type => ({ type }));
    const existingEvaluation = evaluations[selectedPlayer.id];

    const evaluationData = {
      match_id: matchId,
      player_id: selectedPlayer.id,
      yellow_cards: evaluation.yellowCards,
      red_cards: evaluation.redCards,
      goals: evaluation.goals,
      goal_types: formattedGoalTypes,
      assists: evaluation.assists,
      minutes_played: evaluation.minutesPlayed,
      saves: evaluation.saves,
      crosses: evaluation.crosses,
      rating: evaluation.rating,
      comments: evaluation.comments,
      played_position: evaluation.playedPosition,
    };

    console.log('Saving evaluation:', evaluationData);

    try {
      let error;
      if (existingEvaluation) {
        const { error: updateError } = await supabase
          .from("match_statistics")
          .update(evaluationData)
          .eq('id', existingEvaluation.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("match_statistics")
          .insert([evaluationData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving evaluation:', error);
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

      await fetchEvaluations();
      setSelectedPlayer(null);
      setEvaluation({
        yellowCards: 0,
        redCards: 0,
        goals: 0,
        goalTypes: [],
        assists: 0,
        minutesPlayed: 0,
        saves: 0,
        crosses: 0,
        rating: 1,
        comments: "",
        playedPosition: "",
      });
    } catch (error) {
      console.error('Error in evaluation submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al guardar la evaluación",
      });
    }
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    const existingEvaluation = evaluations[player.id];
    
    if (existingEvaluation) {
      setEvaluation({
        yellowCards: existingEvaluation.yellow_cards || 0,
        redCards: existingEvaluation.red_cards || 0,
        goals: existingEvaluation.goals || 0,
        goalTypes: existingEvaluation.goal_types?.map(gt => gt.type) || [],
        assists: existingEvaluation.assists || 0,
        minutesPlayed: existingEvaluation.minutes_played || 0,
        saves: existingEvaluation.saves || 0,
        crosses: existingEvaluation.crosses || 0,
        rating: existingEvaluation.rating || 1,
        comments: existingEvaluation.comments || "",
        playedPosition: existingEvaluation.played_position || "",
      });
    } else {
      setEvaluation({
        yellowCards: 0,
        redCards: 0,
        goals: 0,
        goalTypes: [],
        assists: 0,
        minutesPlayed: 0,
        saves: 0,
        crosses: 0,
        rating: 1,
        comments: "",
        playedPosition: "",
      });
    }
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
                      onClick={() => handleSelectPlayer(player)}
                    >
                      {evaluations[player.id] ? 'Editar' : 'Evaluar'}
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
                {evaluations[selectedPlayer.id] ? 'Editar evaluación de ' : 'Nueva evaluación para '} 
                {selectedPlayer.name}
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
                  Minutos Jugados
                </label>
                <Input
                  type="number"
                  min="0"
                  max="90"
                  value={evaluation.minutesPlayed}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    minutesPlayed: parseInt(e.target.value) || 0
                  })}
                />
              </div>

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
                  onChange={(e) => {
                    const newGoals = parseInt(e.target.value) || 0;
                    setEvaluation({
                      ...evaluation,
                      goals: newGoals,
                      goalTypes: evaluation.goalTypes.slice(0, newGoals)
                    });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Gol ({evaluation.goalTypes.length} de {evaluation.goals})
                </label>
                <Select
                  disabled={evaluation.goalTypes.length >= evaluation.goals}
                  onValueChange={handleAddGoalType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {evaluation.goalTypes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {evaluation.goalTypes.map((type, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                        {goalTypeOptions.find(opt => opt.value === type)?.label}
                      </span>
                    ))}
                  </div>
                )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atajadas
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.saves}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    saves: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centros
                </label>
                <Input
                  type="number"
                  min="0"
                  value={evaluation.crosses}
                  onChange={(e) => setEvaluation({
                    ...evaluation,
                    crosses: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación (1-7)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={evaluation.rating}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setEvaluation({
                      ...evaluation,
                      rating: Math.min(Math.max(value, 1), 7)
                    });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posición Jugada
                </label>
                <Select
                  value={evaluation.playedPosition}
                  onValueChange={(value) => setEvaluation({
                    ...evaluation,
                    playedPosition: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(positions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios
              </label>
              <Textarea
                value={evaluation.comments}
                onChange={(e) => setEvaluation({
                  ...evaluation,
                  comments: e.target.value
                })}
                placeholder="Ingrese comentarios sobre el desempeño del jugador..."
                className="min-h-[100px]"
              />
            </div>
            
            <Button 
              onClick={handleSubmitEvaluation}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B]"
            >
              {evaluations[selectedPlayer.id] ? 'Actualizar' : 'Guardar'} Evaluación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
