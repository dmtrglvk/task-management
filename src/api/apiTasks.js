export function fetchTasks() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    projectId: 1,
                    id: 101,
                    title: 'Update homepage',
                    priority: 'Medium',
                    assignee: 'John Doe',
                    dueDate: '10/04/2025',
                    status: 'In progress',
                    estimate: '3 SP'
                },
                {
                    projectId: 1,
                    id: 102,
                    title: 'Fix cart popup',
                    priority: 'High',
                    assignee: 'Unassigned',
                    dueDate: '12/04/2025',
                    status: 'Pending',
                    estimate: '1 SP'
                },
                {
                    projectId: 2,
                    id: 201,
                    title: 'Create help tooltip',
                    priority: 'Low',
                    assignee: 'Joe Biden',
                    dueDate: '01/03/2025',
                    status: 'Completed',
                    estimate: '5 SP'
                },
                {
                    projectId: 2,
                    id: 202,
                    title: 'Implement push notifications',
                    priority: 'High',
                    assignee: 'Alice Smith',
                    dueDate: '15/05/2025',
                    status: 'In progress',
                    estimate: '8 SP'
                }
            ])
        }, 1000)
    })
}