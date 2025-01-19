import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const AREAS = [
  { id: "MEDICA", label: "Parte Médica" },
  { id: "FISICA", label: "Parte Física" },
  { id: "FUTBOL", label: "Fútbol" },
];

const ROLES = [
  "administrador",
  "jefe_tecnico",
  "entrenador",
  "kinesiologo",
  "medico",
  "psicologo",
];

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function StaffModal({ isOpen, onClose, onSubmit, initialData }: StaffModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    role: "entrenador",
    email: "",
    password: "",
    areas: [] as string[],
    is_admin: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: "", // No mostramos la contraseña actual
      });
    } else {
      setFormData({
        nombre: "",
        apellido1: "",
        apellido2: "",
        role: "entrenador",
        email: "",
        password: "",
        areas: [],
        is_admin: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido1 || !formData.email || (!initialData && !formData.password)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    const submitData = {
      ...formData,
      // Solo incluimos la contraseña si es un nuevo usuario o si se ha modificado
      ...(formData.password && { password: formData.password }),
    };

    onSubmit(submitData);
  };

  const handleAreaToggle = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(areaId)
        ? prev.areas.filter(id => id !== areaId)
        : [...prev.areas, areaId],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Personal" : "Añadir Personal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido1">Apellido Paterno</Label>
              <Input
                id="apellido1"
                value={formData.apellido1}
                onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido2">Apellido Materno</Label>
            <Input
              id="apellido2"
              value={formData.apellido2}
              onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña {initialData && "(dejar en blanco para mantener la actual)"}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Áreas</Label>
            <div className="grid grid-cols-2 gap-4">
              {AREAS.map((area) => (
                <div key={area.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={area.id}
                    checked={formData.areas.includes(area.id)}
                    onCheckedChange={() => handleAreaToggle(area.id)}
                  />
                  <label
                    htmlFor={area.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {area.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_admin"
              checked={formData.is_admin}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_admin: checked as boolean })
              }
            />
            <Label htmlFor="is_admin">Es administrador</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Guardar Cambios" : "Añadir Personal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}