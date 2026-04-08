import { Project } from "./project.js";

export class Application {
    constructor(storage) {
        this.storage = storage;
    }

    createProject(data) {
        let project = new Project(data);
        this.storage.addProject(project);
        return project;
    }
}