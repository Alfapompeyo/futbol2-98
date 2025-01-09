import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddPlayerModal } from "@/components/modals/AddPlayerModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  age?: number;
  height?: string;
  weight?: string;
  position?: string;
  image_url?: string;
}

interface PlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

export function PlayersList({ players, onEdit, onDelete }: PlayersListProps) {
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const getPositionLabel = (value: string) => {
    const positions = {
      portero: "Portero",
      defensa_central: "Defensa Central",
      lateral_izquierdo: "Lateral Izquierdo",
      lateral_derecho: "Lateral Derecho",
      mediocampista_ofensivo: "Mediocampista Ofensivo",
      mediocampista_defensivo: "Mediocampista Defensivo",
      mediocampista_mixto: "Mediocampista Mixto",
      delantero_centro: "Delantero Centro",
      extremo_izquierdo: "Extremo Izquierdo",
      extremo_derecho: "Extremo Derecho",
    };
    return positions[value as keyof typeof positions] || value;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Altura</TableHead>
            <TableHead>Peso</TableHead>
            <TableHead>Posición</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
              <TableCell>{player.age}</TableCell>
              <TableCell>{player.height}</TableCell>
              <TableCell>{player.weight}</TableCell>
              <TableCell>{player.position ? getPositionLabel(player.position) : ''}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPlayerToEdit(player)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setPlayerToDelete(player.id)}
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

      <AlertDialog open={!!playerToDelete} onOpenChange={() => setPlayerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El jugador será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (playerToDelete) {
                  onDelete(playerToDelete);
                  setPlayerToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddPlayerModal
        isOpen={!!playerToEdit}
        onClose={() => setPlayerToEdit(null)}
        onAdd={(updatedPlayer) => {
          if (playerToEdit) {
            onEdit({ 
              ...updatedPlayer, 
              id: playerToEdit.id,
              age: updatedPlayer.age ? parseInt(updatedPlayer.age) : undefined 
            });
            setPlayerToEdit(null);
          }
        }}
        initialData={playerToEdit || undefined}
      />
    </>
  );
}