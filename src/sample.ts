(function() {
    "use strict";

    // レコード一覧画面の表示イベント
    kintone.events.on('app.record.index.show', function(event) {
        console.log('レコード一覧画面が表示されました');
        // カスタマイズ処理をここに記述
        return event;
    });
})();
