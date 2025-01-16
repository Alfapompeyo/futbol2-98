import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  nombre: string | null;
  apellido1: string | null;
  apellido2: string | null;
  usuario: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Primero obtenemos el email del usuario actual
        const { data: userEmail, error: userError } = await supabase
          .from('user_emails')
          .select('id, email')
          .limit(1)
          .maybeSingle();

        if (userError) throw userError;

        if (userEmail) {
          // Luego obtenemos el perfil asociado a ese usuario
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userEmail.id)
            .maybeSingle();

          if (profileError) throw profileError;
          setProfile(profileData);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al cargar el perfil",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#E8F1FF]">
        <h1 className="text-2xl font-bold mb-8">Mi Perfil</h1>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-2xl font-bold text-center">
              Información Personal
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-lg">{profile?.nombre || 'No especificado'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Apellido Paterno</p>
                <p className="text-lg">{profile?.apellido1 || 'No especificado'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Apellido Materno</p>
                <p className="text-lg">{profile?.apellido2 || 'No especificado'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Usuario</p>
                <p className="text-lg">{profile?.usuario || 'No especificado'}</p>
              </div>
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({
                    title: "Próximamente",
                    description: "La función de editar contraseña estará disponible pronto",
                  })}
                >
                  Editar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}