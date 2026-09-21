import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Política de Privacidade | QG do Fut" },
    { name: "description", content: "Saiba como a QG do Fut trata seus dados pessoais." },
    { property: "og:title", content: "Política de Privacidade | QG do Fut" },
    { property: "og:description", content: "Transparência sobre o uso dos seus dados pela QG do Fut." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Privacy,
});

function Privacy() {
  return <main className="min-h-screen bg-background px-5 py-10 text-foreground"><div className="mx-auto max-w-2xl"><Link to="/" className="text-primary">← Voltar</Link><h1 className="mt-8 font-display text-4xl uppercase">Política de privacidade</h1><div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground"><p>A QG do Fut coleta nome, WhatsApp, e-mail e respostas do jogo para entregar seu plano e enviar conteúdos autorizados.</p><p>Seus dados não são vendidos. Eles são armazenados com segurança e usados apenas para as finalidades informadas.</p><p>Você pode solicitar acesso, correção ou exclusão dos seus dados pelos canais oficiais da QG do Fut, conforme a LGPD.</p><p>Ao usar esta experiência, você declara ter lido e compreendido esta política.</p></div></div></main>;
}