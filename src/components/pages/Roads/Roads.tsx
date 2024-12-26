import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '@/shared/UI/DataPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import useRandomTown from '@/components/hooks/useRandomTown'
import {getRoadsQ} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {ROAD_TYPES, MATERIALS, ROAD_FORMATS} from './env'
import {TownType, MapType, Cords} from '@/env/types'

const Roads: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [index] = useRandomTown(towns)

    const [filtered, setFiltered] = useState<any[]>([])
    const [roads, setRoads] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(ROAD_TYPES[0])
    const [material, setMaterial] = useState<string>(MATERIALS[0])
    const [format, setFormat] = useState<string>(ROAD_FORMATS[0])
    const [region, setRegion] = useState<string>(towns[index].translation)
    const [cords, setCords] = useState<Cords>(towns[index].cords)

    const {data, loading} = useQuery(getRoadsQ)

    useLayoutEffect(() => {
        changeTitle('Дороги')

        if (data) {
            setRoads(data.getRoads)
        }
    }, [data])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.cords)
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (roads !== null) {
            let result: any[] = roads.filter(el => el.material === material && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category && el.format === format)

            setFiltered(result)
        }
    }, [roads, title, category, material, format, region])

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>Найдите дорогу</h2>

                    <div className='items little'>
                        <div className='item'>
                            <h4 className='pale'>Название</h4>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название' type='text' />
                        </div>

                        <div className='item'>
                            <h4 className='pale'>Регион</h4>
                            <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />
                        </div>
                    </div>

                    <div className='items small'>
                        {ROAD_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
                    </div>  

                    <div className='items small'>
                        <select value={material} onChange={e => setMaterial(e.target.value)}>
                            {MATERIALS.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={format} onChange={e => setFormat(e.target.value)}>
                            {ROAD_FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <DataPagination items={filtered} setItems={setFiltered} label='Дороги:' />

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {filtered.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <RouterNavigator url={`/road/${el.shortid}`} isOnMap={true}>{codus.short(el.title)}</RouterNavigator>
                            </Marker>
                        )}
                    </ReactMapGL> 
                </>
            }
            isLoading={loading}
            text='Список дорог загружается'
        />
    )
}

export default Roads