import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AddCategoryButton } from "@/components/dashboard/AddCategoryButton";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { AddPlayerModal } from "@/components/modals/AddPlayerModal";
import { AddMatchModal } from "@/components/modals/AddMatchModal";
import { PlayersList } from "@/components/dashboard/PlayersList";
import { MatchesList } from "@/components/dashboard/MatchesList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("categories");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"players" | "matches">("players");
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      if (activeView === "players") {
        fetchPlayers(selectedCategory);
      } else {
        fetchMatches(selectedCategory);
      }
    }
  }, [selectedCategory, activeView]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las categorías",
      });
      return;
    }
    setCategories(data);
  };

  const fetchPlayers = async (categoryId: string) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("category_id", categoryId);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los jugadores",
      });
      return;
    }
    setPlayers(data);
  };

  const fetchMatches = async (categoryId: string) => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("category_id", categoryId)
      .order('date', { ascending: false });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los partidos",
      });
      return;
    }
    setMatches(data);
  };

  const handleEditCategory = async (categoryId: string) => {
    const categoryToEdit = categories.find(cat => cat.id === categoryId);
    if (categoryToEdit) {
      setCategoryToEdit(categoryToEdit);
      setShowAddCategory(true);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await supabase.from('players').delete().eq('category_id', categoryId);
      await supabase.from('matches').delete().eq('category_id', categoryId);
      
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      
      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });

      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
        setPlayers([]);
        setMatches([]);
      }

      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la categoría",
      });
    }
  };

  const handleAddCategory = async (name: string) => {
    if (categoryToEdit) {
      const { error } = await supabase
        .from("categories")
        .update({ name })
        .eq('id', categoryToEdit.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo actualizar la categoría",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
      setCategoryToEdit(null);
    } else {
      const { error } = await supabase.from("categories").insert([{ name }]);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo crear la categoría",
        });
        return;
      }
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
    }
    fetchCategories();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Fútbol</h1>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "categories"
                ? "bg-[#0F172A] text-white"
                : "text-gray-600"
            } rounded-lg`}
            onClick={() => setActiveTab("categories")}
          >
            Categorías
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "personal"
                ? "bg-[#0F172A] text-white"
                : "text-gray-600"
            } rounded-lg`}
            onClick={() => setActiveTab("personal")}
          >
            Personal
          </button>
        </div>

        <div className="mb-8">
          <AddCategoryButton onClick={() => {
            setCategoryToEdit(null);
            setShowAddCategory(true);
          }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              onAddPlayer={() => {
                setSelectedCategory(category.id);
                setShowAddPlayer(true);
                setActiveView("players");
              }}
              onAddMatch={() => {
                setSelectedCategory(category.id);
                setShowAddMatch(true);
              }}
              onShowPlayers={() => {
                setSelectedCategory(category.id);
                setActiveView("players");
                fetchPlayers(category.id);
              }}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-8">
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeView === "players"
                    ? "bg-[#9333EA] text-white"
                    : "text-gray-600 border border-gray-300"
                } rounded-lg`}
                onClick={() => setActiveView("players")}
              >
                Jugadores
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeView === "matches"
                    ? "bg-[#9333EA] text-white"
                    : "text-gray-600 border border-gray-300"
                } rounded-lg`}
                onClick={() => setActiveView("matches")}
              >
                Partidos
              </button>
            </div>

            {activeView === "players" && players.length > 0 && (
              <PlayersList 
                players={players} 
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
              />
            )}

            {activeView === "matches" && matches.length > 0 && (
              <MatchesList 
                matches={matches}
                onEdit={handleEditMatch}
                onDelete={handleDeleteMatch}
              />
            )}
          </div>
        )}

        <AddCategoryModal
          isOpen={showAddCategory}
          onClose={() => {
            setShowAddCategory(false);
            setCategoryToEdit(null);
          }}
          onAdd={handleAddCategory}
          initialData={categoryToEdit?.name}
        />

        <AddPlayerModal
          isOpen={showAddPlayer}
          onClose={() => setShowAddPlayer(false)}
          onAdd={handleAddPlayer}
        />

        <AddMatchModal
          isOpen={showAddMatch}
          onClose={() => setShowAddMatch(false)}
          onAdd={handleAddMatch}
        />
      </main>
    </div>
  );
}
