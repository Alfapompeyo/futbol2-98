import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userEmail } = await supabase
          .from('user_emails')
          .select('id, email')
          .limit(1)
          .maybeSingle();

        if (userEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userEmail.id)
            .maybeSingle();

          setProfile({ ...profile, email: userEmail.email });
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
        {profile && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Correo Electrónico</h2>
                <p className="mt-1">{profile.email}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Nombre</h2>
                <p className="mt-1">{profile.nombre || '-'}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Apellido Paterno</h2>
                <p className="mt-1">{profile.apellido1 || '-'}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Apellido Materno</h2>
                <p className="mt-1">{profile.apellido2 || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}