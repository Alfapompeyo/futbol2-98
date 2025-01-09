import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Player {
  id: string;
  name: string;
  age?: number;
  height?: string;
  weight?: string;
  position?: string;
}

interface PlayersListProps {
  players: Player[];
}

export function PlayersList({ players }: PlayersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Altura</TableHead>
          <TableHead>Peso</TableHead>
          <TableHead>Posición</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.age}</TableCell>
            <TableCell>{player.height}</TableCell>
            <TableCell>{player.weight}</TableCell>
            <TableCell>{player.position}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}