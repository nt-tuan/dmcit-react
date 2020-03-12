import { workflowConstants as w } from './constants';
import { workflowServices as s } from '../services';
import { alertActions } from '../../../_actions';
const normalize = (workflow) => {
    const tasks = workflow.tasks.reduce((d, c) => {
        const settings = c.settings.map((u) => {
            const variables = u.variables.reduce((d, c) => {
                d[c.name] = c;
                return d;
            }, {});
            return { ...u, variables };
        }, {});
        d[c.id] = { ...c, settings };
        return d;
    }, {});
    return { ...workflow, tasks };
}

const GetWorkflowList = () => {
    return (dispatch, alert) => {
        dispatch({ type: w.REQUEST_WORKFLOW_LIST });
        s.getWorkflows()
            .then(data => {
                dispatch({ type: w.REQUEST_WORKFLOW_LIST_SUCCESS, data });
            })
            .catch(error => alert({ type: w.REQUEST_WORKFLOW_LIST_FAIL, error }));
    }
}


//Open a workflow configuration form for editing
const SelectWorkflowItem = (id) => {
    return (dispatch, layoutDispatch) => {
        alertActions.loading()(layoutDispatch);
        s.getWorkflow(id)
            .then(workflow => {
                const wf = {
                    ...workflow,
                    tasks: Object.keys(workflow.tasks).map(key =>
                        ({
                            ...workflow.tasks[key],
                            id: key,
                            settings: workflow.tasks[key].settings
                                .map(sk => ({
                                    ...sk,
                                    variables: Object
                                        .keys(sk.attributes)
                                        .map(vk => ({
                                            ...sk.attributes[vk],
                                            name: vk
                                        }))
                                }))
                        }))
                }
                dispatch({ type: w.SELECT_WORKFLOW, workflow: wf });
                alertActions.clear()(layoutDispatch);
            })
            .catch(error => {
                alertActions.error(error)(layoutDispatch);
                dispatch({ type: w.SELECT_WORKFLOW, workflow: null });
            });
    }
}

const CancelEditWorkflowItem = () => {
    return dispatch => dispatch({ type: w.CANCEL_EDIT_WORKFLOW });
}

//Open a add new workflow configuration form for creating new workflow
const AddWorkflowItem = () => {
    return dispatch => dispatch({ type: w.ADD_WORKFLOW });
}
const CancelAddWorkflowItem = () => {
    return dispatch => dispatch({ type: w.CANCEL_ADD_WORKFLOW });
}
const SaveWorkflow = (workflow) => {
    const wf = normalize(workflow);
    if (workflow.id) {
        return SaveEditedWorkflow(wf);
    }
    return SaveNewWorkflow(wf);
}

const SaveEditedWorkflow = (wf) => {
    return (dispatch, alert) => {
        alertActions.loading()(alert);
        s.editWorkflow(wf.id, wf)
            .then(() => GetWorkflowList()(dispatch, alert))
            .then(() => SelectWorkflowItem(wf.id)(dispatch, alert))
            .then(() => alertActions.clear()(alert))
            .catch(error => alertActions.error(error)(alert));
    }
}

const SaveNewWorkflow = (workflow) => {
    return (dispatch, alert) => {
        alertActions.loading()(alert);
        s.addWorkflow(workflow)
            .then(id => {
                GetWorkflowList()(dispatch, alert);
                return Promise.resolve(id);
            })
            .then(id => SelectWorkflowItem(id)(dispatch, alert))
            .then(() => alertActions.clear()(alert))
            .catch(error => {
                alertActions.error(error)(alert);
            });
    }
}
const EditWorkflow = () => {
    return dispatch => {
        dispatch({ type: w.EDIT_WORKFLOW });
    }
}

const ChangeWorkflowProperty = (name, value) => {
    return dispatch => dispatch({ type: w.CHANGE_WORKFLOW_PROP, name, value });
}
const ChangeWorkflowTaskProperty = (state, key, name, value) => {
    const task = state.workflow.tasks[key];
    return dispatch => dispatch({
        type: w.CHANGE_WORKFLOW_TASK_PROP,
        index: key,
        task: { ...task, [name]: value }
    });
}

const ChangeWorkflowTaskSettingProperty = (state, taskKey, settingKey, { name, value }) => {
    return dispatch => {
        const editingTask = state.workflow.tasks[taskKey];
        dispatch({
            type: w.CHANGE_WORKFLOW_TASK_PROP,
            task: {
                ...editingTask,
                settings: editingTask.settings.map((u, index) => {
                    if (index == settingKey) {
                        return { ...u, [name]: value }
                    }
                    return u;
                })
            },
            index: taskKey
        })
    };
}
const ChangeWorkflowTaskSettingVariable = (state, taskKey, settingKey, varKey, { name, value }) => {
    const editingTask = state.workflow.tasks[taskKey];
    console.log(taskKey, settingKey, varKey);
    return dispatch => dispatch({
        type: w.CHANGE_WORKFLOW_TASK_PROP,
        task: {
            ...editingTask,
            settings: editingTask.settings.map((u, index) => {
                if (index == settingKey) {
                    return {
                        ...u,
                        variables: u.variables.map((v, vindex) => {
                            if (vindex == varKey) {
                                return { ...v, [name]: value };
                            }
                            return v;
                        })
                    }
                }
                return u;
            })
        },
        index: taskKey
    });
}

