import { str } from "crc-32";

(() => {
    // 識別コード
    ((prop) => {
        kintone.events.on([`app.record.index.edit.show`, `app.record.edit.show`], (event) => {
            // 編集不可
            event.record[prop].disabled = true;
            return event;
        });

        kintone.events.on([`app.record.create.submit`], (event) => {
            // 新規作成時に自動採番
            const seed = event.record.email.value;
            event.record[prop].value = (str(seed) >>> 0).toString(16);
            return event;
        });
    })('alias');
})();