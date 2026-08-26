# Tatsuki Kuwano — Portfolio

桑野樹希のAR・AI・Web・3D作品をまとめた、インタラクティブなポートフォリオサイトです。

## Stack

- Next.js 16 / React 19 / TypeScript
- React Three Fiber / Three.js / Drei
- Motion
- CSS Modules-free custom design system
- Vercel

## Features

- ネイティブスクロールと同期して宇宙開発施設を進む、約430vhの3Dシネマティック体験
- YUI、WebAR、神戸ナイトタイムエコノミーの3地点と詳細パネルを連動
- 代表作3件と追加実績5件を収録した作品アーカイブ
- 作品オブジェクトのレイキャスト選択、軽いポインター視差、限定的なドラッグ操作
- デスクトップ／モバイル別の3D負荷最適化
- `prefers-reduced-motion`、キーボード操作、フォーカス管理への対応
- 初期OFFのオプション操作音
- OGP、サイトマップ、robots.txt

## Development

```bash
npm install
npm run dev
```

本番確認:

```bash
npm run lint
npm run build
```

## Environment

公開URLを変更する場合は、Vercelで次の環境変数を設定します。

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Author

[tatuki1107](https://github.com/tatuki1107)
