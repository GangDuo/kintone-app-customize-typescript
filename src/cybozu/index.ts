export class User {
    getUsers() { }

    static async getOrganizations(userCode: string): Promise<IOrganizationTitle[]> {
        const { organizationTitles } = await kintone.api(kintone.api.url("/v1/user/organizations.json"), 'GET', { code: userCode });
        return organizationTitles;
    }

    getGroups() { }
    getServices() { }
}

export class Organization {
    static async getOrganizations(organizationCodes: string[]): Promise<IOrganization[]> {
        const { organizations } = await kintone.api(kintone.api.url("/v1/organizations.json"), 'GET', { codes: organizationCodes });
        return organizations;
    }

    getUsers() { }
}

interface ITitle {
    id: number;
    code: string;
    name: string;
    description: string;
}

interface IOrganizationTitle {
    organization: IOrganization;
    title: ITitle;
}

interface IOrganization {
    id: number;
    code: string;
    name: string;
    localName: string;
    localNameLocale: string;
    parentCode: string;// | null;
    description: string;
}
