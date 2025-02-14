declare namespace kintone.types {
    interface Fields {
      単価: kintone.fieldTypes.Number;
      ユーザー選択: kintone.fieldTypes.UserSelect;
    }
    interface SavedFields extends Fields {
      $id: kintone.fieldTypes.Id;
      $revision: kintone.fieldTypes.Revision;
      更新者: kintone.fieldTypes.Modifier;
      作成者: kintone.fieldTypes.Creator;
      レコード番号: kintone.fieldTypes.RecordNumber;
      更新日時: kintone.fieldTypes.UpdatedTime;
      作成日時: kintone.fieldTypes.CreatedTime;
    }
  }
  