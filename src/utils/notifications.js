import {PROJECT_TITLE, PROJECT_ICON} from '@/env/env'

export const registerNotification = () => {
    Notification.requestPermission().then(data => {
        if (data === 'granted') {
            new Notification(`Разрешение на уведомления | ${PROJECT_TITLE}`, {
                tag: 'permission',
                body: 'Спасибо, что разрешили уведомлять вас об изменениях в учётной записи!',
                icon: PROJECT_ICON
            })
        }
    })
}

export const buildNotification = (body = '', page = 'Учётная запись', isReload = false) => {
    const notification = new Notification(`${page} | ${PROJECT_TITLE}`, {
        tag: 'notification',
        body,
        icon: PROJECT_ICON
    })

    setTimeout(() => {
        notification.close()

        if (isReload) {
            window.location.reload()
        }
    }, 3e3) 
}

export const changeTitle = (title = '') => document.title = `${title} | ${PROJECT_TITLE}`