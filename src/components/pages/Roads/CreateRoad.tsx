import React, {useState, useMemo, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import FormPagination from '@/shared/UI/FormPagination'
import MapPicker from '@/shared/UI/MapPicker'
import CounterView from '@/shared/UI/CounterView'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createRoadM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {ROAD_TYPES, MATERIALS, ROAD_FORMATS, MAX_LINES, MIN_LINES, DAYPARTS, DEFAULT_RANGE_VALUE} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateRoad: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lines, setLines] = useState<number>(MIN_LINES * 2)
    const [title, setTitle] = useState<string>('')

    const [state, setState] = useState({
        category: ROAD_TYPES[0], 
        material: MATERIALS[0],
        format: ROAD_FORMATS[0], 
        region: towns[0].translation,
        cords: towns[0].cords,
        daypart: DAYPARTS[0], 
        rating: DEFAULT_RANGE_VALUE, 
        traffic: DEFAULT_RANGE_VALUE
    })

    const {category, material, format, region, cords, daypart, rating, traffic} = state

    useLayoutEffect(() => {
        changeTitle('Новая Дорога')
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

    const [createRoad] = useMutation(createRoadM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createRoad({
            variables: {
                name: account.name, id, title, category, material, format, lines, region, cords, daypart, rating, traffic
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название дороги...' />
               
                        <div className='items small'>
                            {ROAD_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <h5 className='pale'>Состояние полотна: <b>{rating}%</b></h5>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                        <CounterView num={lines} setNum={setLines} min={MIN_LINES} max={MAX_LINES} part={1}>
                            Количество полос: <b>{lines}</b>
                        </CounterView>

                        <div className='items small'>
                            <select value={material} onChange={e => setState({...state, material: e.target.value})}>
                                {MATERIALS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {ROAD_FORMATS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <DraftFormWrapper title={title} setTitle={setTitle} />
                    </>,
                    <>
                        <h5 className='pale'>Загруженность: <b>{traffic}%</b></h5>
                        <input value={traffic} onChange={e => setState({...state, traffic: parseInt(e.target.value)})} type='range' step={5} />

                        <select value={daypart} onChange={e => setState({...state, daypart: e.target.value})}>
                            {DAYPARTS.map(el => <option value={el}>{el}</option>)}
                        </select>

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
                    <h2>Новая Дорога</h2>
                </FormPagination>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Дорога создаётся'
        />
    )
}

export default CreateRoad