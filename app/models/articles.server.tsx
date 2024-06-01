import { prisma } from "~/db.server";

export async function getArticles() {
    return await prisma.article.findMany({
        where : {
            active : true
        }
    })
}