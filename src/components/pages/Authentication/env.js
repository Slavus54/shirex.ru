export const onGetLoadingText = (name = 'Алина', region = 'Новосибирск') => {
    const LOGIN_LOADING_TEXTS = [
        {
            text: 'Выполняется вход в ваш аккаунт',
            isPersonalInformationInfo: false
        },
        {
            text: `Добро пожаловать в личный кабинет, ${name}`,
            isPersonalInformationInfo: true
        },
        {
            text: `Аутентификация пользователя из г. ${region}`,
            isPersonalInformationInfo: true
        },
        {
            text: `Открывается учётная запись для ${name}`,
            isPersonalInformationInfo: true
        }
    ]

    let filtered = LOGIN_LOADING_TEXTS

    if (name.length === 0 || region.length === 0) {
        filtered = filtered.filter(el => !el.isPersonalInformationInfo)
    }
   
    let result = filtered[Math.floor(Math.random() * filtered.length)]

    return result?.text
} 