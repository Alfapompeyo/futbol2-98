import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Primero buscamos en la tabla staff
      const { data: staffData } = await supabase
        .from('staff')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (staffData) {
        setProfile({
          email: staffData.email,
          nombre: staffData.nombre,
          apellido1: staffData.apellido1,
          apellido2: staffData.apellido2,
          role: staffData.role
        });
      }

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Cargando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

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
              <div>
                <h2 className="text-sm font-medium text-gray-500">Rol</h2>
                <p className="mt-1">{profile.role || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}