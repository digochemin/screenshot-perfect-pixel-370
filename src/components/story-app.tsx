import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, Eye, Flag, MessageCircle, Save, Share2, ShoppingCart, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Trigger = "Polêmica" | "Nostalgia" | "Revelação" | "Pertencimento";
type LeadSession = { id: string; token: string; name: string; team: string; gentilic: string };
type AnswerMap = Record<string, boolean>;

const OFFER_URL = "https://instagram.com";
const OFFER_LABEL = "QUERO O MÉTODO COMPLETO →";
const triggerColors: Record<Trigger, string> = {
  Polêmica: "bg-polemica",
  Nostalgia: "bg-nostalgia",
  Revelação: "bg-revelacao",
  Pertencimento: "bg-pertencimento",
};

const rounds = [
  {
    news: "O [TIME] perdeu o clássico no domingo.",
    goal: "Fazer o algoritmo entregar seu post pro máximo de pessoas hoje.",
    correct: 0,
    options: [
      ["Polêmica", "Não foi o juiz. Foi o técnico. E eu explico por quê."],
      ["Nostalgia", "Lembra quando a gente ganhava esse clássico de goleada?"],
      ["Revelação", "O dado que explica a derrota: só 3 finalizações no gol."],
      ["Pertencimento", "Perdeu, mas é o meu time. Nunca vou largar."],
    ],
    why: "Alcance vem de comentário, e comentário vem de discordância. Depois de uma derrota, todo mundo tem uma opinião sobre o culpado. A polêmica dá pra essa torcida um motivo pra responder.",
  },
  {
    news: "Hoje faz aniversário de um título histórico do [TIME].",
    goal: "Fazer as pessoas chamarem os amigos pro seu post.",
    correct: 0,
    options: [
      ["Nostalgia", "Onde você estava quando esse título veio? Marca quem estava com você."],
      ["Polêmica", "Sendo honesto: esse título teve mais sorte que competência."],
      ["Revelação", "O bastidor que quase impediu esse título."],
      ["Pertencimento", "Tem clube que tem torcida. O [TIME] tem [GENTÍLICO]."],
    ],
    why: "Marcação acontece quando a pessoa lembra de quem estava com ela. A nostalgia puxa a memória, e a memória puxa o amigo. Cada marcação leva seu post pra alguém novo.",
  },
  {
    news: "O [TIME] vendeu um jogador da base para a Europa.",
    goal: "Criar um post que as pessoas salvem e usem numa discussão.",
    correct: 0,
    options: [
      ["Revelação", "Quanto o [TIME] já faturou vendendo jogadores da base nos últimos 5 anos. Os números assustam."],
      ["Polêmica", "Vendeu barato. Diretoria amadora."],
      ["Nostalgia", "Lembra do primeiro gol dele no profissional?"],
      ["Pertencimento", "Cria da base é orgulho. Vai com a gente no coração."],
    ],
    why: "Ninguém salva opinião. As pessoas salvam informação que não tinham — número, bastidor, dado. É munição pra próxima discussão. E salvamento faz o algoritmo continuar entregando seu post por dias.",
  },
  {
    news: "Os rivais estão zoando o [TIME] depois de uma eliminação.",
    goal: "Fazer os torcedores levarem seu post pros stories deles.",
    correct: 0,
    options: [
      ["Pertencimento", "Podem zoar. A gente continua lotando o estádio."],
      ["Polêmica", "A eliminação foi merecida. O time não jogou nada."],
      ["Nostalgia", "Da última vez que zoaram a gente, terminou em título."],
      ["Revelação", "O motivo real da eliminação que ninguém está falando."],
    ],
    why: "Na hora da zoeira, o torcedor quer uma resposta pronta. Ele compartilha o post que diz o que ele queria dizer. Seu post vira a bandeira dele, e sua página vai junto pros stories de toda a torcida.",
  },
] as const;

