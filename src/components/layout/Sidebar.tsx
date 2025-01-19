import { Gift, Activity, UserCog, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const baseMenuItems = [
  { name: "Fútbol", icon: Gift, path: "/dashboard" },
  { name: "Parte Médica", icon: Activity, path: "/dashboard/medical" },
  { name: "Parte Física", icon: UserCog, path: "/dashboard/physical" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuItems, setMenuItems] = useState(baseMenuItems);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: staffMember } = await supabase
        .from('staff')
        .select('is_admin')
        .eq('email', user.email)
        .single();

      setIsAdmin(!!staffMember?.is_admin);
      
      if (staffMember?.is_admin) {
        setMenuItems([
          ...baseMenuItems,
          { name: "Personal", icon: Users, path: "/dashboard/staff" },
        ]);
      }
    }
  };

  const handleNavigation = (path: string, name: string) => {
    if (name === "Cerrar Sesión") {
      // Here you could add logout logic if needed
      navigate(path);
      return;
    }
    navigate(path);
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <img src="/lovable-uploads/0893c2ac-1331-47e8-b8c6-504c49064b2f.png" alt="Logo" className="w-12 h-12" />
      </div>
      <nav className="flex-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path, item.name)}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg",
              location.pathname === item.path
                ? "bg-[#0F172A] text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </button>
        ))}
        <button
          onClick={() => handleNavigation("/login", "Cerrar Sesión")}
          className={cn(
            "w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg mt-auto",
            "text-gray-700 hover:bg-gray-100"
          )}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}