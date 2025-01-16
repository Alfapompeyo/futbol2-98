import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
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
            src="/lovable-uploads/676f7f09-d884-481e-b608-45b269e4aa59.png" 
            alt="Logo" 
            className="w-32 h-32"
          />
          <div className="w-full max-w-md">
            <Button 
              className="w-full h-40 text-xl bg-[#0F172A] hover:bg-[#1E293B]"
              onClick={() => navigate("/dashboard")}
            >
              Fútbol
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}