interface TodoProp {
    todo : {
        id: string;
        articleId : string;
        title : string;
        definition : string | null;
        referenceId : string;
        location : string | null;
        criteria : string | null;
        method : string | null;
        comments: string | null;
        record : string | null;
        createdAt: string;
        article : {
            name: string;
        }
        reference : {
            name : string;
        }
    }
}

export default function TodoInfo({todo} : TodoProp) {
    if (todo === null)
        return;
    
    return (
        <div>
            {
                todo?.articleId ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Article:</p>
                    <p>{todo?.article.name}</p>
                </div> : null
            }
            {
                todo?.title ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Title:</p>
                    <p>{todo?.title}</p>
                </div> : null
            }
            {
                todo?.referenceId ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Reference:</p>
                    <p>{todo?.reference.name}</p>
                </div> : null
            }
            {
                todo?.definition ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Definition:</p>
                    <p>{todo?.definition}</p>
                </div> : null
            }
            {
                todo?.location ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Location:</p>
                    <p>{todo?.location}</p>
                </div> : null
            }
            {
                todo?.criteria ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Criteria:</p>
                    <p>{todo?.criteria}</p>
                </div> : null
            }
            {
                todo?.method ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Method:</p>
                    <p>{todo?.method}</p>
                </div> : null
            }
            {
                todo?.record ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Record:</p>
                    <p>{todo?.record}</p>
                </div> : null
            }
            {
                todo?.comments ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Comments:</p>
                    <p>{todo?.comments}</p>
                </div> : null
            }
            {/* <p className="text-sm font-medium leading-6 text-gray-900">Created: {new Date(todo?.createdAt ?? 0).toLocaleDateString()}</p> */}
        </div>
    )
}