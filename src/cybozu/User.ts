import type { CybozuTypes } from "./types";

export class User {
    getUsers() { }

    static async getOrganizations(userCode: string): Promise<CybozuTypes.OrganizationTitle[]> {
        const { organizationTitles } = await kintone.api(kintone.api.url("/v1/user/organizations.json"), 'GET', { code: userCode });
        return organizationTitles;
    }

    getGroups() { }
    getServices() { }
}