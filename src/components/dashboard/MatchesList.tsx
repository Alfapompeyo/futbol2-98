import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Match {
  id: string;
  opponent: string;
  date: string;
  location: string | null;
}

interface MatchesListProps {
  matches: Match[];
}

export function MatchesList({ matches }: MatchesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Oponente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Ubicación</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}