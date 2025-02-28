export class Editor {
    record: any;

    static getSpaceElement() {
        return kintone.app.getHeaderSpaceElement() ?? kintone.app.record.getHeaderMenuSpaceElement();
    };

    addChangeEventListener(prop: string, listener: (event: any) => Promise<any>) {    
        kintone.events.on([`app.record.index.edit.show`, `app.record.edit.show`], (event) => {
            const spaceElement =Editor.getSpaceElement();
            if (spaceElement !== null) {
                const buttonEl = document.createElement("input");
                buttonEl.style.display = "none";
                buttonEl.classList.add("plugin-space-heading");
                buttonEl.type = "button";
                buttonEl.value = "button";
                buttonEl.onclick = () => {
                    kintone.app.record.set({ record: this.record });
                };

                const fragment = document.createDocumentFragment();
                fragment.appendChild(buttonEl);
                spaceElement.appendChild(fragment);
            }
            return event;
        });

        kintone.events.on([`app.record.index.edit.change.${prop}`, `app.record.edit.change.${prop}`, `app.record.create.change.${prop}`], (event) => {
            listener(event)
            .then(_ => {
                setTimeout(() => {
                    document.querySelector<HTMLElement>(".plugin-space-heading")?.click();
                }, 10);
            });
            return event;
        });
    };    
}
