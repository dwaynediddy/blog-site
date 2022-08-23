export default {
    name: "comment",
    title: "Comment",
    type: "document",
    fields: [ 
        {
            name: "name",
            type: "string",
        },
        {
            title: "Approved",
            name: "approved",
            type: "boolean",
            description: "comments will be shown once approved",
        },
        {
            name: "email",
            type: "string",
        },
        {
            name: "comment",
            type: "text",
        },
        {
            name: "post",
            type: "reference",
            to: [{type: "post"}],
        },
    ],
}