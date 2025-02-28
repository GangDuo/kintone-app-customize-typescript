/**
 * cybozu.com共通管理の組織
 * grand_parent
 * └ parent
 *   └ child
 * childを選択するとparentとgrand_parentを自動入力する。
 */
import { Cybozu } from './cybozu';
import { Editor } from './Editor';

(() => {
    ((prop) => {
        const isMultipleSelections = (array: any[]): boolean => array.length > 1;

        const setMultipleSelectionsError = (event: any) => {
            event.record[prop].error = '割り当ては1人のみです！';
            event.error = 'エラーです！';
            return event;
        };

        const app = new Editor();
        app.addChangeEventListener(prop, (event) => {
            if ((event.changes.field.value.length === 0) || (isMultipleSelections(event.changes.field.value))) {
                return Promise.reject('ユーザ選択なし、または複数人選択！');
            }
        
            return Promise.all(event.changes.field.value.map(async (x: any) => {
                return await Cybozu.Client.goUpstream(x.code);
            })).then(array => {
                const xs = array.flat();
                if (xs.length === 0) throw new Error('skip!');
                xs.reverse();
    
                const elements = [event.record.grand_parent.value, event.record.parent.value];
                for (let i = 0; i < xs.length - 1; i++) {
                    elements[i].push(xs[i]);
                }
                app.record = event.record;
                return event;
            });
        });
    
        kintone.events.on([`app.record.create.submit`, `app.record.index.edit.submit`, `app.record.edit.submit`], (event) => {
            if (isMultipleSelections(event.record[prop].value)) {
                return setMultipleSelectionsError(event);
            }
            return event;
        });

        kintone.events.on([`app.record.index.edit.show`, `app.record.edit.show`], (event) => {
            ['grand_parent', 'parent'].forEach(prop => event.record[prop].disabled = true);
            return event;
        });

        kintone.events.on([`app.record.index.edit.change.${prop}`, `app.record.edit.change.${prop}`, `app.record.create.change.${prop}`], (event) => {
            if (event.changes.field.value.length === 0) {
                // 値をクリアする
                ['grand_parent', 'parent'].forEach(key => event.record[key].value = []);
                return event;
            }

            // エラー判定
            event.record[prop].error = null;
            event.error = null;
            if (isMultipleSelections(event.changes.field.value)) {
                return setMultipleSelectionsError(event);
            }
            return event;
        });
    })('キントーンのアカウント');
})();