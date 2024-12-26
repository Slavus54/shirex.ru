import React, {useState, useContext, useEffect, useLayoutEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {registerNotification, changeTitle} from '@/utils/notifications'
import {createSession, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import FormPagination from '@/shared/UI/FormPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import useRandomTown from '@/components/hooks/useRandomTown'
import {registerProfileM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {ContextType, TownType, MapType} from '@/env/types'

const Register: React.FC = () => {
    const {inviteName} = useParams()
    const {accountUpdate} = useContext<ContextType>(AppContext)
    
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [index] = useRandomTown(towns)
    
    const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '', 
        region: towns[index].translation,
        cords: towns[index].cords
    })

    const {name, email, password, region, cords} = state

    useLayoutEffect(() => {
        changeTitle('Новый Аккаунт')
    }, [])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.translation, cords: result.cords})
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const [registerProfile] = useMutation(registerProfileM, {
        onCompleted(data) {
            const result = data.registerProfile

            accountUpdate(false, result, 5)
            createSession({name: result.name, region: result.region, dateUp: datus.now('date')})
            registerNotification()

            setIsRegisterLoading(false)
        }
    })

    const onRegister = () => {
        registerProfile({
            variables: {
                name, email, password, region, cords, image, timestamp: datus.now()
            }
        })
        
        setIsRegisterLoading(true)
    }
    
    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <FormPagination items={[
                        <>
                            <div className='items small'>
                                <div className='item'>
                                    <h3 className='pale'>Имя и пароль</h3>
                                    <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше имя' type='text' />
                                    <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль к учётной записи' type='text' /> 
                                </div>
                                <div className='item'>
                                    <h3 className='pale'>Почта и регион</h3>
                                    <input value={email} onChange={e => setState({...state, email: e.target.value})} placeholder='Адрес почты' type='text' />                       
                                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                                </div>
                            </div>             

                            {inviteName !== 'test' && <span>Приглашение от {inviteName}</span>}              
                            
                            <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                                <Marker latitude={cords.lat} longitude={cords.long}>
                                    <MapPicker />
                                </Marker>
                            </ReactMapGL> 
                        
                            <ImageLoader setImage={setImage} />  

                            <button onClick={onRegister}>Создать</button>
                        </>
                    ]}>
                        <h2>Новый Аккаунт</h2>
                    </FormPagination>  
                    
                </>
            }
            isLoading={isRegisterLoading}
            isAppShell={false}
            text='Учётная запись создаётся'
        />
    )
}

export default Register