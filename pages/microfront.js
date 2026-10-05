import dynamic from "next/dynamic";

// Se carga el componente expuesto por el microfront (Module Federation).
// ssr: false => se resuelve solo en el navegador; el microfront debe estar corriendo en :3001.
const BackendPanel = dynamic(() => import("microfront/BackendPanel"), {
  ssr: false,
  loading: () => <p>Cargando microfront...</p>,
});

export default function MicrofrontPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <BackendPanel />
    </main>
  );
}
