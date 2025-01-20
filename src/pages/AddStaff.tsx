import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AddStaff() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would add the logic to create the staff member
      console.log("Form submitted:", formData);
      
      toast({
        title: "Éxito",
        description: "Personal agregado correctamente",
      });
      
      // Clear form
      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al agregar el personal",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Añadir Personal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                Nombre
              </label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="apellidoPaterno" className="block text-sm font-medium mb-1">
                Apellido Paterno
              </label>
              <Input
                id="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="apellidoMaterno" className="block text-sm font-medium mb-1">
                Apellido Materno
              </label>
              <Input
                id="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium mb-1">
                Correo
              </label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <Input
                id="contrasena"
                type="password"
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Agregar Personal
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}