const triggerCards = [
  ["Polêmica", "a opinião que divide", "COMENTÁRIOS", "O post que faz metade concordar e metade xingar é o que mais entrega. Porque comentário é o sinal mais forte pro algoritmo, e discordância gera comentário como nada mais.", ["Ele nunca foi craque. Foi bem aproveitado.", "Esse título valeu mais que a Libertadores. E eu explico.", "3 jogadores que a torcida venera e não mereciam."]],
  ["Nostalgia", "o que a pessoa viveu", "MARCAÇÕES", "Futebol é memória afetiva. Quando você reativa uma lembrança, a pessoa não só curte: ela marca alguém que viveu aquilo junto com ela. E marcação é crescimento de graça.", ["Se você lembra desse uniforme, você é mais velho do que admite.", "O gol que fez seu pai gritar na sala.", "2009. Você estava fazendo o quê?"]],
  ["Revelação", "o que ela não sabia", "SALVAMENTOS", "Informação nova, bastidor, número que surpreende. Esse é o gatilho do salvamento: a pessoa guarda o post pra ver depois ou pra usar numa discussão. Salvamento pesa muito na entrega.", ["O motivo real da saída dele. Nunca foi o salário.", "O contrato tinha uma cláusula que ninguém leu.", "Quanto o clube gastou nos últimos 5 anos — e o que sobrou disso."]],
  ["Pertencimento", "o que ela compartilha pra defender o time", "COMPARTILHAMENTOS", "Esse é o gatilho do compartilhamento. A pessoa reposta não porque o conteúdo é bom, mas porque ele fala por ela. Ela usa seu post como bandeira.", ["Só quem é [TIME] entende.", "Podem falar o que quiserem: esse é o maior do Nordeste.", "Marca aí um torcedor que sofreu com a gente em 2017."]],
] as const;

function fire(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function personalize(text: string, lead: LeadSession) {
  return text.replaceAll("[TIME]", lead.team).replaceAll("[time]", lead.team).replaceAll("[GENTÍLICO]", lead.gentilic);
}

function Mark({ children }: { children: React.ReactNode }) {
  return <span className="story-mark">{children}</span>;
}

function Header({ screen }: { screen: number }) {
  return <><div className="story-brand"><span /><b>QG DO FUT</b><span /></div><footer className="story-footer"><b>QG DO FUT</b><span>{String(screen).padStart(2, "0")}</span></footer></>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <motion.h2 initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }} className="story-title">{children}</motion.h2>;
}

function Sequence({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .2 } } }} className={className}>{Array.isArray(children) ? children.map((child, i) => <motion.div key={i} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>{child}</motion.div>) : children}</motion.div>;
}

function Why({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="why-panel"><b>POR QUE</b><p>{children}</p></motion.div>;
}

function Choice({ children, state, onClick }: { children: React.ReactNode; state?: "right" | "wrong" | undefined; onClick: () => void }) {
  return <Button variant="outline" onClick={onClick} className={`story-choice ${state === "right" ? "is-right" : state === "wrong" ? "is-wrong" : ""}`}>{children}{state === "right" && <Check />}{state === "wrong" && <span>×</span>}</Button>;
}

export function StoryApp() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [lead, setLead] = useState<LeadSession | null>(null);
  const [screen, setScreen] = useState(1);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [ticket, setTicket] = useState<number | null>(null);
  const [hint, setHint] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const raw = localStorage.getItem("qg-lead-session");
    if (!raw) { void navigate({ to: "/comecar", replace: true }); return; }
    try {
      const parsed = JSON.parse(raw) as LeadSession;
      if (!parsed.id || !parsed.token) throw new Error("invalid");
      setLead(parsed);
      const progress = JSON.parse(localStorage.getItem("qg-story-progress") ?? "{}") as { screen?: number; answers?: AnswerMap; ticket?: number };
      setScreen(Math.min(31, Math.max(1, progress.screen ?? 1)));
      setAnswers(progress.answers ?? {});
      setTicket(progress.ticket ?? null);
    } catch { localStorage.removeItem("qg-lead-session"); void navigate({ to: "/comecar", replace: true }); }
  }, [navigate]);

  useEffect(() => {
    if (!lead) return;
    localStorage.setItem("qg-story-progress", JSON.stringify({ screen, answers, ticket }));
    fire("ViuTela", { numero: screen });
    const timer = window.setTimeout(() => {
      void supabase.rpc("update_lead_story_progress", {
        p_lead_id: lead.id,
        p_progress_token: lead.token,
        p_tela_maxima: screen,
        p_acertos: answers,
        p_ticket_escolhido: ticket ?? 0,
        p_concluiu: screen === 31,
      });
    }, 300);
    if (screen === 31) fire("ConcluiuIsca");
    return () => window.clearTimeout(timer);
  }, [answers, lead, screen, ticket]);

  const locked = [5, 14, 15, 16, 17, 22, 23, 29].includes(screen) && selected[screen] === undefined && !(screen === 29 && ticket);
  function go(delta: number) {
    if (delta > 0 && (locked || screen === 31)) return;
    setHint(false); setDirection(delta); setScreen((value) => Math.max(1, Math.min(31, value + delta)));
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "ArrowRight") go(1); if (event.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });
  function answer(index: number, correct: number) {
    if (selected[screen] !== undefined) return;
    const right = index === correct;
    setSelected((old) => ({ ...old, [screen]: index }));
    setAnswers((old) => ({ ...old, [String(screen)]: right }));
    fire("Respondeu", { numero: screen, acertou: right });
  }

  const body = useMemo(() => lead ? renderScreen(screen, lead, selected, answer, answers, ticket, setTicket) : null, [answers, lead, screen, selected, ticket]);
  if (!lead) return <main className="min-h-[100dvh] bg-background" />;
  return <main className="story-shell">
    <div className="story-progress" aria-label={`Tela ${screen} de 31`}>{Array.from({ length: 31 }, (_, i) => <span key={i} className={i < screen ? "active" : ""} />)}</div>
    <div className="story-tap story-tap-left" onClick={() => go(-1)} aria-hidden="true" />
    <div className="story-tap story-tap-right" onClick={() => go(1)} aria-hidden="true" />
    <AnimatePresence mode="wait" custom={direction}>
      <motion.article key={screen} custom={direction} initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 60 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -60 }} transition={{ duration: .35 }} className={`story-screen story-screen-${screen} ${[1, 5, 6, 12, 13, 14, 15, 16, 17, 18, 22, 23, 29, 30, 31].includes(screen) ? "story-dark" : "story-cream"}`}>
        <Header screen={screen} />
        <div className="story-content">{body}</div>
      </motion.article>
    </AnimatePresence>
    {hint && screen === 1 && <div className="story-hint">Toque para avançar →</div>}
  </main>;
}

