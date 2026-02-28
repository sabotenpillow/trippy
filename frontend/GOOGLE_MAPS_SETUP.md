# Google Maps API セットアップガイド

Trippyで地図機能を使用するには、Google Maps APIキーが必要です。

## 手順

### 1. Google Cloud Consoleにアクセス

https://console.cloud.google.com/

### 2. プロジェクトを作成

1. 左上の「プロジェクトを選択」をクリック
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を入力（例: trippy-app）
4. 「作成」をクリック

### 3. APIを有効化

1. ナビゲーションメニューから「APIとサービス」→「ライブラリ」を選択
2. 以下のAPIを検索して有効化：
   - **Maps JavaScript API**
   - **Places API**
   - **Directions API**（ルート検索用）

### 4. APIキーを作成

1. ナビゲーションメニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「APIキー」をクリック
3. APIキーが作成されます
4. （推奨）「キーを制限」をクリックして以下を設定：
   - アプリケーションの制限: HTTPリファラー
   - ウェブサイトの制限: 
     - `http://localhost:3000/*`（開発環境）
     - `https://yourdomain.com/*`（本番環境）
   - API の制限: 
     - Maps JavaScript API
     - Places API
     - Directions API

### 5. 環境変数を設定

プロジェクトルート（`frontend/`）に`.env.local`ファイルを作成：

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=あなたのAPIキー
```

### 6. アプリを再起動

```bash
npm run dev
```

## 料金について

Google Mapsには無料枠があります：

- **Maps JavaScript API**: 月28,000リクエストまで無料
- **Places API**: 月間数千リクエストまで無料
- **Directions API**: 月間数千リクエストまで無料

個人利用や小規模プロジェクトであれば、通常は無料枠内で収まります。

**ルート検索の料金**
- 1回のルート検索で、最大4つの移動手段（車、徒歩、公共交通機関、自転車）を検索します
- 各検索がDirections APIのリクエストとしてカウントされます
- 月間の無料枠を超えた場合、課金が発生します

詳細: https://cloud.google.com/maps-platform/pricing

## トラブルシューティング

### APIキーが機能しない

1. APIが有効化されているか確認
2. APIキーの制限設定を確認（localhost:3000が許可されているか）
3. ブラウザのコンソールでエラーメッセージを確認

### 地図が表示されない

1. `.env.local`ファイルが正しい場所にあるか確認
2. 環境変数名が`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`であることを確認
3. サーバーを再起動

## 開発のみで使用する場合

開発段階では、APIキーの制限を設定せずに使用することもできます（本番環境では推奨しません）。
