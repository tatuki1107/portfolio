"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, GitFork, Mail, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const ResearchScene = dynamic(() => import("./ResearchScene"), { ssr: false });
type Project = { id: string; index: string; title: string; short: string; description: string; role: string; stack: string[]; signal: string; image?: string; href?: string; github?: string };
const projects: Project[] = [
  { id: "egographica", index: "RX-01", title: "egoGraphica", short: "ART × AI DIALOGUE PLATFORM", description: "現代アーティストとAIを通じて対話できるアートテックプラットフォーム。管理画面、CRM分析、会話・売上・CV率の可視化など、運用を支える中枢機能を開発しました。", role: "Backend / Admin UI / CRM analytics", stack: ["Next.js", "Data visualization", "Backend", "CRM"], signal: "COMMERCIAL SYSTEM / ACTIVE", href: "https://egographica.art/" },
  { id: "kobe-night", index: "RX-02", title: "神戸ナイトタイムエコノミー", short: "AI TOURISM CONCIERGE", description: "神戸の高架下周辺の回遊を支援するAI観光コンシェルジュ。実際の街歩きで使われる状況を想定し、自治体関連プロジェクトのアプリケーション開発を担当しました。", role: "Application development / UX", stack: ["AI", "Web application", "Tourism", "UX"], signal: "CITY FIELD TEST / DEPLOYED", image: "/projects/kobe.png", href: "https://yorunotobira.com/" },
  { id: "3d-ai", index: "RX-03", title: "3Dモデル対話AI", short: "EMBODIED AI INTERFACE", description: "3Dキャラクターと自然に会話できる個人制作アプリ。企画、3Dモデル制作、対話機能を支えるバックエンドまで、一貫して設計・開発しました。", role: "Concept / 3D / Backend", stack: ["3D", "LLM", "Blender", "Realtime UI"], signal: "PRIVATE PROTOTYPE / COMPLETE", image: "/projects/3d-ai.gif" },
  { id: "webar", index: "RX-04", title: "Web AR", short: "IMAGE-TRACKED AR EXPERIENCE", description: "文化祭向けの画像認識Web AR。マーカー認識を起点に複数の3Dモデルを出現させ、スマートフォンのブラウザだけで体験できるARコンテンツとして公開しました。", role: "Planning / UI / 3D integration", stack: ["MindAR.js", "A-Frame", "WebXR", "3D"], signal: "PUBLIC DEMO / ONLINE", href: "https://tatuki1107.github.io/WebAR/", github: "https://github.com/tatuki1107/WebAR" },
  { id: "discord-ai", index: "RX-05", title: "Memory Discord AI", short: "LOCAL LLM WITH LONG-TERM MEMORY", description: "Ollamaを利用したローカルLLM搭載Discord Bot。ストリーミング応答と、要約・Embeddingを組み合わせた短期／長期記憶を実装しています。", role: "AI architecture / Backend", stack: ["Ollama", "Embedding", "Discord", "Python"], signal: "LOCAL NODE / LEARNING", image: "/projects/discord.png" },
];

function useTerminalSound(enabled: boolean) {
  const context = useRef<AudioContext | null>(null);
  return useCallback((frequency = 520) => {
    if (!enabled || typeof window === "undefined") return;
    context.current ??= new AudioContext();
    const oscillator = context.current.createOscillator();
    const gain = context.current.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = frequency; gain.gain.value = 0.035;
    gain.gain.exponentialRampToValueAtTime(0.0001, context.current.currentTime + 0.08);
    oscillator.connect(gain).connect(context.current.destination); oscillator.start(); oscillator.stop(context.current.currentTime + 0.08);
  }, [enabled]);
}

