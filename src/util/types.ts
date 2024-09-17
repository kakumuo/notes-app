export type NoteType = {
    _id: string,
    title: string,
    text: string, 
    notebooks: string[], 
    tags: string[],
    created: Date,
    updated: Date, 
}

export type NotebookType = {
    _id: string,
    title: string,
    bannerImg: string,
    text: string, 
    created: Date,
    updated: Date, 
}