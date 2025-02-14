const HANDLE_EVENT = 'app.record.create.show';
interface KintoneEvent {
  record: kintone.types.SavedFields;
}
kintone.events.on(HANDLE_EVENT, (event: KintoneEvent) => {
  event.record.単価.value = '1';
  event.record.ユーザー選択.value = [{name: '名前', code: 'コード'}];
  return event;
});