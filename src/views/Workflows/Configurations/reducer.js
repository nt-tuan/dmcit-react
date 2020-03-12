import { workflowConstants } from './constants';

const getNewWorkflow = () => ({ 
    id: null, name: '', description: '', tasks: [],
    launchType: 1,
    enabled: true,
    approval: false,
    stopWhenError: true,
    enableParallelJobs: false,
    editing: true
 });
const updateTask = (workflow, task) => {
    const editingTask = { ...workflow.editingTask, ...task };
    if (editingTask.isNew)
        return {
            ...workflow,
            editingTask
        };
    return {
        ...workflow,
        tasks: updateTasks(workflow.tasks, editingTask),
        editingTask
    };
}
const updateTasks = (tasks, task) => {
    return tasks.map(u => {
        if (u.id == task.id)
            return task;
        return u;
    })
}


export const workflowConfigReducer = (state, action) => {
    console.log(action.type, action, state);
    switch (action.type) {
        case workflowConstants.REQUEST_WORKFLOW_LIST:
            return { loading: true };
        case workflowConstants.REQUEST_WORKFLOW_LIST_SUCCESS:
            return { data: action.data };
        case workflowConstants.REQUEST_WORKFLOW_LIST_FAIL:
            return { error: action.error };
        case workflowConstants.REQUEST_WORKFLOW:
            return { data: state.data, loading: true };
        case workflowConstants.REQUEST_WORKFLOW_FAIL:
            return { data: state.data, error: action.error };
        case workflowConstants.SELECT_WORKFLOW:
            if (action.workflow)
                return { data: state.data, workflow: { ...action.workflow, editing: false } };
            else
                return { data: state.data };
        case workflowConstants.EDIT_WORKFLOW:
            if (state.workflow != null && state.workflow.id != null)
                return { ...state, workflow: { ...state.workflow, editing: true } };
            else
                return { data: state.data, workflow: { ...state.workflow, editing: false }, error: 'NO WORKFLOW SELECTED' };
        case workflowConstants.EDIT_WORKFLOW_TASK_SETTING: {
            return {
                ...state,
                workflow: {
                    ...state.workflow,
                    tasks: state.workflow.tasks.map((u, i) => {
                        if (i == state.workflow.selected) {
                            return {
                                ...u,
                                selected: action.index
                            }
                        }
                        return u;
                    })
                }
            }
        }
        case workflowConstants.CANCEL_EDIT_WORKFLOW:
            return { ...state, workflow: { ...state.workflow, editing: false } };
        case workflowConstants.ADD_WORKFLOW:
            return { data: state.data, workflow: getNewWorkflow() };
        case workflowConstants.CANCEL_ADD_WORKFLOW:
            return { data: state.data };
        case workflowConstants.REQUEST_SAVE_WORKFLOW:
            return { ...state, loading: true };
        case workflowConstants.SAVE_WORKFLOW_SUCCESS:
            return { data: action.data, workflow: { ...action.workflow, editing: false } };
        case workflowConstants.SAVE_WORKFLOW_FAIL:
            return { ...state, error: action.error };
        case workflowConstants.CHANGE_WORKFLOW_PROP:
            return { ...state, workflow: { ...state.workflow, [action.name]: action.value } };
        case workflowConstants.CHANGE_WORKFLOW_TASK_PROP:
            const editingTask = action.task;
            if (editingTask == null) return { ...state };
            return {
                ...state,
                workflow: {
                    ...state.workflow,
                    tasks: state.workflow.tasks.map((u, index) => {
                        if (index == action.index) {
                            return { ...editingTask }
                        }
                        return u;
                    })
                }
            };
    }
};
