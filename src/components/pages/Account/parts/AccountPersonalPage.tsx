import React, {useState, useContext, useLayoutEffect, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {datus, weekdays} from '@/shared/libs/libs'
import {buildNotification} from '@/utils/notifications'
import ProfilePhoto from '@/assets/photo/profile_photo.jpg'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import Test from '@/shared/UI/Test'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {updateProfileInfo, createSession} from '@/utils/storage'
import {updateProfilePersonalInfoM} from '../gql'
import {PHOTO_WEEKDAY_COLORS} from '../env'
import {ContextType, AccountPropsType} from '@/env/types'

const AccountPersonalPage: React.FC<AccountPropsType> = ({profile}) => {    
    const {accountUpdate} = useContext<ContextType>(AppContext)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isHover, setIsHover] = useState<boolean>(true)

    const [index] = useState<number>(weekdays.indexOf(datus.weekdayByDate(datus.now('date'))))

    const [name, setName] = useState<string>('')
    const [image, setImage] = useState<string>('')

    useLayoutEffect(() => {
        if (profile !== null) {
            setImage(profile.image === '' ? ProfilePhoto : profile.image)          
        }
    }, [profile])

    useMemo(() => {
        setName(isHover ? profile.name : '')
    }, [isHover])

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePersonalInfo)
            updateProfileInfo(null)
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                id: profile.shortid, name, image
            }
        })    

        if (profile.name !== name) {
            createSession({name, region: profile.region, dateUp: datus.now('date')})
            accountUpdate(false, null, 1, '/', false)
        }       

        setIsLoading(true)
    } 

    return  <ComponentLoadingWrapper 
                component={
                    <>
                        <ImageLook src={image} isScale color={PHOTO_WEEKDAY_COLORS[index]} className='photo' alt="account photo" />
                        
                        <h3><b>{name !== '' ? name : profile.name}</b></h3> 

                        <input value={name} onChange={e => setName(e.target.value)} onMouseEnter={() => setIsHover(false)} onMouseLeave={() => Boolean(name.length) ? setIsHover(false) : setIsHover(true)} placeholder='Ваше имя' type='text' />

                        <ImageLoader setImage={setImage} />

                        <button onClick={onUpdate}>Обновить</button>    

                        <Test />        
                    </>
                }
                isLoading={isLoading}
                isAppShell={false}
                text='Персональные данные обновляются'
            />
}

export default AccountPersonalPage