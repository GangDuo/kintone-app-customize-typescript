export namespace CybozuTypes {
    export type Title = {
        id: number;
        code: string;
        name: string;
        description: string;
    };

    export type OrganizationTitle = {
        organization: Organization;
        title: Title | null;
    };

    export type Organization = {
        id: number;
        code: string;
        name: string;
        localName: string;
        localNameLocale: string;
        parentCode: string | null;
        description: string;
    };
}