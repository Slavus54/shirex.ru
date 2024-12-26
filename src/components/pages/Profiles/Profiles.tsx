import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '@/shared/UI/DataPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getProfilesQ} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {TownType, MapType, Cords} from '@/env/types'

const Profiles: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [profiles, setProfiles] = useState<any[] | null>(null)

    const [name, setName] = useState<string>('')
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getProfilesQ)

    useLayoutEffect(() => {
        changeTitle('Пользователи')

        if (data) {
            setProfiles(data.getProfiles)
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
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (name.length !== 0) {
                result = result.filter(el => codus.search(el.name, name, SEARCH_PERCENT))
            }

            setFiltered(result)
        }
    }, [profiles, name, region])

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>Найдите людей в округе</h2>

                    <div className='items little'>
                        <div className='item'>
                            <h4 className='pale'>Полное имя</h4>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder='Имя' type='text' />
                        </div>

                        <div className='item'>
                            <h4 className='pale'>Регион</h4>
                            <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />
                        </div>
                    </div>

                    <DataPagination items={filtered} setItems={setFiltered} label='Пользователи:' />

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {filtered.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <RouterNavigator url={`/profile/${el.shortid}`} isOnMap={true}>{codus.short(el.name)}</RouterNavigator>
                            </Marker>
                        )}
                    </ReactMapGL> 
                </>
            }
            isLoading={loading}
            text='Список пользователей загружается'
        />
    )
}

export default Profiles