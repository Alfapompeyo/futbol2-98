import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddCategoryButtonProps {
  onClick: () => void;
}

export function AddCategoryButton({ onClick }: AddCategoryButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="bg-[#0F172A] text-white hover:bg-[#1E293B] gap-2"
    >
      <Plus className="w-4 h-4" />
      Añadir Categoría
    </Button>
  );
}