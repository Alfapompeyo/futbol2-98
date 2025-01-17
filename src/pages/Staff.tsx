import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "administrador" | "jefe_tecnico" | "entrenador" | "kinesiologo" | "medico" | "psicologo";

const roles: { value: UserRole; label: string }[] = [
  { value: "administrador", label: "Administrador" },
  { value: "jefe_tecnico", label: "Jefe Técnico" },
  { value: "entrenador", label: "Entrenador" },
  { value: "kinesiologo", label: "Kinesiólogo" },
  { value: "medico", label: "Médico" },
  { value: "psicologo", label: "Psicólogo" },
];

interface StaffMember {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  role: UserRole;
  email: string;
  password: string;
}

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>({
    nombre: "",
    apellido1: "",
    apellido2: "",
    role: "administrador",
    email: "",
    password: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStaffList(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar el personal",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from("staff")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Personal actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from("staff")
          .insert([formData]);
        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Personal agregado correctamente",
        });
      }
      setFormData({
        nombre: "",
        apellido1: "",
        apellido2: "",
        role: "administrador",
        email: "",
        password: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchStaff();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (staff: StaffMember) => {
    setFormData({
      nombre: staff.nombre,
      apellido1: staff.apellido1,
      apellido2: staff.apellido2,
      role: staff.role,
      email: staff.email,
      password: staff.password,
    });
    setEditingId(staff.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Personal eliminado correctamente",
      });
      fetchStaff();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personal</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Añadir Personal"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
              <Input
                placeholder="Apellido Paterno"
                value={formData.apellido1}
                onChange={(e) =>
                  setFormData({ ...formData, apellido1: e.target.value })
                }
              />
              <Input
                placeholder="Apellido Materno"
                value={formData.apellido2}
                onChange={(e) =>
                  setFormData({ ...formData, apellido2: e.target.value })
                }
              />
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Usuario" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="mt-4">
              {editingId ? "Actualizar" : "Guardar"}
            </Button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 p-4">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">
                    {staff.nombre} {staff.apellido1} {staff.apellido2}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {roles.find((r) => r.value === staff.role)?.label}
                  </p>
                  <p className="text-sm text-gray-500">{staff.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(staff)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(staff.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}