import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EvaluationForm as EvaluationFormType, Player, positions, goalTypeOptions } from "./types";

interface EvaluationFormProps {
  evaluation: EvaluationFormType;
  player: Player;
  onUpdateEvaluation: (field: keyof EvaluationFormType, value: any) => void;
  onAddGoalType: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function EvaluationForm({
  evaluation,
  player,
  onUpdateEvaluation,
  onAddGoalType,
  onSubmit,
  onBack,
}: EvaluationFormProps) {
  const getPositionLabel = (value: string) => {
    return positions[value as keyof typeof positions] || value;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {evaluation.playedPosition ? 'Editar evaluación de ' : 'Nueva evaluación para '} 
          {player.name}
        </h3>
        <Button
          variant="ghost"
          onClick={onBack}
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
            onChange={(e) => onUpdateEvaluation('minutesPlayed', parseInt(e.target.value) || 0)}
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
            onChange={(e) => onUpdateEvaluation('yellowCards', parseInt(e.target.value) || 0)}
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
            onChange={(e) => onUpdateEvaluation('redCards', parseInt(e.target.value) || 0)}
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
              onUpdateEvaluation('goals', newGoals);
              onUpdateEvaluation('goalTypes', evaluation.goalTypes.slice(0, newGoals));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Gol ({evaluation.goalTypes.length} de {evaluation.goals})
          </label>
          <Select
            disabled={evaluation.goalTypes.length >= evaluation.goals}
            onValueChange={onAddGoalType}
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
            onChange={(e) => onUpdateEvaluation('assists', parseInt(e.target.value) || 0)}
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
            onChange={(e) => onUpdateEvaluation('saves', parseInt(e.target.value) || 0)}
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
            onChange={(e) => onUpdateEvaluation('crosses', parseInt(e.target.value) || 0)}
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
              onUpdateEvaluation('rating', Math.min(Math.max(value, 1), 7));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posición Jugada {player?.position && `(Posición habitual: ${getPositionLabel(player.position)})`}
          </label>
          <Select
            value={evaluation.playedPosition}
            onValueChange={(value) => onUpdateEvaluation('playedPosition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar posición" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(positions).map(([value, label]) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className={value === player?.position ? "font-bold" : ""}
                >
                  {label} {value === player?.position ? "(Posición habitual)" : ""}
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
          onChange={(e) => onUpdateEvaluation('comments', e.target.value)}
          placeholder="Ingrese comentarios sobre el desempeño del jugador..."
          className="min-h-[100px]"
        />
      </div>
      
      <Button 
        onClick={onSubmit}
        className="w-full bg-[#0F172A] hover:bg-[#1E293B]"
      >
        {evaluation.playedPosition ? 'Actualizar' : 'Guardar'} Evaluación
      </Button>
    </div>
  );
}