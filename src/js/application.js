import { Project } from "./project.js";
import { Task } from "./task.js";

export class Application {
    constructor(storage) {
        this.storage = storage;
    }

    createProject(data) {
        let project = new Project(data);
        this.storage.addProject(project);
        return project;
    }

    editProject(projectID, data) {
        let project = this.storage.getProjectByID(projectID);
        if (data.title !== undefined) {
            project.title = data.title;
        }

        return true;
    }

    deleteProject(projectID) {
        if (!this.storage.deleteProject(projectID))
            return;

        return true;
    }

    createTask(projectID, data) {
        let project = this.storage.getProjectByID(projectID);
        let task = new Task(data);
        project.addTask(task);
    }

    deleteTask(projectID, taskID) {
        let project = this.storage.getProjectByID(projectID);
        if (!project.deleteTask(taskID))
            return;

        return true;
    }

    toggleTaskStatus(task) {
        task.status = !task.status;
        return task;
    }
}