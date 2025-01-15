import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreVertical, Edit, Trash, ClipboardList, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LineupModal } from "@/components/lineup/LineupModal";
import { useState } from "react";

interface Match {
  id: string;
  opponent: string;
  date: string;
  location: string | null;
  category_id: string;
}

interface MatchesListProps {
  matches: Match[];
  onEdit?: (match: Match) => void;
  onDelete?: (matchId: string) => void;
  onEvaluate?: (matchId: string) => void;
}

export function MatchesList({ matches, onEdit, onDelete, onEvaluate }: MatchesListProps) {
  const [showLineup, setShowLineup] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleEdit = (match: Match) => {
    if (onEdit) {
      onEdit(match);
    }
  };

  const handleDelete = (matchId: string) => {
    if (onDelete) {
      onDelete(matchId);
    }
  };

  const handleLineupClick = (match: Match) => {
    setSelectedMatch(match);
    setShowLineup(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Oponente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="w-[200px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.opponent}</TableCell>
                <TableCell>
                  {format(new Date(match.date), "PPP 'a las' p", { locale: es })}
                </TableCell>
                <TableCell>{match.location || "No especificada"}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEvaluate?.(match.id)}
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Evaluar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLineupClick(match)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Alineación
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(match)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(match.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMatch && (
        <LineupModal
          isOpen={showLineup}
          onClose={() => {
            setShowLineup(false);
            setSelectedMatch(null);
          }}
          matchId={selectedMatch.id}
          categoryId={selectedMatch.category_id}
        />
      )}
    </>
  );
}