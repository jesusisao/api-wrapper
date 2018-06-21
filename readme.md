# 説明用のWeb API

## 確認した動作環境

- Node.js v8.11.1
- npm v5.6.0

## 前提条件

- Node.js（JSの実行環境）がPCにインストールされている。
- npm（パッケージマネージャ）がPCにインストールされている。
- "npm install"コマンドで、package.jsonのdependenciesにある依存ライブラリがインストールされて、node_modulesフォルダが作られて中身がしっかり入っている状態である。

## 動かし方

- 当PJのapi-wrapper内で、npm run startコマンドを打つ。これによって、package.jsonのscriptsにある"start"のコマンドが動く。
- Webサーバーが起動し、APIがリクエストを待っている状態になったので、Chromeとかから"localhost:8080/"とかでアクセスしてみよう。
