"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowDown, ArrowUpRight, Code2, Mail, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { additionalProjects, featuredProjects, type Project, projects } from "@/data/projects";

const CinematicScene = dynamic(
  () => import("@/components/cinematic-scene").then((module) => module.CinematicScene),
  { ssr: false, loading: () => <div className="scene-loading"><span />FACILITY LOADING</div> },
);

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("The 3D facility could not be rendered.", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        setSupported(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
      } catch {
        setSupported(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return supported;
}

function useInterfaceSound() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback((kind: "step" | "open") => {
    const context = contextRef.current;
    if (!enabled || !context || context.state !== "running") return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = kind === "open" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(kind === "open" ? 118 : 510, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "open" ? 238 : 410, now + 0.11);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.028, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    if (next) {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      void context.resume();
    }
    setEnabled(next);
  };

  return { enabled, play, toggle };
}

function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.media) {
    return (
      <Image
        src={project.media}
        alt={project.mediaAlt ?? project.titleJa}
        fill
        priority={priority}
        sizes="(max-width: 760px) 94vw, 42vw"
        unoptimized={project.media.endsWith(".gif")}
      />
    );
  }
  return (
    <div className={`generated-visual visual-${project.visualVariant}`} aria-hidden="true">
      <span /><span /><span /><span />
    </div>
  );
}

