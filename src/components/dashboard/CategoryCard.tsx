import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus } from "lucide-react";

interface CategoryCardProps {
  name: string;
  onAddPlayer: () => void;
  onAddMatch: () => void;
  onShowPlayers: () => void;
}

export function CategoryCard({ name, onAddPlayer, onAddMatch, onShowPlayers }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full space-y-2">
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          onShowPlayers();
        }}
        className="w-full p-4 bg-[#9333EA] text-white rounded-lg hover:bg-[#7E22CE] transition-colors"
      >
        {name}
      </button>
      
      {isExpanded && (
        <div className="flex gap-2 mt-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddPlayer();
            }}
            variant="outline"
            className="flex-1 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Añadir Jugador
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddMatch();
            }}
            variant="outline"
            className="flex-1 gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Crear Partido
          </Button>
        </div>
      )}
    </div>
  );
}