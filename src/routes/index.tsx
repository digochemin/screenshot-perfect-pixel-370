import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/game-app";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "Como Faturar R$ 10k com Páginas de Futebol | QG do Fut" },
    { name: "description", content: "Jogue por 5 minutos e monte seu plano personalizado para uma página de futebol." },
    { property: "og:title", content: "Como Faturar R$ 10k com Páginas de Futebol" },
    { property: "og:description", content: "Um jogo gratuito da QG do Fut para transformar paixão em estratégia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <GameApp />;
}
