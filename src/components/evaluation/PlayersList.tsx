import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Player } from "./types";
import { positions } from "./types";

interface PlayersListProps {
  players: Player[];
  evaluations: Record<string, any>;
  onSelectPlayer: (player: Player) => void;
}

export function PlayersList({ players, evaluations, onSelectPlayer }: PlayersListProps) {
  const getPositionLabel = (value: string) => {
    return positions[value as keyof typeof positions] || value;
  };

  return (
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
                onClick={() => onSelectPlayer(player)}
              >
                {evaluations[player.id] ? 'Editar' : 'Evaluar'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}