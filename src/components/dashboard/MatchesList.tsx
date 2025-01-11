import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

interface Match {
  id: string;
  opponent: string;
  date: string;
  location: string | null;
}

interface MatchesListProps {
  matches: Match[];
  onEdit?: (match: Match) => void;
  onDelete?: (matchId: string) => void;
}

export function MatchesList({ matches, onEdit, onDelete }: MatchesListProps) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Oponente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
              <TableCell>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    <ContextMenuItem
                      className="cursor-pointer"
                      onClick={() => handleEdit(match)}
                    >
                      Editar partido
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(match.id)}
                    >
                      Eliminar partido
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}