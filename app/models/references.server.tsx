import { prisma } from "~/db.server";

export async function getReferences() {
    return await prisma.reference.findMany({
        where : {
            active : true
        }
    })
}