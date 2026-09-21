import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/qg-logo-2026.jpg.asset.json";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="portal-home">
      <header className="portal-header">
        <div className="portal-header-inner">
          <Link to="/" className="portal-logo" aria-label="QG do Fut — Início">
            <img src={logoAsset.url} alt="QG do Fut" />
            <span>QG DO FUT</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="portal-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>

          <nav className={menuOpen ? "portal-nav is-open" : "portal-nav"} aria-label="Menu principal">
            <Link to="/" activeProps={{ className: "is-active" }}>Início</Link>
            <span>Mini games <small>Em breve</small></span>
            <span>Contato <small>Em breve</small></span>
          </nav>
        </div>
      </header>

      <section className="portal-main" aria-labelledby="course-title">
        <p className="portal-kicker">Conteúdo em destaque</p>
        <article className="course-banner">
          <div className="course-banner-logo" aria-hidden="true">
            <img src={logoAsset.url} alt="" />
          </div>
          <div className="course-banner-copy">
            <span>Conteúdo gratuito</span>
            <h1 id="course-title">Como faturar <mark>R$ 10K</mark> com páginas de futebol</h1>
            <p>Descubra o que os perfis que mais faturam no Brasil fazem diferente — sem precisar entender de tática, aparecer ou investir dinheiro.</p>
            <Button variant="game" size="lg" asChild className="course-banner-cta">
              <Link to="/comecar">Quero ver grátis <ArrowRight /></Link>
            </Button>
          </div>
        </article>

        <div className="portal-coming">
          <span>Próximas novidades</span>
          <p>Notícias, análises e mini games estão chegando ao QG.</p>
        </div>
      </section>

      <footer className="portal-footer">
        <b>QG DO FUT</b>
        <Link to="/privacidade">Política de Privacidade</Link>
      </footer>
    </main>
  );
}
