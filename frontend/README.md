# Trippy - Travel Itinerary Sharing App

A travel itinerary sharing app that allows you to create and share trip plans with stops, stay durations, and transportation details via URL.

🌐 **Multi-language support**: English (US/UK) and Japanese

## Features

- ✈️ Create multi-day travel plans
- 📍 Add, delete, and reorder locations
- ⏱️ Set stay and travel times
- 🚆 Record transportation methods
- 🗺️ **Google Maps Integration**
  - Location search (Places Autocomplete)
  - Map markers
  - Route display
  - **🔍 Route Search**
    - Automatic time calculation for car 🚗, walking 🚶, transit 🚆, cycling 🚴
    - Distance information
    - Compare multiple transportation modes
- 🔗 Easy URL sharing (no backend required)
- 👀 Edit mode and preview mode
- 📱 Mobile, tablet, and desktop responsive
- 💰 **Google AdSense Integration** (optional)
- 🌐 **Multi-language Support**
  - English (US) 🇺🇸
  - English (UK) 🇬🇧
  - Japanese 🇯🇵
  - Automatic browser language detection
  - Language preserved in shared URLs

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Maps API キーの設定（オプション）

地図機能とルート検索を使用する場合は、Google Maps API キーが必要です。

1. [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/) にアクセス
2. プロジェクトを作成または選択
3. 以下のAPIを有効化：
   - Maps JavaScript API
   - Places API
   - Directions API（ルート検索用）
4. APIキーを作成
5. `.env.local`ファイルを作成して設定：

```bash
# .env.local.exampleをコピー
cp .env.local.example .env.local

# APIキーを設定
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**注意**: APIキー未設定でもアプリは動作しますが、地図機能とルート検索は利用できません（手動入力は可能）。

詳細は `GOOGLE_MAPS_SETUP.md` を参照してください。

### 3. Google AdSense の設定（オプション）

広告収益を得たい場合は、Google AdSenseを設定できます。

1. [Google AdSense](https://www.google.com/adsense/) でアカウントを作成
2. サイトを追加して審査を申請
3. 承認後、クライアントIDを取得
4. `.env.local`に追加：

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

5. `app/page.tsx`の`adSlot`を実際の広告スロットIDに変更

**バックエンド不要**: AdSenseは完全にクライアントサイドで動作します。

詳細は `ADSENSE_SETUP.md` を参照してください。

### 4. 開発サーバー起動

```bash
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

### 5. プロダクションビルド

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 16** (App Router with i18n)
- **TypeScript**
- **Tailwind CSS**
- **React 19**
- **next-intl** (Internationalization)
- **Google Maps JavaScript API**
  - Places API
  - Directions API

## Language Support

Trippy supports multiple languages with automatic detection:

- 🇺🇸 **English (US)** - American English
- 🇬🇧 **English (UK)** - British English  
- 🇯🇵 **Japanese** - 日本語

The app automatically detects your browser language and displays the appropriate version. You can manually switch languages using the selector in the header. When you share a URL, the selected language is preserved.

For more details on internationalization, see [I18N_GUIDE.md](./I18N_GUIDE.md).

## How to Use

### 1. プランの作成

- 「新規作成」ボタンで新しい旅行プランを開始
- タイトルを入力
- 「地点を追加」で各地点の情報を入力
- 「日を追加」で複数日の旅程を作成

### 2. 地点の設定

- **地点名**: Google Places検索で地点を選択（APIキー設定時）または手動入力
- **滞在時間**: その地点での滞在時間を分単位で入力
- **メモ**: オプションで追加情報を記入
- **並び替え**: ▲▼ボタンで地点の順序を変更

### 3. 移動ルートの設定（NEW!）

2つの方法で移動情報を設定できます：

#### A. 自動検索（推奨・APIキー必要）

1. 地点間に表示される「🔍 ルート検索」ボタンをクリック
2. Google Directions Serviceが自動で以下を計算：
   - 車🚗
   - 徒歩🚶
   - 公共交通機関🚆
   - 自転車🚴
3. 最適な移動手段を選択すると自動的に設定されます
   - 移動方法
   - 移動時間
   - 移動距離

#### B. 手動入力

移動方法と時間を直接入力することも可能です。

### 4. 地図表示

- 地点に座標が設定されている場合、「🗺️ マップ表示」セクションで地図を確認
- マーカーをクリックすると地点情報を表示
- 複数の地点がある場合、ルートが線で表示されます

### 5. 共有

- 「📋 共有リンクをコピー」でURLをコピー
- URLをシェアするだけで誰でも閲覧可能
- すべてのデータはURLに含まれるため、バックエンド不要

### 6. プレビュー

- 「プレビュー」タブでタイムライン表示を確認
- 各日の合計時間（滞在+移動）も表示
- 移動手段のアイコンも表示

## データ構造

プランデータはURLクエリパラメータにBase64エンコードして保存されます。
バックエンドやデータベースは不要で、完全にクライアント側で動作します。

### データモデル

```typescript
interface TripPlan {
  title: string;
  days: Day[];
}

interface Day {
  date: string; // ISO 8601 (YYYY-MM-DD)
  locations: Location[];
}

interface Location {
  id: string;
  name: string;
  stayDuration: number; // minutes
  notes?: string;
  coordinates?: { lat: number; lng: number };
  placeId?: string;
  transport?: Transport;
}

interface Transport {
  method: string;
  duration: number; // minutes
  distance?: number; // meters
  travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';
}
```

## Google Maps API 料金について

Google Mapsには無料枠があります：

- **Maps JavaScript API**: 月28,000リクエストまで無料
- **Places API**: 月間数千リクエストまで無料
- **Directions API**: 月間数千リクエストまで無料

個人利用や小規模プロジェクトであれば、通常は無料枠内で収まります。

詳細: https://cloud.google.com/maps-platform/pricing

## ライセンス

MIT
