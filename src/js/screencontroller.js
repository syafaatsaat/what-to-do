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
        document.querySelector(
            "#project-form-header").textContent = "New Project";
        this.projectDialog.showModal();
    }
    
    closeProjectModal() {
        this.projectDialog.close();
    }
    
    openProjectModalForEdit(project) {
        document.querySelector("#create-project-btn").textContent = "Save";
        document.querySelector(
            "#project-form-header").textContent = "Edit Project";
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
        document.querySelector("#create-task-btn").textContent = "Create";
        document.querySelector("#task-form-header").textContent = "New Task";
        this.taskDialog.showModal();
    }
    
    openTaskModalForEdit(task) {
        document.querySelector("#create-task-btn").textContent = "Save";
        document.querySelector("#task-form-header").textContent = "Edit Task";
        document.querySelector("#task-title").value = task.title;
        document.querySelector("#duedate").value = task.dueDate;
        document.querySelector("#priority").value = task.priority;
        document.querySelector("#task-description").value = task.description;
        document.querySelector("#hidden-task-id").value = task.id;
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
            iconsDiv.classList.add("icon-project");

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
        newTaskBtn.hidden = false;
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

            if (task.priority === "low") {
                priorityDiv.classList.add("low");
                priorityDiv.classList.remove("medium");
                priorityDiv.classList.remove("high");
            }
            else if (task.priority === "medium") {
                priorityDiv.classList.remove("low");
                priorityDiv.classList.add("medium");
                priorityDiv.classList.remove("high");
            }
            else {
                priorityDiv.classList.remove("low");
                priorityDiv.classList.remove("medium");
                priorityDiv.classList.add("high");
            }

            const dueDateDiv = document.createElement("div");
            dueDateDiv.classList.add("task-due-date");
            
            const calendarClockIcon = document.createElement("span");
            calendarClockIcon.classList.add("material-symbols-outlined");
            calendarClockIcon.classList.add("calendar-clock-icon");
            calendarClockIcon.textContent = "calendar_clock";

            const dueDateP = document.createElement("p");
            dueDateP.classList.add("due-date-text");
            dueDateP.textContent = task.dueDate;

            const descriptionP = document.createElement("p");
            descriptionP.classList.add("task-description");
            descriptionP.textContent = task.description;

            const iconsDiv = document.createElement("div");
            iconsDiv.classList.add("icon-task");

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

            dueDateDiv.appendChild(calendarClockIcon);
            dueDateDiv.appendChild(dueDateP);
            
            taskElemDiv.appendChild(titleDiv);
            taskElemDiv.appendChild(dueDateDiv);
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
        prioritySpan.classList.add("description-priority");
        prioritySpan.textContent = task.priority;
        priorityH4.appendChild(prioritySpan);

        if (task.priority === "low") {
            prioritySpan.classList.add("low");
            prioritySpan.classList.remove("medium");
            prioritySpan.classList.remove("high");
        }
        else if (task.priority === "medium") {
            prioritySpan.classList.remove("low");
            prioritySpan.classList.add("medium");
            prioritySpan.classList.remove("high");
        }
        else {
            prioritySpan.classList.remove("low");
            prioritySpan.classList.remove("medium");
            prioritySpan.classList.add("high");
        }

        const descriptionH4 = document.createElement("h4");
        descriptionH4.classList.add("description-desc");
        descriptionH4.textContent = "Description: ";
        const descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = task.description;
        descriptionH4.appendChild(descriptionSpan);

        const statusH4 = document.createElement("h4");
        statusH4.textContent = "Status: ";
        const statusSpan = document.createElement("span");
        statusSpan.textContent = task.status ? "Completed" : "In-progress";
        
        if (task.status) {
            statusSpan.classList.add("completed");
        }
        else {
            statusSpan.classList.remove("completed");
        }
        statusH4.appendChild(statusSpan);

        descriptionDiv.appendChild(titleH4);
        descriptionDiv.appendChild(statusH4);
        descriptionDiv.appendChild(dueDateH4);
        descriptionDiv.appendChild(priorityH4);
        descriptionDiv.appendChild(descriptionH4);

        return true;
    }

    updateTaskStatusView(taskID, status) {
        const taskElem = document.querySelector(`[data-task-id="${taskID}"]`);
        if (taskElem) {
            taskElem.classList.toggle("completed", status);
        }
    }

    updateTaskView(task) {
        const taskElem = document.querySelector(`[data-task-id="${task.id}"]`);
        if (!taskElem)
            return;

        const titleH4 = taskElem.querySelector(".task-title");
        titleH4.textContent = task.title;

        const dueDateP = taskElem.querySelector(".due-date-text");
        dueDateP.textContent = task.dueDate;

        const priorityDiv = taskElem.querySelector(".task-priority");
        priorityDiv.textContent = task.priority;

        const descriptionP = taskElem.querySelector(".task-description");
        descriptionP.textContent = task.description;

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

        console.log(formData);

        // edit
        if (formData.taskID) {
            if (!this.logic.editTask(projectID, formData.taskID, formData))
                return;

            const project = this.logic.storage.getProjectByID(projectID);
            const task = project.getTask(formData.taskID);

            if (!this.renderer.updateTaskView(task))
                return;

            if (this.currentTaskID === task.id) {
                this.renderer.renderTaskDescription(task);
            }

            this.dialogManager.closeTaskModal();
            return;
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
            this.renderer.updateTaskStatusView(
                updatedTask.id, updatedTask.status);
            if (this.currentTaskID === taskBtn.dataset.taskId) {
                this.renderer.renderTaskDescription(updatedTask);
            }
            return;
        }
        
        if (editBtn) {
            this.dialogManager.openTaskModalForEdit(task);
            return;
        }

        if (deleteBtn) {
            this.dialogManager.openDeleteTaskModal(task, project.id);
            return;
        }

        if (taskBtn) {
            if (this.currentTaskID === taskBtn.dataset.taskId) {
                this.currentTaskID = null;
                this.toggleTaskState();
                return;
            }

            if (this.renderer.renderTaskDescription(task)) {
                this.currentTaskID = task.id;
                this.swapTaskState(task.id);
                return;
            }
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

    swapTaskState(taskID) {
        const previousTask = this.tasksDiv.querySelector(".active");
        if (previousTask) {
            previousTask.classList.remove("active");
        }

        const newTask = this.tasksDiv.querySelector(`[data-task-id="${taskID}"]`);
        if (newTask) {
            newTask.classList.add("active");
        }
    }

    toggleTaskState() {
        this.renderer.renderTaskDescription(null);
        const task = this.tasksDiv.querySelector(".active");
        if (task) {
            task.classList.toggle("active");
        }
    }
}