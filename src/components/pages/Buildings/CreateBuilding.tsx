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
import ImageLoader from '@/shared/UI/ImageLoader'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createBuildingM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {BUILDING_TYPES, ARCHITECTURES, CENTURIES, STATUSES, DEFAULT_RATING} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateBuilding: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [photography, setPhotography] = useState<string>('')

    const [state, setState] = useState({
        category: BUILDING_TYPES[0], 
        architecture: ARCHITECTURES[0], 
        century: CENTURIES[0],
        region: towns[0].translation,
        cords: towns[0].cords,
        status: STATUSES[0], 
        rating: DEFAULT_RATING, 
        change: ''
    })

    const {category, architecture, century, region, cords, status, rating, change} = state

    useLayoutEffect(() => {
        changeTitle('Новое Здание')
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

    const [createBuilding] = useMutation(createBuildingM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createBuilding({
            variables: {
                name: account.name, id, title, category, architecture, century, region, cords, status, photography, rating, change
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название постройки...'  type='text' />
               
                        <div className='items small'>
                            {BUILDING_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <div className='items small'>
                            <select value={architecture} onChange={e => setState({...state, architecture: e.target.value})}>
                                {ARCHITECTURES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                {CENTURIES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <DraftFormWrapper title={title} setTitle={setTitle} />
                    </>,
                    <>
                        <h5 className='pale'>Найдите регион</h5>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        
                        <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker />
                            </Marker>
                        </ReactMapGL> 

                        <ImageLoader setImage={setPhotography} />

                        <button onClick={onCreate}>Создать</button>
                    </>
                ]}>
                    <h2>Новое Здание</h2>
                </FormPagination>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Здание создаётся'
        />
    )
}

export default CreateBuilding