function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
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
        transition={{ type: "spring", stiffness: 260, damping: 34 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-title-${project.id}`}
        tabIndex={-1}
      >
        <div className="panel-topline">
          <span>PROJECT / {project.index}</span>
          <button onClick={onClose} aria-label="詳細を閉じる"><X size={20} /> CLOSE</button>
        </div>
        <p className="system-label">{project.chapter}</p>
        <h2 id={`project-title-${project.id}`}>{project.title}</h2>
        <p className="panel-ja">{project.titleJa}</p>
        <div className="panel-media"><ProjectVisual project={project} /></div>
        {project.metric ? <strong className="panel-metric">{project.metric}</strong> : null}
        <div className="panel-copy">
          <div><span>OVERVIEW</span><p>{project.detail}</p></div>
          <div><span>DESIGN DECISION</span><p>{project.decision}</p></div>
        </div>
        <div className="panel-role">
          <span>RESPONSIBILITY</span>
          <ul>{project.role.map((role) => <li key={role}>{role}</li>)}</ul>
        </div>
        <div className="tech-list">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        {project.links.length > 0 ? (
          <div className="panel-links">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}<ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function StaticCinematic({ onOpen }: { onOpen: (project: Project) => void }) {
  return (
    <section className="static-cinematic" id="top">
      <div className="static-intro">
        <p className="system-label">TATSUKI KUWANO / PORTFOLIO 2026</p>
        <h1>BUILDING<br />EXPERIENCE<br /><span>BEYOND SCREENS.</span></h1>
        <p>AR・AI・Web・3Dを横断し、画面の外へ続く体験を設計・実装しています。</p>
      </div>
      <div className="static-featured">
        {featuredProjects.map((project) => (
          <article key={project.id}>
            <div className="static-media"><ProjectVisual project={project} /></div>
            <p className="system-label">{project.chapter}</p>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <button onClick={() => onOpen(project)}>PROJECT DETAIL <ArrowUpRight size={16} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PortfolioExperience() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [scenePaused, setScenePaused] = useState(false);
  const cinematicRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const compact = useMediaQuery("(max-width: 760px), (pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webGLSupported = useWebGLSupport();
  const { enabled: soundEnabled, play: playSound, toggle: toggleSound } = useInterfaceSound();
  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const openProject = useCallback((project: Project) => {
    playSound("open");
    setSelectedProject(project);
  }, [playSound]);

  useMotionValueEvent(scrollY, "change", (scrollTop) => {
    const cinematic = cinematicRef.current;
    if (!cinematic) return;
    const scrollDistance = Math.max(cinematic.offsetHeight - window.innerHeight, 1);
    const value = Math.min(Math.max((scrollTop - cinematic.offsetTop) / scrollDistance, 0), 1);
    progressRef.current = value;
    const next = value < 0.12 ? -1 : value < 0.36 ? 0 : value < 0.61 ? 1 : value < 0.86 ? 2 : 3;
    setActiveChapter((current) => {
      if (current === next) return current;
      playSound("step");
      return next;
    });
  });

  useEffect(() => {
    const element = cinematicRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(entry.isIntersecting),
      { rootMargin: "120px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const useStaticExperience = reducedMotion || webGLSupported === false;
  const chapterProject = activeChapter >= 0 && activeChapter < 3 ? featuredProjects[activeChapter] : null;

  return (
    <div className="site-shell">
      <motion.div className="page-progress" style={{ scaleX: pageProgress }} />
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="site-id" href="#top" aria-label="ページ先頭へ"><b>TK</b><span>EXPERIENCE ENGINEER</span></a>
        <nav aria-label="メインナビゲーション"><a href="#works">WORKS</a><a href="#profile">PROFILE</a><a href="#contact">CONTACT</a></nav>
        <div className="header-controls">
          <button onClick={() => setScenePaused((value) => !value)} aria-label={scenePaused ? "3Dアニメーションを再開" : "3Dアニメーションを停止"}>
            {scenePaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button onClick={toggleSound} aria-label={soundEnabled ? "操作音をオフ" : "操作音をオン"}>
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>SOUND</span>
          </button>
        </div>
      </header>

      <main>
        {useStaticExperience ? (
          <StaticCinematic onOpen={openProject} />
        ) : (
          <SceneErrorBoundary fallback={<StaticCinematic onOpen={openProject} />}>
            <section className="cinematic" id="top" ref={cinematicRef}>
              <div className="cinematic-sticky">
                <div className="cinematic-canvas" aria-hidden="true">
                  {webGLSupported === true ? (
                    <CinematicScene
                      progressRef={progressRef}
                      compact={compact}
                      active={sceneVisible}
                      paused={scenePaused}
                      onSelectProject={(index) => openProject(projects[index])}
                    />
                  ) : <div className="scene-loading"><span />FACILITY LOADING</div>}
                </div>

                <div className="cinematic-ui">
                  <div className="facility-coordinate"><span>FACILITY 34°41&apos;N</span><span>SCROLL / NATIVE CONTROL</span></div>
                  <AnimatePresence mode="wait">
                    {activeChapter === -1 ? (
                      <motion.div className="cinematic-intro" key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <p className="system-label">TATSUKI KUWANO / PORTFOLIO 2026</p>
                        <h1>BUILDING<br />EXPERIENCE<br /><span>BEYOND SCREENS.</span></h1>
                        <p className="intro-copy">AR・AI・Web・3Dを横断し、<br />画面の外へ続く体験を設計・実装しています。</p>
                        <div className="scroll-cue"><ArrowDown size={17} /><span>SCROLL TO ENTER FACILITY</span></div>
                      </motion.div>
                    ) : chapterProject ? (
                      <motion.article className="chapter-card" key={chapterProject.id} initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                        <div className="chapter-copy">
                          <p className="system-label">CHAPTER {chapterProject.index} / {chapterProject.chapter}</p>
                          <h2>{chapterProject.title}</h2>
                          <h3>{chapterProject.titleJa}</h3>
                          <p>{chapterProject.summary}</p>
                          <div className="chapter-spec"><span>{chapterProject.metric}</span><span>{chapterProject.year}</span></div>
                          <button onClick={() => openProject(chapterProject)}>OPEN PROJECT <ArrowUpRight size={16} /></button>
                        </div>
                        <div className="chapter-media"><ProjectVisual project={chapterProject} priority={activeChapter === 0} /><span>DOCUMENT / {chapterProject.index}</span></div>
                      </motion.article>
                    ) : (
                      <motion.div className="cinematic-outro" key="outro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="system-label">FACILITY TOUR COMPLETE</p>
                        <h2>MORE WORK<br />BELOW.</h2>
                        <a href="#works">CONTINUE <ArrowDown size={17} /></a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="chapter-rail" aria-hidden="true">
                    {featuredProjects.map((project, index) => <span key={project.id} className={activeChapter === index ? "active" : ""}>{project.index}</span>)}
                  </div>
                </div>
              </div>
            </section>
          </SceneErrorBoundary>
        )}

        <section className="works-section" id="works">
          <div className="section-kicker"><span>04—08</span><p>ADDITIONAL WORK / FIELD RECORDS</p></div>
          <div className="works-heading"><h2>実装の幅を、<br />結果で見せる。</h2><p>企業・個人・チーム制作を横断し、要件から運用まで必要な場所を担当してきました。</p></div>
          <div className="work-records">
            {additionalProjects.map((project) => (
              <button key={project.id} onClick={() => openProject(project)}>
                <span className="record-index">{project.index}</span>
                <span className="record-title"><small>{project.category}</small><strong>{project.title}</strong><em>{project.titleJa}</em></span>
                {project.metric ? <span className="record-metric">{project.metric}</span> : <span />}
                <span className="record-arrow"><ArrowUpRight size={19} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="profile-section" id="profile">
          <div className="profile-heading"><p className="system-label">OPERATOR PROFILE / 2026</p><h2>技術を横断し、<br /><span>体験を最後までつくる。</span></h2></div>
          <div className="profile-grid">
            <div className="profile-bio"><small>TATSUKI KUWANO</small><h3>桑野 樹希</h3><p>KADOKAWAドワンゴ情報工科学院 大学部所属。ARを軸に、AI、Web、3Dを組み合わせた体験づくりに取り組んでいます。</p><p>個人制作からチーム開発、企業・自治体プロジェクトまで経験。要件定義、バックエンド、管理画面、データ可視化、3D制作を横断します。</p></div>
            <div className="capabilities">
              {[
                ["01", "SPATIAL", "AR / 3D / Interactive"],
                ["02", "INTELLIGENCE", "LLM / Voice / Memory"],
                ["03", "SYSTEM", "Backend / Database / Docker"],
                ["04", "INTERFACE", "Web / Dashboard / Data Viz"],
              ].map(([number, name, detail]) => <div key={number}><span>{number}</span><strong>{name}</strong><small>{detail}</small></div>)}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="system-label">OPEN COMMUNICATION CHANNEL</p>
          <h2>まだない体験を、<br /><span>一緒につくる。</span></h2>
          <p>展示、実験、プロダクト。アイデアを実際に触れられるところまで持っていきます。</p>
          <div className="contact-links">
            <a href="mailto:kuwano.t.24kdgn@gmail.com"><Mail size={20} />メールを送る<ArrowUpRight size={20} /></a>
            <a href="https://github.com/tatuki1107" target="_blank" rel="noreferrer"><Code2 size={20} />GitHubを見る<ArrowUpRight size={20} /></a>
          </div>
          <footer><span>© 2026 TATSUKI KUWANO</span><span>THREE.JS / NEXT.JS</span><a href="#top">BACK TO TOP ↑</a></footer>
        </section>
      </main>

      <AnimatePresence>{selectedProject ? <ProjectPanel project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}</AnimatePresence>
    </div>
  );
}
