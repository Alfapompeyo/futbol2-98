import { Sidebar } from "@/components/layout/Sidebar";

export default function Physical() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Parte Física</h1>
        <p>Contenido de la parte física</p>
      </main>
    </div>
  );
}