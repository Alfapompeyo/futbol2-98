import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreVertical, Edit, Trash } from "lucide-react";
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
  );
}