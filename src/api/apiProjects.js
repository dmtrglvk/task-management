export function fetchProjects() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'Website Redesign',
                    description: 'Update the company website with a new design',
                    createdAt: '01/01/2020'
                },
                {
                    id: 2,
                    title: 'Mobile App Development',
                    description: 'Develop a new mobile app for Android and iOS',
                    createdAt: '13/06/2022'
                }
            ])
        }, 1000)
    })
}
