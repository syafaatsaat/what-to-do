import { Project } from "./project.js";

export class Storage {
    constructor() {
        this.vault = [];
        this.init();
    }

    init() {

    }

    addProject(project) {
        this.vault.push(project);
    }

    deleteProject(projectID) {
        this.vault = this.vault.filter(project => project.id !== projectID);
        return true;
    }

    getProjectByID(projectID) {
        return this.vault.find(project => project.id === projectID);
    }
}