function renderScreen(screen: number, lead: LeadSession, selected: Record<number, number>, answer: (index: number, correct: number) => void, answers: AnswerMap, ticket: number | null, setTicket: (value: number) => void) {
  if (screen === 1) return <div className="cover-copy"><span className="story-badge">CONTEÚDO GRATUITO</span><Title>COMO FATURAR<br/><em>R$ 10K</em><br/>COM PÁGINAS<br/>DE FUTEBOL</Title><p>O que os perfis que mais faturam no Brasil fazem diferente — e por que <Mark>não tem nada a ver</Mark> com entender de tática, aparecer ou ter dinheiro pra investir.</p></div>;
  if (screen === 2) return <><Title><Mark>POR QUE</Mark><br/>FUTEBOL É O MELHOR NICHO DO <Mark>BRASIL</Mark></Title><p>Existe um motivo pelo qual página de futebol cresce mais rápido que quase qualquer outro nicho no Brasil: futebol gera a única emoção que o algoritmo realmente premia — <Mark>a discordância</Mark>.</p><div className="phone-mock"><b>AQUI O FUTEBOL NUNCA PARA</b><div><strong>12,4 mil</strong> curtidas · <strong>1,8 mil</strong> comentários</div>{["Discordo totalmente!", "Meu time é gigante! 🔥", "Superestimado demais...", "Melhor conteúdo de futebol! 👏"].map((x) => <span key={x}>{x}</span>)}</div></>;
  if (screen === 3) return <Sequence className="story-center"><p className="story-quote">“Ninguém comenta em post de paisagem. Todo mundo comenta em post que diz que o ídolo do time dele é superestimado.”</p><p>E é isso que as plataformas medem. Instagram, TikTok e YouTube não entregam o que é bonito. Eles entregam o que prende, o que faz parar o dedo, o que faz a pessoa responder. Futebol faz isso naturalmente, todo dia, o ano inteiro.</p></Sequence>;
  if (screen === 4) return <><Title>Some a isso três coisas que nenhum outro nicho tem junto:</Title><Sequence className="number-list">{[["NUNCA ACABA.", "Tem jogo, tem mercado da bola, tem polêmica de arbitragem, tem lesão, tem convocação. Assunto renovado sem você precisar inventar nada."], ["A TORCIDA É IDENTIDADE.", "A pessoa não “gosta” do time. Ela é do time. Quando você fala do clube dela, você está falando dela. E ela defende, compartilha, briga nos comentários."], ["TEM DINHEIRO CIRCULANDO.", "Marcas, apps, lojas de camisa e o mercado de apostas disputam essa audiência. Onde tem torcedor, tem anunciante."]].map(([title, text], i) => <div key={title}><i>{i + 1}</i><p><b>{title}</b> {text}</p></div>)}</Sequence></>;
  if (screen === 5) { const pick = selected[5]; return <><div className="practice-heading"><span className="story-badge">SUA VEZ</span><strong>TOQUE EM UMA RESPOSTA</strong></div><Title>Duas páginas postaram no mesmo dia. Qual post teve mais comentários?</Title><div className="post-grid"><Choice onClick={() => answer(0, 1)} state={pick === undefined ? undefined : "wrong"}><span><small>POST A</small>Que noite linda no estádio 🌙{pick !== undefined && <b>38 curtidas · 2 comentários</b>}</span></Choice><Choice onClick={() => answer(1, 1)} state={pick === undefined ? undefined : "right"}><span><small>POST B</small>O {lead.team} tem o elenco mais superestimado do Brasil. Podem vir.{pick !== undefined && <b>2.400 curtidas · 860 comentários</b>}</span></Choice></div>{pick !== undefined && <Why>{pick === 0 && <>A maioria das pessoas escolhe o A — e é exatamente por isso que a maioria das páginas não cresce. </>}O post A é mais bonito. O post B é mais provocante. Bonito ganha curtida; provocante ganha comentário. E comentário é o que faz o algoritmo levar seu post pra quem ainda não te segue.</Why>}</>; }
  if (screen === 6) return <Sequence className="story-center story-big"><p>Por isso a ordem certa é essa: primeiro você aprende a provocar reação.</p><p className="text-primary">O dinheiro é consequência.</p><p>É o que você vai ver nas próximas telas.</p></Sequence>;
  if (screen === 7) return <><Title>OS 4 GATILHOS QUE FAZEM<br/><Mark>CONTEÚDO DE FUTEBOL EXPLODIR</Mark></Title><p>Conteúdo de futebol não viraliza por sorte. Viraliza quando aciona um destes quatro gatilhos. Decore eles — é o que separa a página que cresce da que posta no vazio.</p><div className="trigger-icons">{([MessageCircle, Trophy, Save, Users] as const).map((Icon, i) => <motion.i key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: i * .2 }} className={Object.values(triggerColors)[i]}><Icon /></motion.i>)}</div></>;
  if (screen >= 8 && screen <= 11) { const card = triggerCards[screen - 8] ?? triggerCards[0]; const name = card[0] as Trigger; return <div className="trigger-card"><div className={triggerColors[name]}><span>{screen - 7}</span><h2>{name}</h2><small>{card[1]}</small></div><p>{card[3]}</p><b className={`reaction ${triggerColors[name]}`}>GERA: {card[2]}</b><ul>{card[4].map((x) => <li key={x}>{personalize(x, lead)}</li>)}</ul>{screen === 8 && <aside>⚠️ Polêmica não é ofensa. Opinião forte sobre jogador, escalação e decisão de jogo funciona. Ataque pessoal, família e questões que não têm a ver com futebol destroem a página. A linha é essa.</aside>}</div>; }
  if (screen === 12) return <div className="story-center"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}><Trophy className="mx-auto size-14 text-primary" /></motion.div><Title><span className="text-primary">A regra de ouro:</span></Title><p className="story-quote">cada gatilho gera um tipo de reação diferente — comentário, marcação, salvamento, compartilhamento. Página que só usa um cresce torto. Página que reveza os quatro cresce redondo.</p><Sequence className="reaction-row">{Object.entries(triggerColors).map(([x, color]) => <b key={x} className={color}>{x}</b>)}</Sequence></div>;
  if (screen === 13) return <><Title>DECORAR É O PRIMEIRO PASSO. O SEGREDO É SABER ESCOLHER.</Title><p>A mesma notícia pode virar qualquer um dos 4 gatilhos. Quem escolhe é você — de acordo com o que quer que sua página ganhe.</p><Sequence className="goal-table">{[["Quero mais alcance hoje", "POLÊMICA"], ["Quero que chamem amigos", "NOSTALGIA"], ["Quero conteúdo que dure", "REVELAÇÃO"], ["Quero sair da minha bolha", "PERTENCIMENTO"]].map((x, i) => <div key={x[0]} className={Object.values(triggerColors)[i]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</Sequence><p className="story-quote">Agora é sua vez de escolher.</p></>;
  if (screen >= 14 && screen <= 17) { const round = rounds[screen - 14] ?? rounds[0]; const pick = selected[screen]; return <><div className="badge-row"><span className="story-badge">SUA VEZ</span><b>RODADA {screen - 13} DE 4</b></div><div className="brief-box"><small>NOTÍCIA DO DIA</small><b>{personalize(round.news, lead)}</b><small>SEU OBJETIVO</small><b>{round.goal}</b></div><div className="round-options">{round.options.map(([kind, text], i) => <Choice key={text} onClick={() => answer(i, round.correct)} state={pick === undefined ? undefined : i === round.correct ? "right" : i === pick ? "wrong" : undefined}><span>{personalize(text, lead)}{pick !== undefined && <small className={triggerColors[kind as Trigger]}>{kind}</small>}</span></Choice>)}</div>{pick !== undefined && <Why>{round.why}</Why>}</>; }
  if (screen === 18) { const count = [14, 15, 16, 17].filter((x) => answers[String(x)]).length; return <div className="story-center"><Title>VOCÊ ACERTOU<br/><em className="text-primary">{count} DE 4.</em></Title><p className="story-quote">{count === 4 ? "Você já pensa como quem cresce página." : count >= 2 ? "Bom começo. O olho pra escolher o gatilho se treina." : "Normal errar no começo. Agora você sabe o que procurar."}</p><div className="dark-callout">Repare: nas 4 rodadas, a mesma notícia podia virar qualquer gatilho. O que mudou foi o objetivo. É assim que as páginas grandes decidem o que postar.</div></div>; }
  if (screen === 19) return <><Title>COMO ISSO VIRA<br/><Mark>CONTEÚDO TODA SEMANA</Mark></Title><p>Gatilho solto dá um post bom. O que constrói página é rotina. E rotina não significa passar o dia editando.</p><Sequence className="routine-list">{[["A SEMANA DOS 4 GATILHOS.", "Distribua: um post de polêmica, um de nostalgia, um de revelação, um de pertencimento. Pronto — sua semana está planejada e você nunca mais abre o app sem saber o que postar."], ["SEPARE O DIA DE CRIAR DO DIA DE POSTAR.", "Quem cria na hora de postar, posta ruim ou não posta. Junte tudo num bloco só (um dia da semana) e deixe agendado. É assim que as páginas grandes fazem."]].map((x, i) => <div key={x[0]}><i>{i + 1}</i><p><b>{x[0]}</b> {x[1]}</p></div>)}</Sequence></>;
  if (screen === 20) return <Sequence className="routine-list">{[["TENHA UM BANCO DE IDEIAS.", "Toda vez que ler uma notícia, ouvir uma treta ou lembrar de algo antigo, joga nas notas do celular. Nunca comece do zero olhando pra tela em branco."], ["REAPROVEITE O QUE FUNCIONOU.", "Post que estourou não morre. Repostar em outro formato — vira Reels, vira carrossel, vira thumb de vídeo — é a forma mais barata de crescer."], ["APROVEITE A DATA QUENTE.", "Clássico, final, janela de transferências, convocação. O interesse já está lá; você só precisa estar junto no dia certo."]].map((x, i) => <div key={x[0]}><i>{i + 3}</i><p><b>{x[0]}</b> {x[1]}</p></div>)}</Sequence>;
  if (screen === 21) return <><Title><Mark>EXEMPLO PRÁTICO DA SUA SEMANA:</Mark></Title><div className="calendar-grid">{[["SEG", "POLÊMICA"], ["QUA", "NOSTALGIA"], ["SEX", "REVELAÇÃO"], ["DOM", "PERTENCIMENTO"]].map(([day, kind], i) => <motion.div initial={{ y: -80, rotate: -5 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: i * .2, type: "spring" }} key={day} className={Object.values(triggerColors)[i]}><span>{day}</span><b>{kind}</b></motion.div>)}</div></>;
  if (screen === 22) { const pick = selected[22]; return <><span className="story-badge">SUA VEZ</span><Title>A página “Resenha {lead.team}” está perdendo alcance toda semana. O que está errado?</Title><div className="week-strip">SEG P · TER P · QUA — · QUI — · SEX P · SÁB P · DOM —</div><p className="fake-comment">“Essa página só sabe reclamar...”</p><div className="round-options">{["Só usa um gatilho e não tem rotina", "Deveria postar mais fotos bonitas", "Precisa aparecer em vídeo"].map((x, i) => <Choice key={x} onClick={() => answer(i, 0)} state={pick === undefined ? undefined : i === 0 ? "right" : i === pick ? "wrong" : undefined}>{x}</Choice>)}</div>{pick !== undefined && <Why>Ela só usa polêmica e posta sem padrão. Resultado: só ganha um tipo de reação, a audiência cansa, e a página fica com fama de só reclamar. Veja a mesma página com a semana dos 4 gatilhos: SEG Polêmica / QUA Nostalgia / SEX Revelação / DOM Pertencimento.</Why>}</>; }
  if (screen === 23) { const pick = selected[23]; return <><span className="story-badge">SUA VEZ</span><Title>Uma marca quer anunciar. Qual página vale mais pra ela?</Title><div className="profile-grid"><Choice onClick={() => answer(0, 1)} state={pick === undefined ? undefined : "wrong"}><span><b>PÁGINA A</b>200 mil seguidores<small>40 comentários por post</small></span></Choice><Choice onClick={() => answer(1, 1)} state={pick === undefined ? undefined : "right"}><span><b>PÁGINA B</b>30 mil seguidores<small>900 comentários por post</small></span></Choice></div>{pick !== undefined && <Why>Marca não compra seguidor. Compra gente prestando atenção. A página B tem uma audiência que reage — e é essa audiência que clica, compra e lembra da marca. E percebe? Tudo que você aprendeu até aqui é sobre gerar exatamente isso.</Why>}</>; }
  if (screen === 24) return <><Title>AGORA SIM: COMO<br/><Mark>ATENÇÃO VIRA DINHEIRO</Mark></Title><p>Existem várias formas de monetizar futebol. Mas três respondem pela maior parte do faturamento de quem vive disso. É nelas que você deve focar.</p><div className="money-stairs"><div>INDEPENDÊNCIA <Flag /></div><div>VOLUME</div><div>BASE</div></div></>;
  if (screen >= 25 && screen <= 27) { const items = [
    ["MONETIZAÇÃO POR VISUALIZAÇÃO", "BASE", "As próprias plataformas pagam por audiência. YouTube é a mais forte e mais previsível — conteúdo de futebol ali tem vida longa e continua rendendo meses depois de publicado. Facebook e TikTok pagam menos por view, mas crescem muito mais rápido, o que te leva pras outras duas fontes.", "é renda que não depende de negociar com ninguém, mas exige volume. É a base, não o teto."],
    ["PUBLICIDADE E PARCERIAS", "VOLUME", "Marca não compra seguidor. Compra engajamento. Uma página de 30 mil com comentários fervendo vale mais pro anunciante que uma de 200 mil parada — e cobra mais caro. Entram aqui lojas de camisa, apps, marcas esportivas e o mercado de apostas, que é hoje o maior investidor do nicho. Sobre apostas, um aviso que vale ouro: é um mercado regulamentado no Brasil (Lei 14.790) e as plataformas têm regras próprias de divulgação. Trabalhar só com operador legalizado e sinalizar publicidade não é burocracia — é o que protege sua página de ser derrubada e sua reputação de ir junto.", "é onde o ticket sobe rápido, mas depende de você ter audiência que reage."],
    ["AFILIAÇÃO E PRODUTO PRÓPRIO", "INDEPENDÊNCIA", "Afiliação é comissão por indicação — funciona bem porque o torcedor confia em quem fala a língua dele. E produto próprio (camiseta, caneca, pack, e-book, mentoria) é a fonte de maior margem, porque não tem intermediário.", "essa é a que mais escala e a que menos gente explora. É o que transforma página em negócio."],
  ][screen - 25] ?? ["MONETIZAÇÃO POR VISUALIZAÇÃO", "BASE", "", ""]; return <><div className="source-heading"><i>{screen - 24}</i><div><small>{items[1]}</small><Title>{items[0]}</Title></div></div><p>{items[2]}</p><div className="point"><b>O ponto:</b> {items[3]}</div><div className="mini-stairs"><span className={screen === 27 ? "on" : ""}>INDEPENDÊNCIA</span><span className={screen === 26 ? "on" : ""}>VOLUME</span><span className={screen === 25 ? "on" : ""}>BASE</span></div></>; }
  if (screen === 28) return <><Title>A LÓGICA DAS TRÊS</Title><div className="money-stairs big"><div>INDEPENDÊNCIA <Flag /></div><div>VOLUME</div><div>BASE</div></div><div className="yellow-callout">A lógica das três: a primeira te dá base, a segunda te dá volume, a terceira te dá independência. Quem fatura alto não escolhe uma — empilha as três.</div></>;
  if (screen === 29) { const values: Record<number, [string, number]> = { 27: ["3,7 milhões", 371], 97: ["1,04 milhão", 104], 297: ["337 mil", 34], 997: ["101 mil", 11] }; const result = ticket ? values[ticket] : null; return <><span className="story-badge">SUA VEZ</span><Title>A CONTA QUE<br/><span className="text-primary">FECHA EM R$ 10K</span></Title><p>R$ 10 mil parece distante quando você não tem uma estratégia e nem um funil. Deixa de parecer quando você entende o jogo.</p><p>Na vida real, de cada 10 mil pessoas que veem seu conteúdo, cerca de 1 compra (0,01%). Quantas visualizações você precisa pra faturar R$ 10 mil? Depende do preço do que você vende. Escolha:</p><div className="ticket-row">{[27, 97, 297, 997].map((x) => <Button key={x} onClick={() => { setTicket(x); fire("Respondeu", { numero: 29, acertou: true }); }} variant={ticket === x ? "game" : "outline"}>R$ {x}</Button>)}</div>{result && <><div className="funnel"><div><Eye /> <b>{result[0]}</b><small>VISUALIZAÇÕES/MÊS</small></div><div><ShoppingCart /> <b>{result[1]}</b><small>VENDAS A 0,01%</small></div><div><b>R$ {ticket}</b><small>TICKET</small></div><strong>= R$ 10.000 BRUTO</strong></div><Why>Percebe a diferença? Com um produto de R$ 27 você precisa de milhões de visualizações. Com um de R$ 297, uma página média já chega lá. Quem fatura alto não depende de viralizar todo dia — tem produtos com valor de verdade.</Why></>}<small className="disclaimer">Exemplo hipotético, não uma promessa de resultado. Alcance e conversão variam. O cálculo não desconta custos, taxas ou impostos.</small></>; }
  if (screen === 30) return <><Title>O QUE VOCÊ LEVA DAQUI</Title><Sequence className="takeaways">{["Futebol cresce com reação, não com beleza", "Os 4 gatilhos e a reação que cada um gera", "Escolher o gatilho pelo objetivo do post", "A semana dos 4 gatilhos", "Engajamento e ticket fecham a conta, não seguidor"].map((x) => <p key={x}><Check />{x}</p>)}</Sequence><div className="first-posts"><b>SEUS PRIMEIROS 4 POSTS</b>{rounds.map((r, i) => <p key={r.news}><span className={Object.values(triggerColors)[i]}>{r.options[0][0]}</span>{personalize(r.options[0][1], lead)}</p>)}<small>Pode usar. São seus.</small></div></>;
  return <div className="closing"><Title>O PRÓXIMO<br/><span className="text-primary">PASSO</span></Title><Sequence><p>Você acabou de entender o que a maioria das páginas de futebol nunca entendeu: <Mark>não é sobre postar sobre futebol. É sobre provocar reação.</Mark> Os 4 gatilhos, a rotina, as 3 fontes de faturamento — isso é mais do que 90% das páginas sabem.</p><p><Mark>Mas conhecer o mapa não é o mesmo que fazer o caminho.</Mark></p><p>Falta escolher o nicho certo pra você, montar a página do jeito certo desde o primeiro dia, crescer com consistência e ativar cada fonte de renda na hora certa — sem perder meses testando no escuro.</p><p>É exatamente isso que a gente ensina, passo a passo, no <Mark>método completo da QG do Fut.</Mark></p></Sequence><Button variant="game" asChild className="offer-button"><a href={OFFER_URL} onClick={() => fire("CliqueOferta")}>{OFFER_LABEL}</a></Button><a className="follow-link" href={OFFER_URL}>Siga a QG do Fut e continue aprendendo a transformar futebol em faturamento.</a></div>;
}