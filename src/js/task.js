export class Task {
    constructor({
        title,
        description,
        dueDate=null,
        priority="Low",
        status=false,
        id
    }) {
        this.id = (id) ? id : crypto.randomUUID();
        this.title = (title && title.trim() !== "") ?
            title.trim() : "New Task";
        this.dueDate = (dueDate) ? 
            dueDate : new Date().toISOString().split('T')[0];
        this.description = (description && description.trim() !== "") ?
            description : "No Description";
        this.priority = priority;
        this.status = status;
    }
}