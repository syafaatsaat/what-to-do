export class Project {
    constructor({id, title}) {
        this.id = (id) ? id : crypto.randomUUID();
        this.title = (title && title.trim() !== "") ? 
                        title.trim() : "New Project";
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        return true;
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }
}