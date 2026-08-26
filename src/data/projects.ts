export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  index: string;
  title: string;
  titleJa: string;
  category: string;
  year: string;
  summary: string;
  detail: string;
  role: string[];
  technologies: string[];
  media?: string;
  mediaAlt?: string;
  featured: boolean;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "yui-ai",
    index: "01",
    title: "YUI / 3D CONVERSATIONAL AI",
    titleJa: "3Dモデル対話AI",
    category: "AI × 3D × VOICE",
    year: "2025",
    summary: "声を聞き、考え、3Dキャラクターとして応答する。文化祭のために一人で組み上げた対話体験。",
    detail: "来場者がマイクで話しかけると、音声認識・LLM・音声合成を経て3Dキャラクターが応答する受付システムです。展示空間で迷わず使えることを重視し、フロントエンド、3D表示、バックエンド、Docker構成まで一貫して設計しました。",
    role: ["企画・体験設計", "3D実装", "フロントエンド", "バックエンド"],
    technologies: ["React", "TypeScript", "Babylon.js", "OpenAI API", "VOICEVOX", "Docker"],
    media: "/media/yui-demo.gif",
    mediaAlt: "3Dモデル対話AIのデモ画面",
    featured: true,
    links: [{ label: "GitHub", href: "https://github.com/tatuki1107/bunkasaichatAI" }],
  },
  {
    id: "webar",
    index: "02",
    title: "WEB AR MUSEUM",
    titleJa: "画像認識Web ARミュージアム",
    category: "WEB AR × EXHIBITION",
    year: "2024",
    summary: "画像を入口に、現実空間へ3Dモデルを呼び出す。企画から公開まで個人で制作したWeb AR展示。",
    detail: "スマートフォンのカメラで登録画像を認識し、対応する3Dモデルを現実空間へ表示します。複数マーカー、アニメーション付きglTF、展示紹介画面まで制作し、文化祭で来場者が体験できる状態まで公開しました。",
    role: ["個人制作", "AR体験設計", "3Dアセット組み込み", "公開運用"],
    technologies: ["MindAR.js", "A-Frame", "JavaScript", "glTF / GLB"],
    featured: true,
    links: [
      { label: "Live demo", href: "https://tatuki1107.github.io/WebAR/" },
      { label: "GitHub", href: "https://github.com/tatuki1107/WebAR" },
    ],
  },
  {
    id: "egographica",
    index: "03",
    title: "EGO GRAPHICA",
    titleJa: "アーティストとAIで対話するアートテック",
    category: "ART × AI × DATA",
    year: "2026",
    summary: "現代アーティストとAIを介して対話するサービス。その運用を支える管理画面と分析基盤を開発。",
    detail: "ArtFanders株式会社が提供するアートテックプラットフォームに、バックエンド／アプリケーション開発として参加しました。会話数、売上、コイン消費、CV率、アーティスト別ランキングを可視化し、実運用とマーケティング判断を支える管理画面を実装しました。",
    role: ["管理画面", "CRM分析", "データ可視化", "運用支援機能"],
    technologies: ["Backend", "Dashboard", "Analytics", "CRM"],
    featured: true,
    links: [
      { label: "Official", href: "https://egographica.art/" },
      { label: "App", href: "https://app.egographica.art/" },
      { label: "Press release", href: "https://prtimes.jp/main/html/rd/p/000000007.000169208.html" },
    ],
  },
  {
    id: "kobe-night",
    index: "04",
    title: "YORU NO TOBIRA",
    titleJa: "神戸ナイトタイムエコノミー",
    category: "CITY × AI CONCIERGE",
    year: "2026",
    summary: "神戸の夜を、AIとの会話から歩き出す。高架下周辺の回遊を促す観光コンシェルジュ。",
    detail: "ArtFanders Inc.とのインターンシップを通じ、神戸市からの依頼で制作されたAI観光コンシェルジュの開発に参加しました。観光地の検索ではなく、その時の気分や地元の視点から夜の街を歩きたくなる体験を目指しています。",
    role: ["アプリケーション開発", "UI実装", "体験設計への参加"],
    technologies: ["Web Application", "AI", "Tourism", "UX"],
    media: "/media/kobe-01.png",
    mediaAlt: "神戸ナイトタイムエコノミーのユースケース画面",
    featured: true,
    links: [{ label: "Visit site", href: "https://yorunotobira.com/" }],
  },
  {
    id: "discord-bot",
    index: "05",
    title: "SILVER HAIRED AI BOT",
    titleJa: "銀髪ロング美少女 Discord Bot",
    category: "LOCAL LLM × MEMORY",
    year: "2026",
    summary: "人格、短期記憶、長期記憶を持ち、会話から成長するローカルLLM搭載Discord Bot。",
    detail: "Ollamaを利用したローカルLLMにキャラクター人格を与え、Discord上で自然な会話を行うBotです。ストリーミングによる高速応答、直近会話の短期記憶、要約とEmbeddingを用いた長期記憶を組み合わせています。",
    role: ["個人開発", "会話設計", "記憶アーキテクチャ", "ストリーミング"],
    technologies: ["Ollama", "Discord", "Embedding", "Streaming"],
    media: "/media/discord-bot.png",
    mediaAlt: "Discord上で動作する会話AI Bot",
    featured: true,
    links: [],
  },
  {
    id: "motekatu",
    index: "06",
    title: "MOTEKATU",
    titleJa: "レビュー共有プラットフォーム",
    category: "TEAM DEVELOPMENT",
    year: "2024",
    summary: "“モテるための活動”を題材に、ユーザーのレビューを集約するWebアプリ。",
    detail: "Djangoを用いたチーム開発に参加。静的HTMLをWebアプリとして動作させるための改修を中心に担当しました。",
    role: ["チーム開発", "HTML改修", "Djangoテンプレート対応"],
    technologies: ["Django", "HTML", "CSS"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/vantan-project/motekatu" }],
  },
  {
    id: "suntory",
    index: "07",
    title: "INDUSTRY × ACADEMIA",
    titleJa: "産学連携企画",
    category: "DJANGO × DATABASE",
    year: "2024",
    summary: "サントリーグローバルイノベーションセンターとの産学連携企画で、DB要件定義とバックエンドを担当。",
    detail: "Djangoを利用したチーム制作で、データベースの要件定義、HTMLのWebアプリ化、バックエンド処理を担当しました。",
    role: ["DB要件定義", "バックエンド", "チーム開発"],
    technologies: ["Django", "Database", "Backend"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/74616b756d69/TECJUM-teamE_hikariwo" }],
  },
];
