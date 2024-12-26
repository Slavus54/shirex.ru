import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useNavigate} from 'react-router-dom'
import {useQuery} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '@/shared/UI/DataPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import useRandomTown from '@/components/hooks/useRandomTown'
import {getBlocksQ} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {BLOCK_TYPES} from './env'
import {ContextType, TownType, MapType, Cords} from '@/env/types'

const Blocks: React.FC = () => {
    const {account} = useContext<ContextType>(AppContext)

    const navigate = useNavigate()
    
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [index] = useRandomTown(towns)

    const [filtered, setFiltered] = useState<any[]>([])
    const [blocks, setBlocks] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(BLOCK_TYPES[0])
    const [region, setRegion] = useState<string>(towns[index].translation)
    const [cords, setCords] = useState<Cords>(towns[index].cords)

    const {data, loading} = useQuery(getBlocksQ)

    useLayoutEffect(() => {
        changeTitle('Кварталы')

        if (data) {
            setBlocks(data.getBlocks)
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
        if (blocks !== null) {
            let result: any[] = blocks.filter(el => el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }
    }, [blocks, title, category, region])

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>Найдите географические объединения</h2>

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
                        {BLOCK_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
                    </div>  

                    <DataPagination items={filtered} setItems={setFiltered} label='Кварталы:' />

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {filtered.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <RouterNavigator url={`/block/${el.shortid}`} isOnMap={true}>{codus.short(el.title)}</RouterNavigator>
                            </Marker>
                        )}
                    </ReactMapGL> 

                    <h4 className='pale'>Не можете найти свой квартал? Создайте его!</h4>

                    <button onClick={() => navigate(`/create-block/${account.shortid}`)} className='light'>Создать</button>
                </>
            }
            isLoading={loading}
            text='Список кварталов загружается'
        />
    )
}

export default Blocks