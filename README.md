# 開発環境をつくる

## Live Server Extensionを使う

[cybozu.dev](https://cybozu.dev/ja/kintone/tips/development/customize/development-know-how/use-visual-studio-code-live-server-extension/)

## kintoneアプリのフィールド情報から型情報を生成する

```sh
# npx @kintone/dts-gen ... も可能
# kintone.types.Fields, kintone.types.SavedFieldsがfields.d.tsに生成されます
npx kintone-dts-gen --base-url https://sample.cybozu.com \
                            -u username \
                            -p password \
                      --app-id 12
```

オプション|説明
--|--
--base-url|カスタマイズする予定のURL
-u|ユーザー名
-p|パスワード
--app-id|カスタマイズするID
--type-name|出力する型名（未指定の場合Fields）<br>保存ずみの型としてSavedFields、保存前の型としてFieldsが生成* されま。
--namespace|出力する名前空間（未指定の場合kintone.* types）
-o|出力するファイル名（未指定の場合fields.d.ts）

[cybozu.dev](https://cybozu.dev/ja/id/9d7aff6319d6de6a821d142d/#generate-information-of-type)

## kintoneへ適用する

マニフェストファイルを作成し、CSSやJavaScriptファイルをkintoneへアップロード

```sh
mise install
mise run
```

[cybozu.dev](https://cybozu.dev/ja/kintone/sdk/development-environment/customize-uploader/)

## ブラウザデバッグ

1. 実行中のブラウザに接続する。

    ```bat
    msedge.exe --remote-debugging-port=9222 --user-data-dir=remote-debug-profile
    netstat -a | findstr :9222
    ```

    - 起動中のブラウザはすべて閉じていること
    - [code.visualstudio.com](https://code.visualstudio.com/docs/nodejs/browser-debugging#_attaching-to-browsers)

2. ビルド実行

    `npm run build` を実行し、`dist/sample.js` を作成する。

3. kintoneアプリの設定より`dist/sample.js` を**アップロード**または**URL指定で追加**。
4. vscodeの実行とデバッグを開き、以下の内容を`.vscode/launch.json`に記載する。その後、`Attach to Edge` をクリックする。

    ```
    {
        "version": "0.2.0",
        "configurations": [
            {
                "name": "Attach to Edge",
                "port": 9222,
                "request": "attach",
                "type": "msedge",
                "webRoot": "${workspaceFolder}"
            }
        ]
    }
    ```

5. `sample.ts` にブレイクポイントを設定する。
6. kintoneの一覧を表示すると設定したブレイクポイントで止まります。

## トラブルシューティング

### 9222ポートが開かない

設定 -> システムとパフォーマンス -> システム を開き、以下の設定項目をOFFにする。

- スタートアップ ブースト
- Edgeを閉じたときにバックグラウンド拡張機能とアプリの実行を続ける
