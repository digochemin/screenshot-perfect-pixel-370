import { createFileRoute } from "@tanstack/react-router";
import { StoryApp } from "@/components/story-app";

export const Route = createFileRoute("/isca")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Como faturar com páginas de futebol | QG do Fut" },
    { name: "description", content: "Aprenda os gatilhos, a rotina e as fontes de faturamento de uma página de futebol." },
    { property: "og:title", content: "Como faturar com páginas de futebol | QG do Fut" },
    { property: "og:description", content: "Conteúdo educativo gratuito da QG do Fut." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StoryApp,
});