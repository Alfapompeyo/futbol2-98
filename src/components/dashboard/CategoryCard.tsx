import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryCardProps {
  name: string;
  onAddPlayer: () => void;
  onAddMatch: () => void;
  onShowPlayers: () => void;
  onEdit?: (categoryId: string) => void;
  onDelete?: (categoryId: string) => void;
  id: string;
}

export function CategoryCard({ 
  name, 
  onAddPlayer, 
  onAddMatch, 
  onShowPlayers,
  onEdit,
  onDelete,
  id 
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            onShowPlayers();
          }}
          className="w-full p-4 bg-[#9333EA] text-white rounded-lg hover:bg-[#7E22CE] transition-colors"
        >
          {name}
        </button>
        
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-[#7E22CE]">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit && onEdit(id)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete && onDelete(id)}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
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