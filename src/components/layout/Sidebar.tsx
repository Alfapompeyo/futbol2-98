import { Gift, Activity, UserCog, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Fútbol", icon: Gift },
  { name: "Parte Médica", icon: Activity },
  { name: "Parte Física", icon: UserCog },
  { name: "Cerrar Sesión", icon: LogOut },
];

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <img src="/lovable-uploads/676f7f09-d884-481e-b608-45b269e4aa59.png" alt="Logo" className="w-12 h-12" />
      </div>
      <nav className="flex-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100",
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