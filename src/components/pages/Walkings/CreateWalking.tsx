import React, {useState, useMemo, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import FormPagination from '@/shared/UI/FormPagination'
import MapPicker from '@/shared/UI/MapPicker'
import CounterView from '@/shared/UI/CounterView'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createWalkingM} from './gql'
import {DATES_LENGTH, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {WALKING_TYPES, LEVELS, TIMER_MIN, TIMER_MAX} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateWalking: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [dates] = useState<string[]>(datus.dates('day', DATES_LENGTH))
    const [timer, setTimer] = useState<number>(TIMER_MIN)
    const [title, setTitle] = useState<string>('')

    const [state, setState] = useState({
        category: WALKING_TYPES[0], 
        level: LEVELS[0],
        region: towns[0].translation,
        cords: towns[0].cords,
        dateUp: dates[0], 
        time: '', 
        distance: 0, 
        opus: ''
    })

    const {category, level, region, cords, dateUp, time, distance, opus} = state

    useLayoutEffect(() => {
        changeTitle('Новая Прогулка')
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
        let result: string = datus.time(timer)

        setState({...state, time: result})        
    }, [timer])

    const [createWalking] = useMutation(createWalkingM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createWalking({
            variables: {
                name: account.name, id, title, category, level, region, cords, dateUp, time, distance, opus
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Тема мероприятия...'  type='text' />

                        <div className='items small'>
                            {WALKING_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <div className='items little'>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={dateUp} onChange={e => setState({...state, dateUp: e.target.value})}>
                                {dates.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                         

                        <DraftFormWrapper title={title} setTitle={setTitle} />  
                    </>,
                    <>
                        <CounterView num={timer} setNum={setTimer} min={TIMER_MIN} max={TIMER_MAX} part={30}>
                            Начало в {time}
                        </CounterView>
                 
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        
                        <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker />
                            </Marker>
                        </ReactMapGL> 

                        <button onClick={onCreate}>Создать</button>
                    </>
                ]}>
                    <h2>Новая Прогулка</h2>
                </FormPagination>  
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Прогулка создаётся'
        />
    )
}

export default CreateWalking