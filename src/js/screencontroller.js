class DialogManager {
    constructor() {
        this.projectDialog = document.querySelector("#project-dialog");
        this.projectForm = document.querySelector("#project-form");
        
        this.deleteDialog = document.querySelector("#delete-dialog");

        this.taskDialog = document.querySelector("#task-dialog");
        this.taskForm = document.querySelector("#task-form");

        this.setupEvents();
    }

    setupEvents() {
        // project
        this.projectDialog.addEventListener("close", () => {
            this.projectForm.reset();
            document.querySelector("#hidden-project-id").value = "";
        });
        this.deleteDialog.addEventListener("close", () => {
            document.querySelector("#delete-confirm-btn").dataset.projectId = "";
        });

        // task
        this.taskDialog.addEventListener("close", () => {
            this.taskForm.reset();
            document.querySelector("#hidden-task-id").value = "";
        });
        this.deleteDialog.addEventListener("close", () => {
            document.querySelector("#delete-confirm-btn").dataset.taskId = "";
            document.querySelector("#delete-confirm-btn").dataset.projectIdForTask = "";
        });
    }

    openProjectModal() {
        document.querySelector("#create-project-btn").textContent = "Create";
        this.projectDialog.showModal();
    }
    
    closeProjectModal() {
        this.projectDialog.close();
    }
    
    openProjectModalForEdit(project) {
        document.querySelector("#create-project-btn").textContent = "Save";
        document.querySelector("#project-title").value = project.title;
        document.querySelector("#hidden-project-id").value = project.id;
        this.projectDialog.showModal();
    }

    openDeleteProjectModal(project) {
        document.querySelector("#delete-confirm-btn").dataset.projectId = project.id;
        document.querySelector("#delete-title").textContent = project.title;
        document.querySelector("#delete-type").textContent = "project";
        this.deleteDialog.showModal();
    }

    openDeleteTaskModal(task, projectID) {
        document.querySelector("#delete-confirm-btn").dataset.taskId = task.id;
        document.querySelector("#delete-confirm-btn").dataset.projectIdForTask = projectID;
        document.querySelector("#delete-title").textContent = task.title;
        document.querySelector("#delete-type").textContent = "task";
        this.deleteDialog.showModal();
    }

    closeDeleteModal() {
        this.deleteDialog.close();
    }

    openTaskModal() {
        this.taskDialog.showModal();
    }

    closeTaskModal() {
        this.taskDialog.close();
    }
}

