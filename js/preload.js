const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendTaskToInsert: (data) => ipcRenderer.invoke('insert-task', data),
    sendTaskToRename: (data) => ipcRenderer.invoke('rename-task', data),
    sendTaskToDelete: (data) => ipcRenderer.invoke('delete-task', data),
    sendTaskToComplete: (data) => ipcRenderer.invoke('complete-task', data),
    sendTaskToIncomplete: (data) => ipcRenderer.invoke('incomplete-task', data),
    requestIncompleteTasksIds: () => ipcRenderer.invoke('get-incomplete-tasks-ids'),
    requestTaskName: (data) => ipcRenderer.invoke('get-task-name', data),
    sendTaskToIncreseFocusTime: (data) => ipcRenderer.invoke('increase-task-focus-time', data)
})