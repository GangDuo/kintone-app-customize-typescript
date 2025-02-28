import { User } from "./User";
import { Organization } from "./Organization";

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
                const organizationTitles = await User.getOrganizations(userCode);
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
                const organizations = await Organization.getOrganizations([organizationCode]);
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
}
