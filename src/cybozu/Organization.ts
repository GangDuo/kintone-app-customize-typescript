import type { CybozuTypes } from "./types";

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
