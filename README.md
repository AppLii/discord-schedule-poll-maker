# Discord 日程調整アンケート作成ツール

Discord コミュニティでの日程調整アンケートを簡単に作成できる Next.js アプリケーションです。

## URL

- [https://applii-wu.net/discord-schedule-poll-maker/](https://applii-wu.net/discord-schedule-poll-maker/)
- [https://applii.github.io/discord-schedule-poll-maker/](https://applii.github.io/discord-schedule-poll-maker/)

## 機能

- **イベント概要の入力**: イベントの内容や概要を自由に記述
- **日程候補の追加**: 日付と時間を選択して候補日を追加
- **自動絵文字割り当て**: 各候補日に Discord の絵文字(1️⃣, 2️⃣, 3️⃣...)を自動割り当て
- **リアルタイムプレビュー**: 入力内容が即座にプレビューに反映
- **ワンクリックコピー**: 作成したメッセージをクリップボードにコピー
- **静的サイト出力**: 完全に静的な HTML として出力可能

## 使い方

1. 「イベント概要」にイベントの説明を入力
2. 「日程候補を追加」セクションで日付と時間を選択
3. 「候補日を追加」ボタンをクリック
4. プレビューを確認
5. 「クリップボードにコピー」ボタンをクリック
6. Discord のチャンネルに貼り付け
7. 各候補日の絵文字をリアクションとして追加

## 開発環境のセットアップ

### 必要要件

- Node.js 18 以上
- yarn

### インストール

```bash
yarn install
```

### 開発サーバーの起動

```bash
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 技術スタック

- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: スタイリング
- **Static Export**: 完全静的サイト生成

## ライセンス

MIT
