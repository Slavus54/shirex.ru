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
import {getFamiliesQ} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {FAMILY_TYPES, RELIGIONS, CENTURIES} from './env'
import {TownType, MapType, Cords} from '@/env/types'

const Families: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [index] = useRandomTown(towns)

    const [filtered, setFiltered] = useState<any[]>([])
    const [families, setFamilies] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(FAMILY_TYPES[0])
    const [religion, setReligion] = useState<string>(RELIGIONS[0])
    const [century, setCentury] = useState<string>(CENTURIES[0])
    const [region, setRegion] = useState<string>(towns[index].translation)
    const [cords, setCords] = useState<Cords>(towns[index].cords)

    const {data, loading} = useQuery(getFamiliesQ)

    useLayoutEffect(() => {
        changeTitle('Семьи')

        if (data) {
            setFamilies(data.getFamilies)
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
        if (families !== null) {
            let result: any[] = families.filter(el => el.region === region && el.century === century)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category && el.century === century)

            setFiltered(result)
        }
    }, [families, title, category, religion, century, region])

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>Найдите семью</h2>

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

                    <h5 className='pale'>Выберите религию и век основания</h5>

                    <div className='items little'>
                        <select value={religion} onChange={e => setReligion(e.target.value)}>
                            {RELIGIONS.map(el => <option value={el}>{el}</option>)}
                        </select>    
                        <select value={century} onChange={e => setCentury(e.target.value)}>
                            {CENTURIES.map(el => <option value={el}>{el}</option>)}
                        </select>    
                    </div>

                    <DataPagination items={filtered} setItems={setFiltered} label='Семьи:' />

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {filtered.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <RouterNavigator url={`/family/${el.shortid}`} isOnMap={true}>{codus.short(el.title)}</RouterNavigator>
                            </Marker>
                        )}
                    </ReactMapGL> 
                </>
            }
            isLoading={loading}
            text='Список семей загружается'
        />
    )
}

export default Families