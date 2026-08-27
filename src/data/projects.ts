export type ProjectLink = { label: string; href: string };

export type ProjectVisual =
  | "communication"
  | "ar-gate"
  | "night-city"
  | "analytics"
  | "memory"
  | "community"
  | "collaboration"
  | "xreal";

export type Project = {
  id: string;
  index: string;
  chapter: string;
  title: string;
  titleJa: string;
  category: string;
  year?: string;
  summary: string;
  detail: string;
  decision: string;
  role: string[];
  technologies: string[];
  metric?: string;
  media?: string;
  mediaSecondary?: string;
  mediaAlt?: string;
  mediaSecondaryAlt?: string;
  mediaLabel?: string;
  mediaSecondaryLabel?: string;
  facts: string[];
  visualVariant: ProjectVisual;
  featuredRank?: 1 | 2 | 3;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "yui-ai",
    index: "01",
    chapter: "SIGNAL / VOICE",
    title: "YUI",
    titleJa: "3Dモデル対話AI",
    category: "VOICE × AI × 3D",
    year: "2025",
    summary: "声を聞き、考え、3Dキャラクターとして返す。文化祭の受付を、会話そのものが体験になる場所へ変えました。",
    detail: "来場者の音声をfaster-whisperで認識し、GPT-4o-miniの応答をVOICEVOXで発話。Babylon.js上の3Dキャラクターへ接続したリアルタイム対話システムです。React、Express、Python API、Docker構成まで一人で組み上げ、会話ログ保存とLINEへのエラー通知も含めて展示運用できる状態にしました。",
    decision: "展示会場で説明なしでも使えるよう、マイク操作から応答までを一本の体験に統合。複数サービスはDocker Composeで再現可能にしました。",
    role: ["企画・体験設計", "3Dフロントエンド", "音声／対話API", "Docker・展示運用"],
    technologies: ["React", "TypeScript", "Babylon.js", "faster-whisper", "OpenAI API", "VOICEVOX", "Docker"],
    metric: "END-TO-END / SOLO BUILD",
    media: "/media/yui-demo.gif",
    mediaAlt: "文化祭で稼働した3Dモデル対話AI YUIの画面",
    mediaLabel: "REAL-TIME DEMO",
    facts: ["SOLO BUILD", "FESTIVAL EXHIBITION", "FULL STACK"],
    visualVariant: "communication",
    featuredRank: 1,
    links: [{ label: "GitHub", href: "https://github.com/tatuki1107/bunkasaichatAI" }],
  },
  {
    id: "webar",
    index: "02",
    chapter: "LAYER / SPACE",
    title: "WEB AR MUSEUM",
    titleJa: "画像認識Web ARミュージアム",
    category: "WEB AR × EXHIBITION",
    year: "2024",
    summary: "印刷物を入口に、現実空間へ3D作品を呼び出す。インストール不要のAR展示を個人で公開しました。",
    detail: "スマートフォンのカメラで登録画像を認識し、対応する3Dモデルを現実空間へ重ねるWeb AR作品です。複数マーカー、アニメーション付きglTF、展示紹介画面を実装し、文化祭で来場者がその場でアクセスできる形にしました。",
    decision: "専用アプリを要求せず体験へ入れることを優先し、MindAR.jsとA-Frameを採用。URLを開いてカメラを向けるだけの導線にしました。",
    role: ["個人制作", "AR体験設計", "3Dアセット組み込み", "GitHub Pages公開"],
    technologies: ["MindAR.js", "A-Frame", "JavaScript", "glTF / GLB", "Web Camera"],
    metric: "INSTALL-FREE AR",
    media: "/media/webar-marker.jpg",
    mediaSecondary: "/media/webar-result.jpg",
    mediaAlt: "Web ARで読み取るりんごの画像マーカー",
    mediaSecondaryAlt: "画像認識後に表示される3Dのりんご",
    mediaLabel: "IMAGE MARKER",
    mediaSecondaryLabel: "3D RESULT",
    facts: ["SOLO BUILD", "FESTIVAL EXHIBITION", "GITHUB PAGES"],
    visualVariant: "ar-gate",
    featuredRank: 2,
    links: [
      { label: "Live demo", href: "https://tatuki1107.github.io/WebAR/" },
      { label: "GitHub", href: "https://github.com/tatuki1107/WebAR" },
    ],
  },
  {
    id: "kobe-night",
    index: "03",
    chapter: "ROUTE / CITY",
    title: "YORU NO TOBIRA",
    titleJa: "神戸ナイトタイムエコノミー",
    category: "CITY × AI CONCIERGE",
    year: "2026",
    summary: "検索結果ではなく、今夜歩きたくなる理由を返す。神戸の高架下周辺へ人を誘う観光コンシェルジュです。",
    detail: "ArtFanders Inc.でのインターンシップを通じ、神戸市からの依頼で制作されたAI観光コンシェルジュの開発に参加しました。気分や地元ならではの視点から夜の街を提案し、周辺の回遊につなげる体験を目指しています。",
    decision: "観光地の一覧表示ではなく、利用者の状況から次の行動へつなぐ会話体験を重視。実際の利用場面を想定してアプリケーションUIを実装しました。",
    role: ["アプリケーション開発", "UI実装", "体験設計への参加"],
    technologies: ["Web Application", "AI", "Tourism", "UX"],
    metric: "KOBE CITY PROJECT",
    media: "/media/kobe-01.png",
    mediaSecondary: "/media/kobe-02.png",
    mediaAlt: "神戸ナイトタイムエコノミーの利用画面",
    mediaSecondaryAlt: "神戸ナイトタイムエコノミーの提案画面",
    mediaLabel: "LIVE PRODUCT",
    mediaSecondaryLabel: "USE CASE",
    facts: ["KOBE CITY RELATED", "INTERNSHIP", "APP DEVELOPMENT"],
    visualVariant: "night-city",
    featuredRank: 3,
    links: [{ label: "Visit site", href: "https://yorunotobira.com/" }],
  },
  {
    id: "egographica",
    index: "04",
    chapter: "ART / OPERATIONS",
    title: "EGO GRAPHICA",
    titleJa: "アーティストとAIで対話するアートテック",
    category: "ART × DATA × OPERATIONS",
    year: "2026",
    summary: "アートとの対話を事業として運用するため、数字の向こうにある利用状況を見える形にしました。",
    detail: "ArtFanders株式会社のアートテックプラットフォームにバックエンド／アプリケーション開発として参加。会話数、売上、コイン消費、CV率、アーティスト別ランキングを扱う管理画面とCRM分析機能を実装しました。",
    decision: "運用担当者が期間やアーティストを切り替えながら判断できるよう、分析指標と絞り込みを一つの管理画面へ集約しました。",
    role: ["管理画面", "CRM分析", "データ可視化", "運用支援機能"],
    technologies: ["Backend", "Dashboard", "Analytics", "CRM"],
    metric: "BUSINESS OPERATIONS",
    media: "/media/egographica-official.png",
    mediaAlt: "egoGraphica公式プロダクトビジュアル",
    mediaLabel: "OFFICIAL PRODUCT",
    facts: ["COMPANY PROJECT", "ADMIN + CRM", "OPERATIONS"],
    visualVariant: "analytics",
    links: [
      { label: "Official", href: "https://egographica.art/" },
      { label: "App", href: "https://app.egographica.art/" },
      { label: "Press release", href: "https://prtimes.jp/main/html/rd/p/000000007.000169208.html" },
    ],
  },
  {
    id: "discord-bot",
    index: "05",
    chapter: "MEMORY / LOCAL",
    title: "SILVER HAIRED AI BOT",
    titleJa: "銀髪ロング美少女 Discord Bot",
    category: "LOCAL LLM × MEMORY",
    year: "2026",
    summary: "会話を忘れないキャラクターを、ローカルLLMと二層の記憶で設計しました。",
    detail: "Ollamaで動かすローカルLLMに人格を与え、Discord上で会話するBotです。直近履歴を扱う短期記憶と、要約・Embeddingを用いる長期記憶を組み合わせ、ストリーミング応答にも対応しました。",
    decision: "応答速度と文脈保持を両立するため、すべての履歴を毎回渡さず、短期履歴と検索可能な長期記憶へ分離しました。",
    role: ["個人開発", "会話設計", "記憶アーキテクチャ", "ストリーミング"],
    technologies: ["Ollama", "Discord", "Embedding", "Streaming"],
    metric: "1–2 SEC TO FIRST TOKEN",
    media: "/media/discord-bot.png",
    mediaAlt: "Discord上で動作するローカルLLM搭載Bot",
    mediaLabel: "CONVERSATION LOG",
    facts: ["SOLO BUILD", "1–2 SEC", "DUAL MEMORY"],
    visualVariant: "memory",
    links: [],
  },
  {
    id: "xreal-shooter",
    index: "06",
    chapter: "AR GLASSES / EXHIBITION",
    title: "XREAL SHOOTING EXPERIENCE",
    titleJa: "ARグラス シューティング展示",
    category: "XREAL × INTERACTIVE",
    summary: "ARグラスを使ったシューティングゲームを卒業展示会へ出展し、来場者の約40%が体験しました。",
    detail: "XREALを使用したシューティングゲームを制作し、卒業展示会の在校生展示物として公開しました。来場者の約40%に体験してもらった、装着型デバイスを用いるインタラクティブ展示です。",
    decision: "公開プロフィールで確認できる事実だけを掲載し、使用エンジンや未確認の技術構成は記載していません。",
    role: ["制作", "体験設計", "展示"],
    technologies: ["XREAL", "AR", "Interactive Experience"],
    metric: "≈40% OF VISITORS",
    mediaLabel: "EXHIBITION RECORD",
    facts: ["GRADUATE EXHIBITION", "≈40% VISITORS", "AR GLASSES"],
    visualVariant: "xreal",
    links: [],
  },
  {
    id: "motekatu",
    index: "07",
    chapter: "TEAM / WEB",
    title: "MOTEKATU",
    titleJa: "レビュー共有プラットフォーム",
    category: "TEAM DEVELOPMENT",
    year: "2024",
    summary: "レビューを共有するWebアプリを、Djangoによるチーム開発で形にしました。",
    detail: "『モテるための活動』をテーマに、ユーザーがレビューを共有するプラットフォーム型Webアプリです。静的HTMLをDjango上で動くWebアプリへ改修する作業を中心に担当しました。",
    decision: "既存画面を崩さずテンプレートへ移行し、チーム内で分担された機能と接続できる形に整理しました。",
    role: ["チーム開発", "HTML改修", "Djangoテンプレート対応"],
    technologies: ["Django", "MySQL", "AWS EC2", "Docker", "jQuery", "HTML / CSS"],
    metric: "8-PERSON TEAM",
    media: "/media/motekatu-01.png",
    mediaSecondary: "/media/motekatu-02.png",
    mediaAlt: "モテ活Webアプリのプロジェクト紹介画面",
    mediaSecondaryAlt: "モテ活Webアプリの機能紹介画面",
    mediaLabel: "PROJECT RECORD",
    mediaSecondaryLabel: "PRODUCT SCREEN",
    facts: ["8-PERSON TEAM", "1 OF 3 BACKEND", "DJANGO + AWS"],
    visualVariant: "community",
    links: [{ label: "GitHub", href: "https://github.com/vantan-project/motekatu" }],
  },
  {
    id: "suntory",
    index: "08",
    chapter: "TEAM / DATABASE",
    title: "INDUSTRY × ACADEMIA",
    titleJa: "産学連携企画",
    category: "DJANGO × DATABASE",
    year: "2024",
    summary: "企業との産学連携企画で、データベース要件とバックエンドを担当しました。",
    detail: "サントリーグローバルイノベーションセンターとの産学連携企画です。Djangoを用いたチーム制作で、データベースの要件定義、HTMLのWebアプリ化、バックエンド処理を担当しました。",
    decision: "画面から必要な情報構造を整理し、チームが実装できるデータベース要件へ落とし込みました。",
    role: ["DB要件定義", "バックエンド", "チーム開発"],
    technologies: ["Django", "MySQL", "JavaScript", "HTML / CSS", "Docker"],
    metric: "5-PERSON TEAM",
    media: "/media/hikariwo-lp.png",
    mediaAlt: "産学連携企画HIKARIWOのランディングページ",
    mediaLabel: "RELEASED PRODUCT",
    facts: ["5-PERSON TEAM", "1 OF 2 BACKEND", "REQUIREMENTS → RELEASE"],
    visualVariant: "collaboration",
    links: [{ label: "GitHub", href: "https://github.com/74616b756d69/TECJUM-teamE_hikariwo" }],
  },
];

export const featuredProjects = projects.filter((project) => project.featuredRank !== undefined);
export const additionalProjects = projects.filter((project) => project.featuredRank === undefined);
