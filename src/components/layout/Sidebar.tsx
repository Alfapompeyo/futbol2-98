import { User, Gift, Activity, UserCog, LogOut, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Mi Perfil", icon: User, path: "/profile" },
  { name: "Fútbol", icon: Gift, path: "/futbol" },
  { name: "Parte Médica", icon: Activity, path: "/medical" },
  { name: "Parte Física", icon: UserCog, path: "/physical" },
  { name: "Añadir Personal", icon: UserPlus, path: "/staff" },
  { name: "Cerrar Sesión", icon: LogOut, path: "/login" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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
                : "text-gray-700 hover:bg-gray-100",
              item.name === "Cerrar Sesión" && "mt-auto"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}