import React, {useLayoutEffect} from 'react'
import {changeTitle} from '@/utils/notifications'
import RouterNavigator from '../router/RouterNavigator'
import ImageLook from '@/shared/UI/ImageLook'
import Quotes from '../features/Quotes'
import Footer from '../features/Footer'
import {PROJECT_TITLE, REFORMS_ICON, REFORMS_URL} from '@/env/env'

const Welcome: React.FC = () => {

    useLayoutEffect(() => {
        changeTitle('Главная')
    }, [])

    const onView = () => window.open(REFORMS_URL)

    return (
        <>
            <h1>{PROJECT_TITLE}</h1>
            
            <h4 className='pale'>Онлайн платформа для эффективного управления своим городом</h4>

            <div className='items little'>
                <RouterNavigator url='/login'>
                    <button>Логин</button>
                </RouterNavigator>
                <RouterNavigator url='/register/test'>
                    <button>Аккаунт</button>
                </RouterNavigator>
            </div>             
            
            <h2>Описание</h2>

            <p>
                Веб-приложение ShireX призвано улучшить опыт взаимодействия жителей друг с другом в процессе повышения качества жизни
            </p>

            <Quotes />

            <h2>Программа реформ Российской Федерации</h2>

            <ImageLook onClick={onView} src={REFORMS_ICON} className='icon' />

            <Footer />
        </>
    )
}

export default Welcome