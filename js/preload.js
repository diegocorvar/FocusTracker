const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendTaskToInsert: (data) => ipcRenderer.invoke('insert-task', data),
    sendTaskToRename: (data) => ipcRenderer.invoke('rename-task', data),
    sendTaskToDelete: (data) => ipcRenderer.invoke('delete-task', data),
    sendTaskToComplete: (data) => ipcRenderer.invoke('complete-task', data),
    sendTaskToIncomplete: (data) => ipcRenderer.invoke('incomplete-task', data),
    requestIncompleteTasks: () => ipcRenderer.invoke('get-incomplete-tasks-ids'),
    requestTaskName: (data) => ipcRenderer.invoke('get-task-name', data),
    sendTaskToIncreseFocusTime: (data) => ipcRenderer.invoke('increase-task-focus-time', data),
    sendTimeToUpdateFocusTime: (data) => ipcRenderer.invoke('update-current-focus-time', data),
    requestCurrentFocusTime: () => ipcRenderer.invoke('get-current-focus-time'),
    sendTaskToSetFinishDate: (data) => ipcRenderer.invoke('set-task-finish-date', data),
    sendTaskToRemoveFinishDate: (data) => ipcRenderer.invoke('remove-task-finish-date', data),
    requestTask: (data) => ipcRenderer.invoke('get-task', data)
})