class Renderer {
    constructor() {
        this.projectsDiv = document.querySelector("#project-list");
        this.tasksDiv = document.querySelector("#tasks");
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

    updateProjectView(data) {
        const projectElement = document.querySelector(`[data-project-id="${data.id}"]`);
        if (projectElement) {
            const titleSpan = projectElement.querySelector(".project-title");
            const currentProject = document.querySelector("#current-project");
            titleSpan.textContent = data.title;
            currentProject.textContent = data.title;
        }
    }

    removeProjectView(project) {
        const projectElement = document.querySelector(`[data-project-id="${project.id}"]`);
        if (!projectElement)
            return;

        projectElement.remove();
        return true;
    }

    renderTasks(project, selectedTaskID) {
        const newTaskBtn = document.querySelector("#new-task-btn");
        this.tasksDiv.replaceChildren();

        if (!project) {
            document.querySelector("#current-project").textContent = "";
            newTaskBtn.disabled = true;
            return;
        }
        
        document.querySelector("#current-project").textContent = project.title;
        newTaskBtn.disabled = false;
        if (!project.tasks) {
            const noTaskP = document.createElement("p");
            noTaskP.textContent = "No task for now :)";
            this.tasksDiv.appendChild(noTaskP);

            return;
        }

        // todo: render every task from project.tasks
        project.tasks.forEach(task => {
            const taskElemDiv = document.createElement("div");
            taskElemDiv.dataset.taskId = task.id;
            taskElemDiv.dataset.projectIdForTask = project.id;
            taskElemDiv.classList.add("task");
            if (task.id === selectedTaskID) {
                taskElemDiv.classList.add("active");
            }

            const titleDiv = document.createElement("div");
            titleDiv.classList.add("task-title-container");

            const titleH4 = document.createElement("h4");
            titleH4.classList.add("task-title");
            titleH4.textContent = task.title;

            const priorityDiv = document.createElement("div");
            priorityDiv.classList.add(task.priority);
            priorityDiv.classList.add("task-priority");
            priorityDiv.textContent = task.priority;

            const descriptionP = document.createElement("p");
            descriptionP.classList.add("task-description");
            descriptionP.textContent = task.description;

            const iconsDiv = document.createElement("div");
            iconsDiv.classList.add("icon-container");

            const checkBoxIcon = document.createElement("span");
            checkBoxIcon.classList.add("material-symbols-outlined");
            checkBoxIcon.classList.add("checkbox-task-btn");
            checkBoxIcon.textContent = "check_box";

            const editIcon = document.createElement("span");
            editIcon.classList.add("material-symbols-outlined");
            editIcon.classList.add("edit-task-btn");
            editIcon.textContent = "edit";

            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("material-symbols-outlined");
            deleteIcon.classList.add("delete-task-btn");
            deleteIcon.textContent = "delete";

            if (task.status) {
                taskElemDiv.classList.add("completed");
            }

            titleDiv.appendChild(titleH4);
            titleDiv.appendChild(priorityDiv);

            taskElemDiv.appendChild(titleDiv);
            taskElemDiv.appendChild(descriptionP);

            iconsDiv.appendChild(checkBoxIcon);
            iconsDiv.appendChild(editIcon);
            iconsDiv.appendChild(deleteIcon);

            taskElemDiv.appendChild(iconsDiv);
            
            this.tasksDiv.appendChild(taskElemDiv);
        });
    }

    renderTaskDescription(task) {
        const descriptionDiv = document.querySelector("#description");
        descriptionDiv.replaceChildren();
        
        if (!task)
            return;

        const titleH4 = document.createElement("h4");
        titleH4.textContent = "Title: ";
        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;
        titleH4.appendChild(titleSpan);

        const dueDateH4 = document.createElement("h4");
        dueDateH4.textContent = "Due Date: ";
        const dueDateSpan = document.createElement("span");
        dueDateSpan.textContent = task.dueDate;
        dueDateH4.appendChild(dueDateSpan);

        const priorityH4 = document.createElement("h4");
        priorityH4.textContent = "Priority: ";
        const prioritySpan = document.createElement("span");
        prioritySpan.textContent = task.priority;
        priorityH4.appendChild(prioritySpan);

        const descriptionH4 = document.createElement("h4");
        descriptionH4.textContent = "Description: ";
        const descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = task.description;
        descriptionH4.appendChild(descriptionSpan);

        descriptionDiv.appendChild(titleH4);
        descriptionDiv.appendChild(dueDateH4);
        descriptionDiv.appendChild(priorityH4);
        descriptionDiv.appendChild(descriptionH4);

        return true;
    }

    removeTaskView(taskID) {
        const taskElem = document.querySelector(`[data-task-id="${taskID}"]`);

        if (!taskElem)
            return;

        taskElem.remove();

        return true;
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
    
        // delete
        this.confirmDeleteBtn = document.querySelector("#delete-confirm-btn");
        this.closeDeleteBtn = document.querySelector("#delete-close-btn");

        // tasks
        this.tasksDiv = document.querySelector("#tasks");
        this.newTaskBtn = document.querySelector("#new-task-btn");
        this.cancelTaskBtn = document.querySelector("#cancel-task-btn");
        this.createTaskBtn = document.querySelector("#create-task-btn");
        this.taskForm = document.querySelector("#task-form");

        this.setupEvents();
        this.init();
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

        this.projectDiv.addEventListener("click", (e) => {
            this.projectDivHandler(e)
        });

        // delete
        this.confirmDeleteBtn.addEventListener("click", (e) => {
            this.deleteProjectHandler(e);
            this.deleteTaskHandler(e);
        });
        this.closeDeleteBtn.addEventListener("click", () => {
            this.dialogManager.closeDeleteModal();
        });

        // todo: task buttons listeners
        this.newTaskBtn.addEventListener("click", () => {
            this.dialogManager.openTaskModal();
        });
        this.cancelTaskBtn.addEventListener("click", () => {
            this.dialogManager.closeTaskModal();
        });
        this.tasksDiv.addEventListener("click", (e) => {
            this.taskDivHandler(e);
        });
        this.taskForm.addEventListener("submit", (e) => {
            this.taskSubmitHandler(e);
        });

    }

    init() {
        if (!this.logic.storage.vault)
            return;

        this.renderer.renderProjects(this.logic.storage.vault);
    }

    projectSubmitHandler(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(this.projectForm));

        if (formData.projectID) {
            // edit project
            if (!this.logic.editProject(formData.projectID, formData))
                return;

            const project = this.logic.storage.getProjectByID(formData.projectID);
            this.renderer.updateProjectView(project);
        }
        else {
            // create project
            const newProject = this.logic.createProject(formData);
            
            this.currentProjectID = newProject.id;
            this.renderer.renderProjects(this.logic.storage.vault, this.currentProjectID);
            this.renderer.renderTasks(newProject, this.currentTaskID);
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

    projectDivHandler(e) {
        e.preventDefault();

        const projectBtn = e.target.closest(".project-btn");
        if (!projectBtn)
            return;

        const editBtn = e.target.closest(".edit-project-btn");
        const deleteBtn = e.target.closest(".delete-project-btn");
        const project = this.logic.storage.getProjectByID(projectBtn.dataset.projectId);

        if (editBtn) {
            this.dialogManager.openProjectModalForEdit(project);
            return;
        }

        if (deleteBtn) {
            this.dialogManager.openDeleteProjectModal(project);
            return;
        }

        if (projectBtn && (this.currentProjectID !== project.id)) {
            this.currentProjectID = project.id;
            this.renderer.renderTasks(project, this.currentTaskID);
            this.swapProjectState(project.id);
            return;
        }
    }

    deleteProjectHandler(e) {
        e.preventDefault();
        if (!e.target.dataset.projectId)
            return;

        const projectID = e.target.dataset.projectId;
        const project = this.logic.storage.getProjectByID(projectID);

        if (!this.logic.deleteProject(project.id))
            return;

        if (!this.renderer.removeProjectView(project))
            return;

        if (project.tasks.find(task => task.id === this.currentTaskID))
            this.renderer.renderTaskDescription(null);

        if (this.currentProjectID === project.id) {
            this.currentProjectID = null;
            this.renderer.renderTasks(null);
        }

        this.dialogManager.closeDeleteModal();
    }

    taskSubmitHandler(e) {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.taskForm));
        const projectID = this.currentProjectID;

        // edit
        if (formData.taskId) {
        }
        // create task
        else {
            this.logic.createTask(projectID, formData);
        }

        this.dialogManager.closeTaskModal();
        this.renderer.renderTasks(
            this.logic.storage.getProjectByID(projectID), 
            this.currentTaskID
        );
    }

