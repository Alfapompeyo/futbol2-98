import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AddCategoryButton } from "@/components/dashboard/AddCategoryButton";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { AddPlayerModal } from "@/components/modals/AddPlayerModal";
import { AddMatchModal } from "@/components/modals/AddMatchModal";
import { AddSeasonModal } from "@/components/modals/AddSeasonModal";
import { PlayersList } from "@/components/dashboard/PlayersList";
import { MatchesList } from "@/components/dashboard/MatchesList";
import { PlayerEvaluation } from "@/components/evaluation/PlayerEvaluation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"players" | "matches">("players");
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: string; name: string } | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSeason, setSelectedSeason] = useState<{ id: string; name: string } | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*") as { data: Array<{ id: string; name: string }> | null; error: any };
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las categorías",
      });
      return;
    }
    setCategories(data || []);
  };

  const fetchPlayers = async (categoryId: string) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("category_id", categoryId) as { data: any[] | null; error: any };
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los jugadores",
      });
      return;
    }
    setPlayers(data || []);
  };

  const fetchMatches = async (categoryId: string) => {
    const query = supabase
      .from("matches")
      .select("*")
      .eq("category_id", categoryId)
      .order('date', { ascending: false });

    if (selectedSeason) {
      query.eq("season_id", selectedSeason.id);
    }

    const { data, error } = await query;
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los partidos",
      });
      return;
    }
    setMatches(data || []);
  };

  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las temporadas",
      });
      return;
    }
    setSeasons(data || []);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setPlayers([]);
    setMatches([]);
    setActiveTab("categories");
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

  const handleAddPlayer = async (playerData: any) => {
    try {
      const { error } = await supabase
        .from("players")
        .insert([{ ...playerData, category_id: selectedCategory }]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Jugador añadido correctamente",
      });

      if (selectedCategory) {
        fetchPlayers(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir el jugador",
      });
    }
  };

  const handleEditPlayer = async (playerData: any) => {
    try {
      const { error } = await supabase
        .from("players")
        .update(playerData)
        .eq('id', playerData.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Jugador actualizado correctamente",
      });

      if (selectedCategory) {
        fetchPlayers(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el jugador",
      });
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Jugador eliminado correctamente",
      });

      if (selectedCategory) {
        fetchPlayers(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el jugador",
      });
    }
  };

  const handleAddMatch = async (matchData: any) => {
    try {
      const { error } = await supabase
        .from("matches")
        .insert([{ ...matchData, category_id: selectedCategory, season_id: selectedSeason?.id }]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Partido añadido correctamente",
      });

      if (selectedCategory) {
        fetchMatches(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir el partido",
      });
    }
  };

  const handleEditMatch = async (matchData: any) => {
    try {
      const { error } = await supabase
        .from("matches")
        .update(matchData)
        .eq('id', matchData.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Partido actualizado correctamente",
      });

      if (selectedCategory) {
        fetchMatches(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el partido",
      });
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Partido eliminado correctamente",
      });

      if (selectedCategory) {
        fetchMatches(selectedCategory);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el partido",
      });
    }
  };

  const handleEvaluateMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setShowEvaluation(true);
  };

  const handleAddSeason = async (seasonData: { name: string }) => {
    try {
      const { error } = await supabase
        .from("seasons")
        .insert([seasonData]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Temporada creada correctamente",
      });

      fetchSeasons();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la temporada",
      });
    }
  };

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedSeason) {
      fetchMatches(selectedCategory);
    }
  }, [selectedCategory, selectedSeason]);

  const handleSeasonSelect = async (season: { id: string; name: string }) => {
    setSelectedSeason(season);
    if (selectedCategory) {
      await fetchMatches(selectedCategory);
    }
  };

  if (showEvaluation && selectedCategory && selectedMatchId) {
    return (
      <PlayerEvaluation
        categoryId={selectedCategory}
        matchId={selectedMatchId}
        onBack={() => {
          setShowEvaluation(false);
          setSelectedMatchId(null);
        }}
      />
    );
  }

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;

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
            onClick={() => {
              setActiveTab("categories");
              setSelectedCategory(null);
            }}
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

        {activeTab === "categories" && !selectedCategory && (
          <>
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
          </>
        )}

        {selectedCategory && (
          <div className="mt-8">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver
            </button>

            {selectedCategoryName && (
              <h2 className="text-2xl font-bold mb-6">{selectedCategoryName}</h2>
            )}

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

            {activeView === "players" && (
              <div className="space-y-4">
                <Button
                  onClick={() => setShowAddPlayer(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Añadir Jugador
                </Button>
                {players.length > 0 && (
                  <PlayersList 
                    players={players} 
                    onEdit={handleEditPlayer}
                    onDelete={handleDeletePlayer}
                  />
                )}
              </div>
            )}

            {activeView === "matches" && (
              <div className="space-y-4">
                <div className="flex gap-4 items-center mb-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-48">
                        {selectedSeason ? selectedSeason.name : "Seleccionar Temporada"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {seasons.map((season) => (
                        <DropdownMenuItem
                          key={season.id}
                          onClick={() => handleSeasonSelect(season)}
                        >
                          {season.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => setShowAddSeason(true)}
                        className="text-blue-600"
                      >
                        + Crear Temporada
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {selectedSeason && (
                  <>
                    <Button
                      onClick={() => setShowAddMatch(true)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Crear Partido
                    </Button>
                    {matches.length > 0 && (
                      <MatchesList 
                        matches={matches}
                        onEdit={handleEditMatch}
                        onDelete={handleDeleteMatch}
                        onEvaluate={handleEvaluateMatch}
                      />
                    )}
                  </>
                )}
              </div>
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
          seasonId={selectedSeason?.id || ""}
        />

        <AddSeasonModal
          isOpen={showAddSeason}
          onClose={() => setShowAddSeason(false)}
          onAdd={handleAddSeason}
        />
      </main>
    </div>
  );
}
