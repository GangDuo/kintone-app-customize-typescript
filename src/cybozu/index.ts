import type { CybozuTypes } from "./types";

export namespace Cybozu {
    export type CodeNamePair = {
        code:string;
        name:string;
    };

    export class Client {
        static async goUpstream(
            userCode: string | null,
            organizationCode: string | null = null,
            footprints: CodeNamePair[] = []
        ): Promise<CodeNamePair[]> {
            let parentCode = null;
            const signed = [...footprints];

            if(userCode !== null) {
                const organizationTitles = await Cybozu.User.getOrganizations(userCode);
                if (organizationTitles.length === 0 || organizationTitles[0].organization.parentCode === null) {
                    return footprints;
                }
                signed.push({
                    code: organizationTitles[0].organization.code,
                    name: organizationTitles[0].organization.name
                });
                parentCode = organizationTitles[0].organization.parentCode;
            }

            if(organizationCode !== null) {
                const organizations = await Cybozu.Organization.getOrganizations([organizationCode]);
                if (organizations.length === 0) {
                    return footprints;
                }

                signed.push({
                    code: organizations[0].code,
                    name: organizations[0].name
                });
                parentCode = organizations[0].parentCode;
            }

            if(parentCode === null) return signed;
            return Client.goUpstream(null, parentCode, signed);
        }
    }

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
        private organization: CybozuTypes.Organization;

        private constructor(organization: CybozuTypes.Organization) {
            this.organization = organization;
        }

        get id(): number { return this.organization.id; }
        get code(): string { return this.organization.code; }
        get name(): string { return this.organization.name; }
        get localName(): string { return this.organization.localName; }
        get localNameLocale(): string { return this.organization.localNameLocale; }
        get parentCode(): string | null { return this.organization.parentCode; }
        get description(): string { return this.organization.description; }

        static async getOrganizations(organizationCodes: string[]): Promise<Organization[]> {
            const { organizations } = await kintone.api(kintone.api.url("/v1/organizations.json"), 'GET', { codes: organizationCodes });
            return organizations.map((val: CybozuTypes.Organization) => new Organization(val));
        }

        getUsers() { }
    }
}
