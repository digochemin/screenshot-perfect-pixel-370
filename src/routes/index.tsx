import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
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
function HomePage() {
  return <main className="home-page stadium-lights"><section className="home-hero"><div className="story-brand"><span/><b>QG DO FUT</b><span/></div><div className="home-copy"><span className="story-badge">CONTEÚDO GRATUITO</span><h1 className="story-title">COMO FATURAR<br/><em>R$ 10K</em><br/>COM PÁGINAS<br/>DE FUTEBOL</h1><p>O que os perfis que mais faturam no Brasil fazem diferente — e por que <span className="story-mark">não tem nada a ver</span> com entender de tática, aparecer ou ter dinheiro pra investir.</p></div><Button variant="game" size="lg" asChild className="home-cta"><Link to="/comecar">QUERO VER GRÁTIS <ChevronRight /></Link></Button><footer><b>QG DO FUT</b><Link to="/privacidade">Política de Privacidade</Link></footer></section></main>;
}
