import { Periodic, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getTodos() {
    const today = new Date();
    return await prisma.todo.findMany({
        where : {
            active : true
        },
        include : {
            reference : true,
            schedules : {
                where : {
                    date : {
                        gte : today
                    }
                },
                take : 1,
                orderBy : {
                    date : "asc"
                }
            },
            checks : {
                take : 1,
                orderBy : {
                    createdAt : "desc"
                }
            }
        }
    })
}

export async function deleteTodo(id: Todo['id']) {
    return await prisma.todo.delete({ where: { id } })
}

export async function getTodoById(id: Todo['id'])  {
    return await prisma.todo.findUnique({ 
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
            periodic : true,
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
            },
        }
    })
}

export async function updatePeriodByTodoId(id : Todo['id'], period : Periodic) {
    return await prisma.todo.update({
        where : {id},
        data : {
            periodic : period
        }
    })
}