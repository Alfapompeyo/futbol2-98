interface CategoryCardProps {
  name: string;
  onClick: () => void;
}

export function CategoryCard({ name, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-[#9333EA] text-white rounded-lg hover:bg-[#7E22CE] transition-colors"
    >
      {name}
    </button>
  );
}