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

    // キントーンのアカウント
    ((prop) => {
        let record_: any;

        kintone.events.on([`app.record.create.submit`, `app.record.index.edit.submit`, `app.record.edit.submit`], (event) => {
            if (event.record[prop].value.length > 1) {
                event.record[prop].error = '割り当ては1人のみです！';
                event.error = 'エラーです！';
            }
            return event;
        });

        kintone.events.on([`app.record.index.edit.show`, `app.record.edit.show`], (event) => {
            ['加盟店', '管理職'].forEach(prop => event.record[prop].disabled = true);

            const spaceElement = kintone.app.getHeaderSpaceElement() ?? kintone.app.record.getHeaderMenuSpaceElement();
            if (spaceElement !== null) {
                const buttonEl = document.createElement("input");
                buttonEl.style.display = "none";
                buttonEl.classList.add("plugin-space-heading");
                buttonEl.type = "button";
                buttonEl.value = "button";
                buttonEl.onclick = () => {
                    console.log('click');
                    console.log(record_);
                    kintone.app.record.set({ record: record_ });
                };

                const fragment = document.createDocumentFragment();
                fragment.appendChild(buttonEl);
                spaceElement.appendChild(fragment);
            }

            return event;
        });

        kintone.events.on([`app.record.index.edit.change.${prop}`, `app.record.edit.change.${prop}`, `app.record.create.change.${prop}`], (event) => {
            console.log(event);
            const { record } = event;

            if (event.changes.field.value.length === 0) {
                // 加盟店と保険代理店をクリアする
                event.record['加盟店'].value = [];
                event.record['管理職'].value = [];
                return event;
            }

            // エラー判定
            event.record[prop].error = null;
            event.error = null;
            if (event.changes.field.value.length > 1) {
                event.record[prop].error = '割り当ては1人のみです！';
                event.error = 'エラーです！';
                return event;
            }

            Promise.all(event.changes.field.value.map(async (x: any) => {
                const user = x.code;

                try {
                    const { organizationTitles } = await kintone.api(kintone.api.url("/v1/user/organizations.json") + `?code=${user}`, 'GET', {});
                    console.log(organizationTitles);
                    if (organizationTitles.lenght === 0 || organizationTitles[0].organization.parentCode === null) {
                        // 無所属
                        return null;
                    }

                    // 代理店情報取得
                    const dcode = organizationTitles[0].organization.parentCode;
                    const { organizations } = await kintone.api(kintone.api.url("/v1/organizations.json") + `?codes[0]=${dcode}`, 'GET', {});
                    console.log(organizations);
                    if (organizations.length === 0) {
                        // 加盟店ユーザー
                        return null;
                    }

                    // 加盟店
                    const kcode = organizations[0].parentCode;
                    const res2 = await kintone.api(kintone.api.url("/v1/organizations.json") + `?codes[0]=${kcode}`, 'GET', {});
                    console.log(res2);

                    if (organizations.length > 0 && res2.organizations.length === 0) {
                        // 代理店ユーザー
                        return {
                            da: null,
                            ka: { code: organizations[0].code, name: organizations[0].name }
                        };
                    } else {
                        // 一般職
                        return {
                            da: { code: organizations[0].code, name: organizations[0].name },
                            ka: { code: res2.organizations[0].code, name: res2.organizations[0].name }
                        };
                    }
                } catch (error: any) {
                    // error
                    console.log(error);
                    throw new Error(error);
                }
            })).then(xs_ => {
                const xs = xs_.filter(x => x);
                if (xs.length === 0) throw new Error('skip!');

                console.log(xs);
                console.log(record);
                xs.map(x => {
                    if (x.ka) record['加盟店'].value.push(x.ka);
                    if (x.da) record['管理職'].value.push(x.da);
                });
                record_ = record;
                console.log(record_);
                return event;
            }).then(_ => {
                setTimeout(() => document.querySelector<HTMLElement>(".plugin-space-heading")?.click(), 10);
            }).catch(e => console.error(e));

            return event;
        });
    })('キントーンのアカウント');
})();