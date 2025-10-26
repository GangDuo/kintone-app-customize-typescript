const HANDLE_EVENT = 'app.record.create.show';
interface KintoneEvent {
  record: kintone.types.SavedFields;
}
kintone.events.on(HANDLE_EVENT, (event: KintoneEvent) => {
  event.record.単価.value = '1';
  event.record.ユーザー選択.value = [{name: '名前', code: 'コード'}];
  return event;
});

// レコード一覧画面の表示イベント
kintone.events.on('app.record.index.show', (event) => {
    console.log('レコード一覧画面が表示されました', event);
    // カスタマイズ処理をここに記述
    return event;
});
