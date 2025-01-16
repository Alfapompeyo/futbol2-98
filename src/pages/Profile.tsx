import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking user session:", error);
      navigate("/login");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#E8F1FF] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <img 
            src="/lovable-uploads/0893c2ac-1331-47e8-b8c6-504c49064b2f.png" 
            alt="Logo" 
            className="w-32 h-32"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <Button 
              className="h-40 text-xl bg-[#0F172A] hover:bg-[#1E293B]"
              onClick={() => navigate("/dashboard")}
            >
              Fútbol
            </Button>
            <Button 
              className="h-40 text-xl bg-[#0F172A] hover:bg-[#1E293B]"
              onClick={() => toast({
                title: "Próximamente",
                description: "Esta funcionalidad estará disponible pronto",
              })}
            >
              Básquetbol
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}