import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Image, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const positions = [
  { value: "portero", label: "Portero" },
  { value: "defensa_central", label: "Defensa Central" },
  { value: "lateral_izquierdo", label: "Lateral Izquierdo" },
  { value: "lateral_derecho", label: "Lateral Derecho" },
  { value: "mediocampista_ofensivo", label: "Mediocampista Ofensivo" },
  { value: "mediocampista_defensivo", label: "Mediocampista Defensivo" },
  { value: "mediocampista_mixto", label: "Mediocampista Mixto" },
  { value: "delantero_centro", label: "Delantero Centro" },
  { value: "extremo_izquierdo", label: "Extremo Izquierdo" },
  { value: "extremo_derecho", label: "Extremo Derecho" },
];

interface Player {
  name: string;
  age: string;
  height: string;
  weight: string;
  position: string;
  image_url?: string;
}

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: Player) => void;
  initialData?: {
    name: string;
    age?: number;
    height?: string;
    weight?: string;
    position?: string;
    image_url?: string;
  };
}

export function AddPlayerModal({ isOpen, onClose, onAdd, initialData }: AddPlayerModalProps) {
  const [player, setPlayer] = useState<Player>({
    name: "",
    age: "",
    height: "",
    weight: "",
    position: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setPlayer({
        name: initialData.name || "",
        age: initialData.age?.toString() || "",
        height: initialData.height || "",
        weight: initialData.weight || "",
        position: initialData.position || "",
        image_url: initialData.image_url || "",
      });
    } else {
      setPlayer({
        name: "",
        age: "",
        height: "",
        weight: "",
        position: "",
        image_url: "",
      });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/functions/v1/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error uploading image');

      const { url } = await response.json();
      setPlayer({ ...player, image_url: url });
      toast({
        title: "Éxito",
        description: "Imagen subida correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al subir la imagen",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(player);
    setPlayer({ name: "", age: "", height: "", weight: "", position: "", image_url: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Jugador" : "Añadir Jugador"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="playerImage" className="text-sm font-medium">
              Imagen
            </label>
            <div className="flex items-center gap-4">
              {player.image_url ? (
                <img 
                  src={player.image_url} 
                  alt="Player" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="playerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('playerImage')?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="playerName"
              placeholder="Nombre del jugador"
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">
              Edad
            </label>
            <Input
              id="age"
              placeholder="Edad"
              value={player.age}
              onChange={(e) => setPlayer({ ...player, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              Estatura (cm)
            </label>
            <Input
              id="height"
              placeholder="Estatura"
              value={player.height}
              onChange={(e) => setPlayer({ ...player, height: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Peso (kg)
            </label>
            <Input
              id="weight"
              placeholder="Peso"
              value={player.weight}
              onChange={(e) => setPlayer({ ...player, weight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium">
              Posición
            </label>
            <Select
              value={player.position}
              onValueChange={(value) => setPlayer({ ...player, position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una posición" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B]">
            {initialData ? "Guardar Cambios" : "Añadir Jugador"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}