import { Todo } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getTodos() {
    return await prisma.todo.findMany({
        include : {
            reference : true
        }
    })
}

export async function deleteTodo(id: Todo['id']) {
    return await prisma.todo.delete({ where: { id } })
}

export async function getTodoById(id: Todo['id'])  {
    return await prisma.todo.findFirst({ 
        where: { id }, 
        select : {
            id: true,
            articleId : true,
            title : true,
            definition : true,
            referenceId : true,
            location : true,
            criteria : true,
            method : true,
            comments: true,
            record : true,
            createdAt: true,
            article : {
                select : {
                    name : true,
                }
            },
            reference : {
                select : {
                    name : true,
                }
            }
        }
    })
}