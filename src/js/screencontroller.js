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

    renderProjects(projectArray, currentProjectID) {
        this.projectsDiv.replaceChildren();

        // loop through project array to render
        // each as buttons
        projectArray.forEach(project => {
            const projectBtn = document.createElement("button");
            projectBtn.classList.add("project-btn");
            if (currentProjectID == project.id) {
                projectBtn.classList.add("active");
            }
            projectBtn.dataset.projectId = project.id;

            const titleSpan = document.createElement("span");
            titleSpan.textContent = project.title;
            titleSpan.classList.add("project-title");

            const iconsDiv = document.createElement("div");
            iconsDiv.classList.add("icons");

            const editIcon = document.createElement("span");
            editIcon.classList.add("material-symbols-outlined");
            editIcon.classList.add("edit-project-btn");
            editIcon.textContent = "edit";

            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("material-symbols-outlined");
            deleteIcon.classList.add("delete-project-btn");
            deleteIcon.textContent = "delete";

            iconsDiv.appendChild(editIcon);
            iconsDiv.appendChild(deleteIcon);

            projectBtn.appendChild(titleSpan);
            projectBtn.appendChild(iconsDiv);

            this.projectsDiv.appendChild(projectBtn);
        });
    }

    renderTasks(project, selectedTaskID) {
    }
}

export class ScreenController {
    constructor(appLogic=null) {
        this.dialogManager = new DialogManager();
        this.renderer = new Renderer();
        this.logic = appLogic;
        this.currentProjectID = null;
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

        this.projectForm.addEventListener("submit", (e) => {
            this.projectSubmitHandler(e)
        });
    }

    projectSubmitHandler(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(this.projectForm));
        console.log(formData);

        if (formData.projectID) {
            // edit project

        }
        else {
            // create project
            const newProject = this.logic.createProject(formData);
            
            this.currentProjectID = newProject.id;
            this.renderer.renderProjects(this.logic.storage.vault, this.currentProjectID);
            this.swapProjectState(newProject.id);
        }

        this.dialogManager.closeProjectModal();
    }

    swapProjectState(projectID) {
        const previousProject = this.projectDiv.querySelector(".active");
        if (previousProject) {
            previousProject.classList.remove("active");
        }

        const newProject = this.projectDiv.querySelector(
            `[data-project-id="${projectID}"]`
        );
        if (newProject) {
            newProject.classList.add("active");
        }
    }
}