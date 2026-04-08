class DialogManager {
    constructor() {
        this.projectDialog = document.querySelector("#project-dialog");
        this.projectForm = document.querySelector("#project-form");
    }

    setupEvents() {
        // project
        this.projectDialog.addEventListener("close", () => {
            this.projectForm.reset();
        });
    }

    openProjectModal() {
        this.projectDialog.showModal();
    }

    closeProjectModal() {
        this.projectDialog.close();
    }
}

class Renderer {
    constructor() {
        this.projectsDiv = document.querySelector("#project-list");
        this.taskDiv = document.querySelector("#tasks");
    }

    renderProjects(projectArray, currentCategoryID) {
        this.projectsDiv.replaceChildren();

        // loop through project array to render
        // each as buttons
    }

    renderTasks(project, selectedTaskID) {
        this.taskDiv
    }
}

export class ScreenController {
    constructor(appLogic=null) {
        this.dialogManager = new DialogManager();
        this.renderer = new Renderer();
        this.logic = appLogic;
        this.currentCategoryID = null;
        this.currentTaskID = null;

        // projects
        this.newProjectBtn = document.querySelector("#new-project-btn");
        this.cancelProjectBtn = document.querySelector("#cancel-project-btn");
        this.createProjectBtn = document.querySelector("#create-project-btn");
        this.projectDiv = document.querySelector("#project-list");
        this.projectBtn = document.querySelector(".project-btn");
        this.projectForm = document.querySelector("#project-form");
    
        this.setupEvents();
    }

    setupEvents() {
        // projects
        this.newProjectBtn.addEventListener("click", () => {
            this.dialogManager.openProjectModal()
        });
        this.cancelProjectBtn.addEventListener("click", () => {
            this.dialogManager.closeProjectModal()
        });
    }
}