import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AddCategoryButton } from "@/components/dashboard/AddCategoryButton";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { AddPlayerModal } from "@/components/modals/AddPlayerModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("categories");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [categories, setCategories] = useState([{ id: 1, name: "sub-17" }]);

  const handleAddCategory = (name: string) => {
    setCategories([...categories, { id: Date.now(), name }]);
  };

  const handleAddPlayer = (player: any) => {
    console.log("Adding player:", player);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
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
          <AddCategoryButton onClick={() => setShowAddCategory(true)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              onClick={() => setShowAddPlayer(true)}
            />
          ))}
        </div>

        <AddCategoryModal
          isOpen={showAddCategory}
          onClose={() => setShowAddCategory(false)}
          onAdd={handleAddCategory}
        />

        <AddPlayerModal
          isOpen={showAddPlayer}
          onClose={() => setShowAddPlayer(false)}
          onAdd={handleAddPlayer}
        />
      </main>
    </div>
  );
}