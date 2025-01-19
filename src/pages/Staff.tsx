import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffModal } from "@/components/staff/StaffModal";
import { StaffList } from "@/components/staff/StaffList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Staff() {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [staffToEdit, setStaffToEdit] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchStaff();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: staffMember } = await supabase
      .from('staff')
      .select('is_admin')
      .eq('email', user.email)
      .single();

    if (!staffMember?.is_admin) {
      navigate('/dashboard');
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página",
      });
    }
  };

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el personal",
      });
      return;
    }
    setStaff(data);
  };

  const handleAddStaff = async (staffData: any) => {
    try {
      const { error } = await supabase
        .from('staff')
        .insert([staffData]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Personal añadido correctamente",
      });

      fetchStaff();
      setShowAddStaff(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEditStaff = async (staffData: any) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', staffData.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Personal actualizado correctamente",
      });

      fetchStaff();
      setStaffToEdit(null);
      setShowAddStaff(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId);

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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestión de Personal</h1>
          <Button
            onClick={() => {
              setStaffToEdit(null);
              setShowAddStaff(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Personal
          </Button>
        </div>

        <StaffList 
          staff={staff}
          onEdit={(staff) => {
            setStaffToEdit(staff);
            setShowAddStaff(true);
          }}
          onDelete={handleDeleteStaff}
        />

        <StaffModal
          isOpen={showAddStaff}
          onClose={() => {
            setShowAddStaff(false);
            setStaffToEdit(null);
          }}
          onSubmit={staffToEdit ? handleEditStaff : handleAddStaff}
          initialData={staffToEdit}
        />
      </main>
    </div>
  );
}