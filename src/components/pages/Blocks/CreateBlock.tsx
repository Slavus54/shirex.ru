import React, {useState, useMemo, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, weekdays} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import FormPagination from '@/shared/UI/FormPagination'
import MapPicker from '@/shared/UI/MapPicker'
import InformationLabel from '@/shared/UI/InformationLabel'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createBlockM} from './gql'
import {TERRITORY_TYPES, CURRENCY, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {BLOCK_TYPES, DEFAULT_AMOUNT, BLOCK_ROLES, BUILDING_LIMIT} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateBlock: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [building, setBuilding] = useState<string>('')

    const [state, setState] = useState({
        category: BLOCK_TYPES[0], 
        buildings: [],
        region: towns[0].translation,
        cords: towns[0].cords,
        territory: TERRITORY_TYPES[0],
        url: '',
        card: '', 
        amount: DEFAULT_AMOUNT, 
        role: BLOCK_ROLES[0], 
        weekday: weekdays[0]
    })

    const {category, buildings, region, cords, territory, url, card, amount, role, weekday} = state

    useLayoutEffect(() => {
        changeTitle('Новый Квартал')
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

    useMemo(() => {
        if (isNaN(amount)) {
            setState({...state, amount: DEFAULT_AMOUNT})
        }
    }, [amount])   

    const [createBlock] = useMutation(createBlockM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onBuilding = () => {
        if (buildings.length < BUILDING_LIMIT) {
            setState({...state, buildings: [...buildings, building]})
        }

        setBuilding('')
    }

    const onCreate = () => {
        createBlock({
            variables: {
                name: account.name, id, title, category, buildings, region, cords, territory, url, card: codus.card(card), amount, role, weekday
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <FormPagination items={[
                        <>
                            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название объединения...' />
                
                            <div className='items small'>
                                {BLOCK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                            </div>

                            <h5 className='pale'>Строения {buildings.length}/{BUILDING_LIMIT}</h5>
                            <input value={building} onChange={e => setBuilding(e.target.value)} placeholder='Адрес здания' type='text' />
                            <button onClick={onBuilding} className='light'>Добавить</button>

                            <h5 className='pale'>Банковский счёт: {codus.card(card)}</h5>
                            <input value={card} onChange={e => setState({...state, card: e.target.value})} placeholder='Карта' type='text' />

                            <h5 className='pale'>Выберите роль и день уборки подъезда</h5>

                            <div className='items small'>
                                <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                                    {BLOCK_ROLES.map(el => <option value={el}>{el}</option>)}
                                </select>
                                <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                                    {weekdays.map(el => <option value={el}>{el}</option>)}
                                </select>
                            </div>

                            <DraftFormWrapper title={title} setTitle={setTitle} />
                        </>,
                        <>
                            <h5 className='pale'>Ежемесячный платёж: <b>{amount}{CURRENCY}</b></h5>
                            <input value={amount} onChange={e => setState({...state, amount: parseInt(e.target.value)})} placeholder='Размер платежа' type='text' />

                            <h5 className='pale'>Найдите регион</h5>
                            <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                            
                            <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                                <Marker latitude={cords.lat} longitude={cords.long}>
                                    <MapPicker />
                                </Marker>
                            </ReactMapGL> 

                            <button onClick={onCreate}>Создать</button>
                        </>
                    ]}>
                        <h2>Новый Квартал</h2>
                    </FormPagination>

                    <InformationLabel text='Квартал - объединение собственников квартир в доме' />
                </>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Квартал создаётся'
        />
    )
}

export default CreateBlock