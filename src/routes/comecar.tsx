import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/comecar")({
  head: () => ({ meta: [
    { title: "Comece agora | QG do Fut" },
    { name: "description", content: "Deixe seu contato e aprenda como transformar futebol em faturamento." },
    { property: "og:title", content: "Comece agora | QG do Fut" },
    { property: "og:description", content: "Acesse gratuitamente o conteúdo educativo da QG do Fut." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CapturePage,
});

const teams = ["Flamengo", "Corinthians", "Palmeiras", "São Paulo", "Santos", "Vasco", "Fluminense", "Botafogo", "Grêmio", "Internacional", "Atlético-MG", "Cruzeiro", "Bahia", "Fortaleza", "Sport", "Athletico-PR", "Outro"];
const gentilic: Record<string, string> = { Flamengo: "flamenguistas", Corinthians: "corintianos", Palmeiras: "palmeirenses", "São Paulo": "são-paulinos", Santos: "santistas", Vasco: "vascaínos", Fluminense: "tricolores", Botafogo: "botafoguenses", Grêmio: "gremistas", Internacional: "colorados", "Atlético-MG": "atleticanos", Cruzeiro: "cruzeirenses", Bahia: "tricolores baianos", Fortaleza: "tricolores de aço", Sport: "rubro-negros", "Athletico-PR": "atleticanos" };

function CapturePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", team: "", other: "", consent: false });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  function phone(value: string) { const n = value.replace(/\D/g, "").slice(0, 11); return n.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2"); }
  async function submit() {
    const team = form.team === "Outro" ? form.other.trim() : form.team;
    if (!form.name.trim() || form.whatsapp.replace(/\D/g, "").length !== 11 || !/^\S+@\S+\.\S+$/.test(form.email) || !team || !form.consent) { setError("Preencha todos os campos e aceite a Política de Privacidade."); return; }
    setSending(true); setError("");
    const token = crypto.randomUUID();
    const { data: leadId, error: insertError } = await supabase.rpc("create_qg_lead", { p_nome: form.name.trim(), p_whatsapp: form.whatsapp, p_email: form.email.trim(), p_time: team, p_progress_token: token });
    if (insertError || !leadId) { setSending(false); setError("Não foi possível começar agora. Tente novamente."); return; }
    localStorage.setItem("qg-lead-session", JSON.stringify({ id: leadId, token, name: form.name.trim(), team, gentilic: gentilic[team] ?? `torcedores do ${team}` }));
    localStorage.removeItem("qg-story-progress");
    window.dispatchEvent(new CustomEvent("Lead"));
    void navigate({ to: "/isca" });
  }
  return <main className="capture-page stadium-lights"><div className="capture-wrap"><div className="story-brand"><span/><b>QG DO FUT</b><span/></div><div><span className="story-badge">CONTEÚDO GRATUITO</span><h1 className="story-title">FALTA SÓ<br/><em>UM PASSO</em></h1><p>Deixe seu contato e aprenda agora como transformar futebol em faturamento.</p></div><div className="capture-form"><label>Nome<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label><label>WhatsApp<input inputMode="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: phone(e.target.value) })} placeholder="(00) 00000-0000" autoComplete="tel" /></label><label>E-mail<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label><label>Time do coração<select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}><option value="">Selecione</option>{teams.map((team) => <option key={team}>{team}</option>)}</select></label>{form.team === "Outro" && <label>Qual time?<input value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} /></label>}<label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })}/><span>Aceito receber conteúdos da QG do Fut e concordo com a <Link to="/privacidade" target="_blank">Política de Privacidade</Link>.</span></label>{error && <p className="form-error">{error}</p>}<Button variant="game" size="lg" disabled={sending} onClick={submit}>{sending ? "ABRINDO..." : "COMEÇAR"} <ChevronRight /></Button></div></div></main>;
}