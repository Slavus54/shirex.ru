import React, {useState, useContext, useLayoutEffect, useEffect} from 'react'
import {AppContext} from '@/context/AppContext'
import {changeTitle} from '@/utils/notifications'
import {getProfileInfo, onGetProfileFromServer, updateProfileInfo} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import ImageLook from '@/shared/UI/ImageLook'
import HistoryPages from '@/shared/UI/HistoryPages'
import Helper from '@/shared/UI/Helper'
import Exit from '@/shared/UI/Exit'
import ComponentLoadingWrapper from '../hoc/ComponentLoadingWrapper'
import {parts} from '@/env/parts'
import {ContextType, AccountPart} from '@/env/types'

const Account: React.FC = () => {
    const {account} = useContext<ContextType>(AppContext)
    const [profile, setProfile] = useState(null)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [part, setPart] = useState<AccountPart>(parts[0])

    useLayoutEffect(() => {
        changeTitle('Учётная запись')

        let data = getProfileInfo()

        if (data !== null) {
            setProfile(data)
        } else {
            onGetProfileFromServer(account.name).then((result: any) => {
                updateProfileInfo(result)
                setProfile(result)
            })
        }
    }, [])

    useEffect(() => {
        if (part !== null && profile !== null) {
            setIsLoading(false)
        }
    }, [profile])
    
    return (
        <>
            <div className='profile-menu'>
                {parts.map((el, i) => 
                    <div onClick={() => setPart(el)} key={i} className={classHandler(el, part, 'profile-menu__item', 'profile-menu__item-active')}>
                        <ImageLook src={el.url} className='icon' alt='icon' />
                    </div>
                )}
            </div>

            <ComponentLoadingWrapper component={<part.component profile={profile} /> } isLoading={isLoading} type='profile' text='Загружаем данные вашего аккаунта, подождите' />

            <HistoryPages />
            <Helper />
            <Exit />
        </>
    )
}

export default Account