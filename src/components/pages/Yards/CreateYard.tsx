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
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createYardM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {YARD_TYPES, LANDSCAPE_TYPES, YARD_FORMATS, DEFAULT_SQUARE, SEEDS, STATUSES, DAMAGES} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateYard: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const [state, setState] = useState({
        category: YARD_TYPES[0], 
        landscape: LANDSCAPE_TYPES[0], 
        format: YARD_FORMATS[0], 
        square: DEFAULT_SQUARE,
        region: towns[0].translation,
        cords: towns[0].cords,
        seeds: SEEDS[0], 
        status: STATUSES[0], 
        damage: DAMAGES[0]
    })

    const {category, landscape, format, square, region, cords, seeds, status, damage} = state

    useLayoutEffect(() => {
        changeTitle('Новый Газон')
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
        if (isNaN(square)) {
            setState({...state, square: DEFAULT_SQUARE})
        }
    }, [square])

    const [createYard] = useMutation(createYardM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createYard({
            variables: {
                name: account.name, id, title, category, landscape, format, square, region, cords, seeds, status, damage
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название лужайки...' />
               
                        <div className='items small'>
                            {YARD_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <h5 className='pale'>Площадь: <b>{square}м²</b></h5>
                        <input value={square} onChange={e => setState({...state, square: parseInt(e.target.value)})} placeholder='Размер территории' type='text' />

                        <div className='items small'>
                            <select value={landscape} onChange={e => setState({...state, landscape: e.target.value})}>
                                {LANDSCAPE_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {YARD_FORMATS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <DraftFormWrapper title={title} setTitle={setTitle} />
                    </>,
                    <>
                        <div className='items small'>
                            <select value={seeds} onChange={e => setState({...state, seeds: e.target.value})}>
                                {SEEDS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={damage} onChange={e => setState({...state, damage: parseInt(e.target.value)})}>
                                {DAMAGES.map(el => <option value={el}>{el}%</option>)}
                            </select>
                        </div>

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
                    <h2>Новый Газон</h2>
                </FormPagination> 
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Газон создаётся'
        />
    )
}

export default CreateYard