const AddWorkflowTask = (state) => {
    return dispatch => {
        const id = state.workflow.tasks.reduce((pre, cur) => pre && parseInt(cur.id) < pre ? pre : parseInt(cur.id) + 1, 1);
        const tasks = [...state.workflow.tasks, { id, name: 'New Task', settings: [] }];
        dispatch({
            type: w.CHANGE_WORKFLOW_PROP,
            name: 'tasks',
            value: tasks
        });
    }
};
const AddWorkflowTaskSetting = (state, key) => {
    return dispatch => {
        const editingTask = state.workflow.tasks[key];
        const newValue = { name: 'New setting', value: '', variables: [] };
        dispatch({
            type: w.CHANGE_WORKFLOW_TASK_PROP,
            task: {
                ...editingTask,
                settings: [...editingTask.settings, newValue]
            },
            index: key
        });
    }
};

const AddWorkflowTaskSettingVariable = (state, taskKey, key, { name, value }) => {
    return dispatch => {
        const editingTask = state.workflow.tasks[taskKey];
        const editingSetting = editingTask.settings[key];

        dispatch({
            type: w.CHANGE_WORKFLOW_TASK_PROP,
            task: {
                ...editingTask,
                settings: editingTask.settings.map((u, i) => {
                    if (i == key) {
                        return {
                            ...u,
                            variables: [...editingSetting.variables, { name, value }]
                        }
                    }
                    return u;
                })
            },
            index: taskKey
        })
    }
};

//delete
const DeleteWorkflow = (state, id) => {
    return (dispatch, layout) => {
        s.deleteWorkflow(id)
            .then(() => {
                GetWorkflowList()(dispatch);
            })
            .catch(error => alertActions.error(error)(layout));
    }
}

//delete a workflow task at a specific index
const DeleteWorkflowTask = (state, index) => {
    return dispatch => {
        const tasks = state.workflow.tasks.filter((u, i) => i != index);
        dispatch({
            type: w.CHANGE_WORKFLOW_PROP,
            name: 'tasks',
            value: tasks
        });
    }
};

const DeleteWorkflowTaskSetting = (state, taskIndex, settingIndex) => {
    const editingTask = state.workflow.tasks[taskIndex];
    const settings = editingTask.settings.filter((u, i) => settingIndex != i);
    return dispatch => dispatch({
        type: w.CHANGE_WORKFLOW_TASK_PROP,
        task: {
            ...editingTask,
            settings
        },
        index: taskIndex
    });
};
const DeleteWorkflowTaskSettingVariable = (state, taskIndex, settingIndex, index) => {
    const editingTask = state.workflow.tasks[taskIndex];
    const editingSetting = editingTask.settings[settingIndex];
    const variables = editingSetting.variables.filter((u, i) => i != index);
    const editedSetting = { ...editingSetting, variables };
    const settings = editingTask.settings.map((u, i) => {
        if (i == settingIndex) {
            return editedSetting;
        }
        return u;
    });
    return dispatch => dispatch({
        type: w.CHANGE_WORKFLOW_TASK_PROP,
        task: {
            ...editingTask,
            settings
        },
        index: taskIndex
    });
}

//Positioning
const SwapTaskIndex = (state, first, second) => {
    return dispatch => {
        const firstTask = state.workflow.tasks[first];
        const secondTask = state.workflow.tasks[second];

        const tasks = state.workflow.tasks.map((u, i) => {
            if (i == second)
                return {...firstTask, id: secondTask.id};
            if (i == first)
                return {...secondTask, id: firstTask.id};
            return u;
        });

        dispatch({
            type: w.CHANGE_WORKFLOW_PROP,
            name: 'tasks',
            value: tasks
        });
    }
}

const SwapSettingIndex = (state, first, second) => {

}

export const workflowActions = {
    GetWorkflowList,
    SelectWorkflowItem,

    CancelEditWorkflowItem,
    CancelAddWorkflowItem,
    SaveWorkflow,

    EditWorkflow,
    DeleteWorkflow,
    
    ChangeWorkflowProperty,
    ChangeWorkflowTaskProperty,
    ChangeWorkflowTaskSettingProperty,
    ChangeWorkflowTaskSettingVariable,

    AddWorkflowItem,
    AddWorkflowTask,
    AddWorkflowTaskSetting,
    AddWorkflowTaskSettingVariable,

    DeleteWorkflowTask,
    DeleteWorkflowTaskSetting,
    DeleteWorkflowTaskSettingVariable,

    SwapTaskIndex
}

