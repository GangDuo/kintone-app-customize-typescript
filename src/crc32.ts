import crc32 from 'crc/crc32';

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
            event.record[prop].value = crc32(seed).toString(16);
            return event;
        });
    })('alias');
})();