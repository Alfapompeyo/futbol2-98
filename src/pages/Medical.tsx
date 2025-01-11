import { Sidebar } from "@/components/layout/Sidebar";

export default function Medical() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Parte Médica</h1>
        <p>Contenido de la parte médica</p>
      </main>
    </div>
  );
}