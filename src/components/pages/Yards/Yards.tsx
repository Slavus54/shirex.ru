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
import {getYardsQ} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {YARD_TYPES, LANDSCAPE_TYPES, YARD_FORMATS} from './env'
import {TownType, MapType, Cords} from '@/env/types'

const Yards: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [index] = useRandomTown(towns)

    const [filtered, setFiltered] = useState<any[]>([])
    const [yards, setYards] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(YARD_TYPES[0])
    const [landscape, setLandscape] = useState<string>(LANDSCAPE_TYPES[0])
    const [format, setFormat] = useState<string>(YARD_FORMATS[0])
    const [region, setRegion] = useState<string>(towns[index].translation)
    const [cords, setCords] = useState<Cords>(towns[index].cords)

    const {data, loading} = useQuery(getYardsQ)

    useLayoutEffect(() => {
        changeTitle('Газоны')

        if (data) {
            setYards(data.getYards)
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
        if (yards !== null) {
            let result: any[] = yards.filter(el => el.format === format && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category && el.landscape === landscape)

            setFiltered(result)
        }
    }, [yards, title, category, landscape, format, region])

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>Найдите ухоженную территорию</h2>

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
                        {YARD_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
                    </div>  

                    <div className='items small'>
                        <select value={landscape} onChange={e => setLandscape(e.target.value)}>
                            {LANDSCAPE_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={format} onChange={e => setFormat(e.target.value)}>
                            {YARD_FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <DataPagination items={filtered} setItems={setFiltered} label='Газоны:' />

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {filtered.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <RouterNavigator url={`/yard/${el.shortid}`} isOnMap={true}>{codus.short(el.title)}</RouterNavigator>
                            </Marker>
                        )}
                    </ReactMapGL> 
                </>
            }
            isLoading={loading}
            text='Список газонов загружается'
        />
    )
}

export default Yards