    taskDivHandler(e) {
        e.preventDefault();

        const taskBtn = e.target.closest(".task");
        if (!taskBtn)
            return;

        const checkBoxBtn = e.target.closest(".checkbox-task-btn");
        const editBtn = e.target.closest(".edit-task-btn");
        const deleteBtn = e.target.closest(".delete-task-btn");

        const project = this.logic.storage.getProjectByID(
                            taskBtn.dataset.projectIdForTask
                        );
        const task = project.getTask(taskBtn.dataset.taskId);

        if (checkBoxBtn) {
            const updatedTask = this.logic.toggleTaskStatus(task);
            return;
        }
        
        if (editBtn) {
            return;
        }

        if (deleteBtn) {
            this.dialogManager.openDeleteTaskModal(task, project.id);
            return;
        }
    }

    deleteTaskHandler(e) {
        e.preventDefault();
        if (!e.target.dataset.taskId)
            return;

        const projectID = e.target.dataset.projectIdForTask;
        const taskID = e.target.dataset.taskId;

        if (!this.logic.deleteTask(projectID, taskID))
            return;

        if (!this.renderer.removeTaskView(taskID))
            return;

        if (taskID === this.currentTaskID) {
            this.renderer.renderTaskDescription(null);
        }

        this.dialogManager.closeDeleteModal();
    }
}