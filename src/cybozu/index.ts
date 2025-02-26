import type { CybozuTypes } from "./types";

export namespace Cybozu {
    export class User {
        getUsers() { }

        static async getOrganizations(userCode: string): Promise<CybozuTypes.OrganizationTitle[]> {
            const { organizationTitles } = await kintone.api(kintone.api.url("/v1/user/organizations.json"), 'GET', { code: userCode });
            return organizationTitles;
        }

        getGroups() { }
        getServices() { }
    }

    export class Organization {
        static async getOrganizations(organizationCodes: string[]): Promise<CybozuTypes.Organization[]> {
            const { organizations } = await kintone.api(kintone.api.url("/v1/organizations.json"), 'GET', { codes: organizationCodes });
            return organizations;
        }

        getUsers() { }
    }
}
