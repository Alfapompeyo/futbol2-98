import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface StaffListProps {
  staff: any[];
  onEdit: (staff: any) => void;
  onDelete: (id: string) => void;
}

export function StaffList({ staff, onEdit, onDelete }: StaffListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Áreas</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.nombre}</TableCell>
              <TableCell>{`${member.apellido1} ${member.apellido2 || ''}`}</TableCell>
              <TableCell className="capitalize">{member.role.replace('_', ' ')}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.areas?.join(', ') || '-'}</TableCell>
              <TableCell>{member.is_admin ? 'Sí' : 'No'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(member)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}