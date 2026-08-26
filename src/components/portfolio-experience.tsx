"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  Mail,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Project, projects } from "@/data/projects";

const SOUND_STORAGE_KEY = "portfolio-sound:v1";
const HologramScene = dynamic(
  () => import("@/components/hologram-scene").then((module) => module.HologramScene),
  {
    ssr: false,
    loading: () => <div className="scene-loading">立体作品を読み込んでいます</div>,
  },
);

const featuredProjects = projects.filter((project) => project.featured);
const additionalProjects = projects.filter((project) => !project.featured);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function useInterfaceSound() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEnabled(window.localStorage.getItem(SOUND_STORAGE_KEY) === "on");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const play = useCallback(
    (tone: "tick" | "open") => {
      if (!enabled) return;
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone === "open" ? 180 : 760, now);
      oscillator.frequency.exponentialRampToValueAtTime(tone === "open" ? 640 : 420, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.13);
    },
    [enabled],
  );

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(SOUND_STORAGE_KEY, next ? "on" : "off");
  };

  return { enabled, play, toggle };
}

function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="project-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        ref={panelRef}
        className="project-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 250 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-title-${project.id}`}
        tabIndex={-1}
      >
        <button className="panel-close" onClick={onClose} aria-label="詳細を閉じる">
          <X size={22} /><span>CLOSE</span>
        </button>
        <div className="panel-sequence">PROJECT {project.index}</div>
        <p className="eyebrow acid">{project.category}</p>
        <h2 id={`project-title-${project.id}`}>{project.title}</h2>
        <p className="panel-title-ja">{project.titleJa}</p>

        {project.media ? (
          <div className="panel-media">
            <Image
              src={project.media}
              alt={project.mediaAlt ?? project.titleJa}
              fill
              sizes="(max-width: 760px) 100vw, 58vw"
              unoptimized={project.media.endsWith(".gif")}
            />
            <span className="media-tag">PHOTO / DEMO</span>
          </div>
        ) : (
          <div className="panel-media generative-media" aria-hidden="true">
            <div className="signal-disc" />
            <span className="media-tag">PROJECT IMAGE / {project.id.toUpperCase()}</span>
          </div>
        )}

        <div className="panel-copy-grid">
          <div>
            <p className="micro-label">OVERVIEW</p>
            <p className="panel-detail">{project.detail}</p>
          </div>
          <div>
            <p className="micro-label">MY ROLE</p>
            <ul className="role-list">
              {project.role.map((role) => <li key={role}>{role}</li>)}
            </ul>
          </div>
        </div>

        <div className="tech-list">
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        {project.links.length > 0 && (
          <div className="panel-links">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}<ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function PortfolioExperience() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [scenePaused, setScenePaused] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = useMediaQuery("(max-width: 760px), (pointer: coarse)");
  const { scrollYProgress } = useScroll();
  const scrollScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const sound = useInterfaceSound();

  const openProject = (project: Project) => {
    sound.play("open");
    setSelectedProject(project);
  };

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollScale }} />
      <div className="page-noise" aria-hidden="true" />

      <header className="site-header">
        <a href="#top" className="identity-mark" aria-label="ページ先頭へ">
          <span>Tatsuki</span><small>Kuwano / Portfolio</small>
        </a>
        <nav aria-label="メインナビゲーション">
          <a href="#works">WORKS</a><a href="#profile">PROFILE</a><a href="#contact">CONTACT</a>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-action"
            onClick={() => setScenePaused((value) => !value)}
            aria-label={scenePaused ? "3Dアニメーションを再開" : "3Dアニメーションを停止"}
          >
            {scenePaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            className="sound-action"
            onClick={sound.toggle}
            aria-label={sound.enabled ? "操作音をオフ" : "操作音をオン"}
          >
            {sound.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>音 {sound.enabled ? "あり" : "なし"}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-canvas" aria-hidden="true">
            <HologramScene
              reducedMotion={reducedMotion || scenePaused}
              compact={compact}
              onHoverProject={setHoveredProjectIndex}
              onSelectProject={(index) => openProject(projects[index])}
            />
          </div>
          <div className="hero-3d-note" aria-hidden="true">
            <span>INTERACTIVE PROJECT ISLAND</span>
            <strong>DRAG WORLD / CLICK OBJECTS</strong>
          </div>
          <div className="hero-project-callout" aria-live="polite">
            {hoveredProjectIndex === null ? (
              <><small>3D PROJECT MAP</small><strong>7つの作品を巡る</strong></>
            ) : (
              <><small>PROJECT {projects[hoveredProjectIndex].index}</small><strong>{projects[hoveredProjectIndex].title}</strong></>
            )}
          </div>
          <div className="hero-content">
            <p className="eyebrow"><span /> PORTFOLIO / 2026</p>
            <h1><span>TATSUKI</span><span className="outline-word">KUWANO</span></h1>
            <div className="hero-bottom">
              <p className="hero-statement">
                AR・AI・Webを横断し、<br /><strong>画面の外へ続く体験</strong>をつくる。
              </p>
              <a href="#works" className="down-link"><span>作品を見る</span><ArrowDownRight size={25} /></a>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">KOBE / JAPAN</div>
        </section>

        <section className="works-section" id="works">
          <div className="section-heading">
            <p className="eyebrow acid">SELECTED WORKS</p>
            <h2>選んだ<br />仕事と実験</h2>
            <p className="section-intro">
              課題から技術を選ぶ。<br />技術から体験を組み立てる。<br />
              <span>それぞれの制作背景と担当領域を紹介します。</span>
            </p>
          </div>
          <div className="project-list">
            {featuredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="project-row"
                onMouseEnter={() => sound.play("tick")}
                onFocus={() => sound.play("tick")}
                onClick={() => openProject(project)}
              >
                <span className="project-index">{project.index}</span>
                <span className="project-meta"><small>{project.category}</small><small>{project.year}</small></span>
                <span className="project-name"><strong>{project.title}</strong><em>{project.titleJa}</em></span>
                <span className="project-arrow"><ArrowUpRight /></span>
              </button>
            ))}
          </div>
          <div className="additional-work">
            <p className="micro-label">そのほかの制作</p>
            <div>
              {additionalProjects.map((project) => (
                <button key={project.id} type="button" onClick={() => openProject(project)}>
                  <span>{project.index}</span><strong>{project.titleJa}</strong><ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-section" id="profile">
          <div className="profile-lead">
            <p className="eyebrow acid">PROFILE</p>
            <h2>未知の技術に、<br /><span>まず触れる。</span></h2>
          </div>
          <div className="profile-grid">
            <div className="profile-copy">
              <p className="profile-name-en">TATSUKI KUWANO</p><h3>桑野 樹希</h3>
              <p>KADOKAWAドワンゴ情報工科学院 大学部所属。ARを軸に、AI、Web、3Dを組み合わせた体験づくりに取り組んでいます。</p>
              <p>個人制作からチーム開発、企業・自治体に関わるプロジェクトまで経験。要件定義、バックエンド、管理画面、データ可視化、3D制作を横断します。</p>
            </div>
            <div className="capability-matrix">
              {[
                ["01", "EXPERIENCE", "AR / 3D / Interactive"],
                ["02", "INTELLIGENCE", "LLM / Voice / Memory"],
                ["03", "SYSTEM", "Backend / Database / Docker"],
                ["04", "INTERFACE", "Web / Dashboard / Data viz"],
              ].map(([number, label, detail]) => (
                <div key={number}><span>{number}</span><strong>{label}</strong><small>{detail}</small></div>
              ))}
            </div>
          </div>
          <div className="ticker" aria-hidden="true"><div>AR — AI — WEB — 3D — BACKEND — EXPERIENCE — AR — AI — WEB — 3D —</div></div>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">CONTACT</p>
          <h2>一緒に、<br /><span>まだない景色を。</span></h2>
          <p>展示、実験、プロダクト。まだ形のない体験について話しましょう。</p>
          <div className="contact-links">
            <a href="mailto:kuwano.t.24kdgn@gmail.com"><Mail size={21} />メールを送る<ArrowUpRight size={21} /></a>
            <a href="https://github.com/tatuki1107" target="_blank" rel="noreferrer"><Code2 size={21} />GITHUB<ArrowUpRight size={21} /></a>
          </div>
          <footer>
            <span>© 2026 TATSUKI KUWANO</span><span>BUILT WITH NEXT.JS + THREE.JS</span><a href="#top">BACK TO TOP ↑</a>
          </footer>
        </section>
      </main>

      <AnimatePresence>
        {selectedProject && <ProjectPanel project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
