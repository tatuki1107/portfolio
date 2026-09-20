"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, Code2, Copy, Mail, Menu, Send, X } from "lucide-react";
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

function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.media) {
    return (
      <div className={`evidence-visual ${project.mediaSecondary ? "evidence-visual-pair" : ""}`}>
        <figure>
          <Image
            src={project.media}
            alt={project.mediaAlt ?? project.titleJa}
            fill
            priority={priority}
            sizes="(max-width: 760px) 94vw, 42vw"
            unoptimized={project.media.endsWith(".gif") || project.featuredRank !== undefined}
          />
          {project.mediaLabel ? <figcaption>{project.mediaLabel}</figcaption> : null}
        </figure>
        {project.mediaSecondary ? (
          <figure>
            <Image
              src={project.mediaSecondary}
              alt={project.mediaSecondaryAlt ?? project.titleJa}
              fill
              priority={priority}
              sizes="(max-width: 760px) 47vw, 21vw"
              unoptimized={project.featuredRank !== undefined}
            />
            {project.mediaSecondaryLabel ? <figcaption>{project.mediaSecondaryLabel}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    );
  }
  return (
    <div className="record-visual" role="img" aria-label={`${project.titleJa}の展示実績`}>
      <span>{project.mediaLabel ?? "VERIFIED RECORD"}</span>
      <strong>{project.metric}</strong>
      <p>{project.title}</p>
      <small>IMAGE NOT PUBLISHED / FACTS ONLY</small>
    </div>
  );
}

function ProjectPanel({ project, onClose, onContact }: { project: Project; onClose: () => void; onContact: () => void }) {
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
        <div className="project-facts" aria-label="プロジェクト実績">
          {project.facts.map((fact) => <span key={fact}>{fact}</span>)}
        </div>
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
        <button className="panel-contact" type="button" onClick={onContact}>この作品について相談する <ArrowUpRight size={17} /></button>
      </motion.div>
    </motion.div>
  );
}

const CONTACT_EMAIL = "kuwano.t.24kdgn@gmail.com";
const inquiryTypes = ["制作・開発の相談", "インターン・採用", "展示・イベント", "その他"] as const;

function ContactDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [inquiry, setInquiry] = useState<(typeof inquiryTypes)[number]>(inquiryTypes[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
      );
      if (!focusable.length) return;
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
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const composeEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `【ポートフォリオ】${inquiry} / ${name.trim()}`;
    const body = [`桑野 樹希 様`, "", message.trim(), "", "──────────", `お名前: ${name.trim()}`, `返信先: ${email.trim()}`, `ご用件: ${inquiry}`].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <motion.div
      className="contact-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef}
        className="contact-dialog"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 28, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        tabIndex={-1}
      >
        <div className="contact-dialog-top"><span>TATSUKI KUWANO / CONTACT</span><button type="button" onClick={onClose} aria-label="問い合わせを閉じる"><X size={18} /><span>閉じる</span></button></div>
        <div className="contact-dialog-content">
          <div className="contact-dialog-intro">
            <p className="contact-eyebrow">ご連絡はこちらから</p>
            <h2 id="contact-dialog-title">お問い合わせ</h2>
            <p>制作のご相談、展示のお誘い、採用のお話など。内容が固まっていなくても、まずはお気軽にお聞かせください。</p>
          </div>
          <form className="contact-form" onSubmit={composeEmail}>
            <fieldset>
              <legend>ご用件</legend>
              <div className="inquiry-options">
                {inquiryTypes.map((type) => (
                  <label key={type} className={inquiry === type ? "selected" : ""}>
                    <input type="radio" name="inquiry" value={type} checked={inquiry === type} onChange={() => setInquiry(type)} />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="contact-form-row">
              <label>お名前<input required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="お名前" /></label>
              <label>返信先メール<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
            </div>
            <label className="contact-message">メッセージ<textarea required minLength={10} maxLength={3000} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="ご相談内容や背景を教えてください。" /></label>
            <button className="contact-submit" type="submit"><Send size={17} />メールを作成する<ArrowUpRight size={17} /></button>
            <p className="contact-form-note">このサイトから自動送信はされません。メールアプリで内容を確認し、送信してください。</p>
            <div className="contact-form-fallback"><span>メールアプリが開かない場合</span><button type="button" onClick={copyAddress}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "コピーしました" : CONTACT_EMAIL}</button></div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StaticCinematic({ onOpen, onContact }: { onOpen: (project: Project) => void; onContact: () => void }) {
  return (
    <section className="static-cinematic" id="top">
      <div className="static-intro">
        <p className="system-label">TATSUKI KUWANO / AR · AI · 3D DEVELOPER</p>
        <div className="intro-identity"><strong>桑野 樹希</strong><span>AR / AI / 3D CREATIVE DEVELOPER</span></div>
        <h1>BUILDING<br />EXPERIENCE<br /><span>BEYOND SCREENS.</span></h1>
        <p>AR・AI・Web・3Dを横断し、画面の外へ続く体験を設計・実装しています。</p>
        <button type="button" className="static-contact" onClick={onContact}>制作・開発を相談する <ArrowUpRight size={17} /></button>
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
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [sceneVisible, setSceneVisible] = useState(true);
  const cinematicRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const compact = useMediaQuery("(max-width: 760px), (pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webGLSupported = useWebGLSupport();
  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const openProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const openContact = useCallback(() => {
    setMobileMenuOpen(false);
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);

  const contactFromProject = useCallback(() => {
    setSelectedProject(null);
    window.setTimeout(() => setContactOpen(true), 400);
  }, []);

  useMotionValueEvent(scrollY, "change", (scrollTop) => {
    const cinematic = cinematicRef.current;
    if (!cinematic) return;
    const scrollDistance = Math.max(cinematic.offsetHeight - window.innerHeight, 1);
    const value = Math.min(Math.max((scrollTop - cinematic.offsetTop) / scrollDistance, 0), 1);
    progressRef.current = value;
    const next = value < 0.12 ? -1 : value < 0.36 ? 0 : value < 0.61 ? 1 : value < 0.86 ? 2 : 3;
    setActiveChapter((current) => {
      if (current === next) return current;
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

  const copyEmail = async () => {
    await navigator.clipboard.writeText("kuwano.t.24kdgn@gmail.com");
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1800);
  };

  return (
    <div className="site-shell">
      {featuredProjects.flatMap((project) => [project.media, project.mediaSecondary]).filter((src): src is string => Boolean(src)).map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
      <motion.div className="page-progress" style={{ scaleX: pageProgress }} />
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="site-id" href="#top" aria-label="桑野樹希のポートフォリオ・ページ先頭へ"><span>TATSUKI KUWANO<small>CREATIVE DEVELOPER · 2026</small></span></a>
        <nav aria-label="メインナビゲーション"><a href="#works"><span>01</span> WORKS</a><a href="#profile"><span>02</span> PROFILE</a><button type="button" className="header-contact" onClick={openContact}>お問い合わせ <ArrowUpRight size={14} /></button></nav>
        <div className="header-controls">
          <button type="button" className="header-contact-mobile" onClick={openContact}>相談する <ArrowUpRight size={14} /></button>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen((value) => !value)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="モバイルナビゲーション" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}>
            <a href="#works" onClick={() => setMobileMenuOpen(false)}><span>01</span>SKIP FACILITY / WORKS</a>
            <a href="#profile" onClick={() => setMobileMenuOpen(false)}><span>02</span>PROFILE</a>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main>
        {useStaticExperience ? (
          <StaticCinematic onOpen={openProject} onContact={openContact} />
        ) : (
          <SceneErrorBoundary fallback={<StaticCinematic onOpen={openProject} onContact={openContact} />}>
            <section className="cinematic" id="top" ref={cinematicRef}>
              <div className="cinematic-sticky">
                <div className="cinematic-canvas" aria-hidden="true">
                  {webGLSupported === true ? (
                    <CinematicScene
                      progressRef={progressRef}
                      activeChapter={activeChapter}
                      compact={compact}
                      active={sceneVisible}
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
                        <div className="intro-identity"><strong>桑野 樹希</strong><span>AR / AI / 3D CREATIVE DEVELOPER</span></div>
                        <h1>BUILDING<br />EXPERIENCE<br /><span>BEYOND SCREENS.</span></h1>
                        <p className="intro-copy">AR・AI・Web・3Dを横断し、<br />画面の外へ続く体験を設計・実装しています。</p>
                        <button type="button" className="intro-contact" onClick={openContact}>制作・開発を相談する <ArrowUpRight size={16} /></button>
                        <div className="scroll-cue"><ArrowDown size={17} /><span>SCROLL TO ENTER FACILITY</span></div>
                        <a className="skip-facility" href="#works">SKIP FACILITY <ArrowDown size={15} /></a>
                      </motion.div>
                    ) : chapterProject ? (
                      <motion.article className="chapter-card" key={chapterProject.id} initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                        <div className="chapter-copy">
                          <p className="system-label">CHAPTER {chapterProject.index} / {chapterProject.chapter}</p>
                          <h2>{chapterProject.title}</h2>
                          <h3>{chapterProject.titleJa}</h3>
                          <p>{chapterProject.summary}</p>
                          <div className="chapter-spec"><span>{chapterProject.metric}</span><span>{chapterProject.year}</span></div>
                          <div className="chapter-facts">{chapterProject.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>
                          <button onClick={() => openProject(chapterProject)}>OPEN PROJECT <ArrowUpRight size={16} /></button>
                        </div>
                        <div className="chapter-media"><ProjectVisual project={chapterProject} priority /><span>DOCUMENT / {chapterProject.index}</span></div>
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
            <div className="profile-bio">
              <div className="profile-portrait"><Image src="/media/profile-portrait.jpg" alt="桑野樹希のプロフィール写真" fill sizes="(max-width: 680px) 100vw, 38vw" /></div>
              <small>TATSUKI KUWANO</small><h3>桑野 樹希</h3><p>KADOKAWAドワンゴ情報工科学院 大学部所属。ARを軸に、AI、Web、3Dを組み合わせた体験づくりに取り組んでいます。</p><p>個人制作からチーム開発、企業・自治体プロジェクトまで経験。要件定義、バックエンド、管理画面、データ可視化、3D制作を横断します。</p>
            </div>
            <div className="capabilities">
              {[
                ["01", "SPATIAL", "AR / 3D / Interactive", "PROJECTS 02 · 06"],
                ["02", "INTELLIGENCE", "LLM / Voice / Memory", "PROJECTS 01 · 03 · 05"],
                ["03", "SYSTEM", "Backend / Database / Docker", "PROJECTS 01 · 07 · 08"],
                ["04", "INTERFACE", "Web / Dashboard / Data Viz", "PROJECTS 03 · 04"],
              ].map(([number, name, detail, related]) => <div key={number}><span>{number}</span><strong>{name}</strong><small>{detail}<a href="#works">{related}</a></small></div>)}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="system-label">OPEN COMMUNICATION CHANNEL</p>
          <h2>まだない体験を、<br /><span>一緒につくる。</span></h2>
          <p>展示、実験、プロダクト。アイデアを実際に触れられるところまで持っていきます。</p>
          <div className="contact-brief">
            <div><span>OPEN TO</span><strong>INTERNSHIP / PROJECT</strong></div>
            <div><span>BASE</span><strong>JAPAN / REMOTE</strong></div>
            <div><span>FOCUS</span><strong>AR / AI / 3D</strong></div>
          </div>
          <div className="contact-links">
            <button type="button" className="contact-open-button" onClick={openContact}><Mail size={20} />相談内容を送る<ArrowUpRight size={20} /></button>
            <a href="https://github.com/tatuki1107" target="_blank" rel="noreferrer"><Code2 size={20} />GitHubを見る<ArrowUpRight size={20} /></a>
            <button type="button" className="contact-copy-button" onClick={copyEmail}>{emailCopied ? <Check size={20} /> : <Copy size={20} />}{emailCopied ? "コピーしました" : "メールアドレスをコピー"}<span>kuwano.t.24kdgn@gmail.com</span></button>
          </div>
          <footer><span>© 2026 TATSUKI KUWANO</span><span>THREE.JS / NEXT.JS</span><a href="#top">BACK TO TOP ↑</a></footer>
        </section>
      </main>

      <AnimatePresence>{selectedProject ? <ProjectPanel project={selectedProject} onClose={closeProject} onContact={contactFromProject} /> : null}</AnimatePresence>
      <AnimatePresence>{contactOpen ? <ContactDialog onClose={closeContact} /> : null}</AnimatePresence>
    </div>
  );
}
