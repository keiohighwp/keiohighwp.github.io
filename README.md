# 慶應義塾高等学校 水球部 サイト

| URL | ファイル | 対象 |
|---|---|---|
| /welcome/ | welcome/index.html | 新入生（公開） |
| /welcome/award.html | welcome/award.html | 歴史と表彰（公開） |
| /student/ | student/index.html | 部員 |
| /guardian/ | guardian/index.html | 保護者 |
| /internal/ | internal/index.html | 指導者（正本） |
| / | index.html | /welcome/ へ転送 |

## 共通ファイル（全ページが読み込む）

- `assets/canon.js` … ★正本データ。創部年・ビジョン・練習時間・シーズン・表彰・役割・線引き・360°評価・日誌・連絡ツール・安全。共通の事実はここだけを直す
- `assets/site.css` … デザイン（色・文字はファイル冒頭のトークンで管理）
- `assets/app.js` … 差し込みとタブの仕組み（通常は触らない）

`canon.js` の `def` が正本の表現、`plain` が保護者・新入生向けの翻訳です。`def` を変えたら `plain` も一緒に見直してください。

## 受賞者の追加

`assets/canon.js` → `awards` → 該当の賞の `winners` に1行追加し、`next`（選考中の年度）を1つ進めます。
3月の年間表彰は、前年4月から始まる年度に属します（2027年3月の表彰 ＝ 2026年度）。

## 部則

`student/index.html` にあります。変更したら、慶應水球BOT（LINE）の知識も同時に更新してください。

## タブへの直接リンク

URLの末尾に `#タブID` を付けると、そのタブを開いた状態で表示されます。例：`/student/#safety`
