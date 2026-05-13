import { Task } from "./task.js";
import { Project } from "./project.js";

export class Storage {
  constructor() {
    this.vault = [];
    this.init();
  }

  init() {
    this.setLocalStorageData();
  }

  addProject(project) {
    this.vault.push(project);
  }

  deleteProject(projectID) {
    this.vault = this.vault.filter((project) => project.id !== projectID);
    return true;
  }

  getProjectByID(projectID) {
    return this.vault.find((project) => project.id === projectID);
  }

  setLocalStorageData() {
    if (!localStorage.getItem("vault")) {
      this.updateLocalStorage();
      return;
    }

    let data = JSON.parse(localStorage.getItem("vault"));
    data.forEach((project) => {
      let newProject = new Project(project);
      project.tasks.forEach((task) => {
        let newTask = new Task(task);
        newProject.addTask(newTask);
      });

      this.vault.push(newProject);
    });
  }

  updateLocalStorage() {
    let vaultArr = JSON.stringify(this.vault);
    console.log(vaultArr);
    localStorage.setItem("vault", vaultArr);
  }
}
