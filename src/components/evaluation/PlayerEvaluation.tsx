import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlayersList } from "./PlayersList";
import { EvaluationForm } from "./EvaluationForm";
import { Player, EvaluationForm as EvaluationFormType, PlayerEvaluation as PlayerEvaluationType } from "./types";

interface PlayerEvaluationProps {
  categoryId: string;
  matchId: string;
  onBack: () => void;
}

export function PlayerEvaluation({ categoryId, matchId, onBack }: PlayerEvaluationProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationFormType>({
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
  const [evaluations, setEvaluations] = useState<Record<string, PlayerEvaluationType>>({});
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

    if (error) {
      console.error('Error fetching evaluations:', error);
      return;
    }

    if (data) {
      const evaluationsMap: Record<string, PlayerEvaluationType> = {};
      data.forEach((evaluation) => {
        evaluationsMap[evaluation.player_id] = evaluation;
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

  const handleUpdateEvaluation = (field: keyof EvaluationFormType, value: any) => {
    setEvaluation(prev => ({
      ...prev,
      [field]: value
    }));
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

    try {
      let response;
      
      if (existingEvaluation) {
        response = await supabase
          .from("match_statistics")
          .update(evaluationData)
          .eq('id', existingEvaluation.id)
          .select()
          .single();
      } else {
        response = await supabase
          .from("match_statistics")
          .insert([evaluationData])
          .select()
          .single();
      }

      if (response.error) {
        throw response.error;
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
        playedPosition: existingEvaluation.played_position || player.position || "",
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
        playedPosition: player.position || "",
      });
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

        {!selectedPlayer ? (
          <PlayersList
            players={players}
            evaluations={evaluations}
            onSelectPlayer={handleSelectPlayer}
          />
        ) : (
          <EvaluationForm
            evaluation={evaluation}
            player={selectedPlayer}
            onUpdateEvaluation={handleUpdateEvaluation}
            onAddGoalType={handleAddGoalType}
            onSubmit={handleSubmitEvaluation}
            onBack={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
}