export default function PortfolioExperience() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sound, setSound] = useState(false);
  const [paused, setPaused] = useState(false);
  const [clock, setClock] = useState("00:00:00");
  const beep = useTerminalSound(sound);
  useEffect(() => { const tick = () => setClock(new Date().toLocaleTimeString("ja-JP", { hour12: false })); tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { document.body.style.overflow = activeProject ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [activeProject]);
  const inspect = (project: Project) => { beep(660); setActiveProject(project); };

  return (
    <main className={`terminal-shell ${paused ? "is-paused" : ""}`}>
      <div className="scene-layer" aria-hidden="true"><ResearchScene /></div><div className="noise" aria-hidden="true" /><div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="トップへ"><span className="brand-mark">TK</span><span><b>TATSUKI KUWANO</b><small>EXPERIMENTAL INTERFACE / 2026</small></span></a>
        <div className="system-state"><i /> SYSTEM ONLINE <span>{clock} JST</span></div>
        <div className="control-cluster"><button onClick={() => { setPaused((v) => !v); beep(390); }} aria-label={paused ? "アニメーションを再開" : "アニメーションを停止"}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? "RESUME" : "HOLD"}</span></button><button onClick={() => setSound((v) => !v)} aria-label={sound ? "サウンドをオフ" : "サウンドをオン"}>{sound ? <Volume2 size={14} /> : <VolumeX size={14} />}<span>SOUND {sound ? "ON" : "OFF"}</span></button></div>
      </header>
      <section className="hero" id="top">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}><p className="eyebrow"><span>AR SYSTEM DESIGNER</span> / FULL-STACK BUILDER</p><h1>REALITY,<br /><em>RECOMPILED.</em></h1><p className="hero-lead">AR・AI・Webを接続し、<br />画面の外へ続く体験を設計する。</p><div className="hero-actions"><a href="#research">研究ログを開く <ArrowUpRight size={15} /></a><a href="mailto:kuwano.t.24kdgn@gmail.com" className="ghost">CONTACT NODE</a></div></motion.div>
        <div className="core-label" aria-hidden="true"><span>SPATIAL CORE</span><strong>07-A</strong><small>ROTATION STABLE<br />SIGNAL 98.7%</small></div>
        <div className="hero-side-note"><span>PROFILE / 001</span><p>KADOKAWAドワンゴ<br />情報工科学院 大学部</p><p>要件定義から3D制作まで。<br />個人開発・企業・自治体案件。</p></div><div className="scroll-cue"><span /> SCROLL TO DECODE</div>
      </section>
      <section className="research" id="research">
        <div className="section-heading"><div><span>01 / RESEARCH ARCHIVE</span><h2>SELECTED<br />EXPERIMENTS</h2></div><p>開発したプロダクトと検証記録。<br />各セルを選択して詳細データを展開。</p></div>
        <div className="project-grid">{projects.map((project, index) => <motion.button className="project-cell" key={project.id} onClick={() => inspect(project)} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: (index % 3) * 0.08 }}><span className="project-index">{project.index}</span><span className="project-signal">{project.signal}</span><span className="project-visual" aria-hidden="true"><i /><i /><i /></span><span className="project-title"><small>{project.short}</small><strong>{project.title}</strong></span><span className="project-open">OPEN FILE <ArrowUpRight size={14} /></span></motion.button>)}<div className="project-cell data-cell" aria-hidden="true"><span className="project-index">LIVE DATA</span><div className="data-bars">{[62, 88, 44, 94, 72, 55, 83, 68].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div><strong>05</strong><small>ACTIVE RESEARCH NODES</small></div></div>
      </section>
      <section className="about"><div className="about-code">02 / OPERATOR PROFILE</div><div className="about-main"><p>“技術”ではなく、<br /><span>人が触れた瞬間</span>から考える。</p><div className="about-copy">ARを軸に、AI・Web・3Dを組み合わせた体験づくりに取り組んでいます。企画、設計、バックエンド、管理画面、可視化まで横断して、アイデアを動くプロダクトへ変換します。</div></div><div className="stack-row"><span>CAPABILITIES</span>{["AR / XR", "NEXT.JS", "PYTHON", "DJANGO", "AI / LLM", "BLENDER", "DATA VIZ"].map((item) => <b key={item}>{item}</b>)}</div></section>
      <footer><div><span>OPEN FOR INTERNSHIP / COLLABORATION</span><h2>LET&apos;S BUILD THE<br />NEXT LAYER.</h2></div><div className="footer-links"><a href="mailto:kuwano.t.24kdgn@gmail.com"><Mail size={16} /> EMAIL</a><a href="https://github.com/tatuki1107" target="_blank" rel="noreferrer"><GitFork size={16} /> GITHUB</a></div><small>© 2026 TATSUKI KUWANO / ALL SYSTEMS OPERATIONAL</small></footer>
      <AnimatePresence>{activeProject && <motion.div className="detail-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveProject(null)}><motion.aside className="detail-panel" role="dialog" aria-modal="true" aria-label={`${activeProject.title}の詳細`} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 160, damping: 22 }} onClick={(event) => event.stopPropagation()}><div className="detail-header"><span>{activeProject.index} / RESEARCH FILE</span><button onClick={() => setActiveProject(null)} aria-label="閉じる"><X size={18} /></button></div>{activeProject.image ? <div className="detail-image"><Image src={activeProject.image} alt="" fill sizes="(max-width: 700px) 100vw, 52vw" /></div> : <div className="detail-image generated"><span>{activeProject.index}</span><i /><i /><i /></div>}<div className="detail-body"><p className="eyebrow">{activeProject.signal}</p><h2>{activeProject.title}</h2><p className="detail-description">{activeProject.description}</p><dl><div><dt>ROLE</dt><dd>{activeProject.role}</dd></div><div><dt>TECH STACK</dt><dd>{activeProject.stack.join(" / ")}</dd></div></dl><div className="detail-links">{activeProject.href && <a href={activeProject.href} target="_blank" rel="noreferrer">VIEW PROJECT <ArrowUpRight size={15} /></a>}{activeProject.github && <a href={activeProject.github} target="_blank" rel="noreferrer" className="secondary"><GitFork size={15} /> SOURCE</a>}</div></div></motion.aside></motion.div>}</AnimatePresence>
    </main>
  );
}

