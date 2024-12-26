import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import {onGetComponent} from '@/utils/graphql'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import CounterView from '@/shared/UI/CounterView'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getRoadM, manageRoadDamageM, updateRoadInformationM, updateRoadConstructionM, addRoadWaypointM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {DAMAGE_TYPES, DAYPARTS, DEFAULT_RANGE_VALUE, MATERIALS, MIN_LINES, MAX_LINES, WAYPOINT_TYPES, LEVELS} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Road: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [damages, setDamages] = useState<any[]>([])
    const [damage, setDamage] = useState<any | null>(null)
    const [waypoints, setWaypoints] = useState<any[]>([])
    const [waypoint, setWaypoint] = useState<any | null>(null)
    const [road, setRoad] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isDamageExist, setIsDamageExist] = useState<boolean>(true)
    const [isSameCoordinates, setIsSameCoordinates] = useState<boolean>(true)
    const [lines, setLines] = useState<number>(MIN_LINES)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')
 
    const [state, setState] = useState({
        text: '',
        category: DAMAGE_TYPES[0],
        dateUp: datus.now('date'),
        daypart: DAYPARTS[0],
        rating: DEFAULT_RANGE_VALUE,
        traffic: DEFAULT_RANGE_VALUE,
        material: MATERIALS[0],
        title: '',
        format: WAYPOINT_TYPES[0],
        level: LEVELS[0]
    })

    const {text, category, dateUp, daypart, rating, traffic, material, title, format, level} = state

    const [getRoad] = useMutation(getRoadM, {
        onCompleted(data) {
            setRoad(data.getRoad)
        }
    })

    const [manageRoadDamage] = useMutation(manageRoadDamageM, {
        onCompleted() {
            onGetComponent(getRoad, id)
        }
    })

    const [updateRoadInformation] = useMutation(updateRoadInformationM, {
        onCompleted() {
            onGetComponent(getRoad, id)
        }
    })

    const [updateRoadConstruction] = useMutation(updateRoadConstructionM, {
        onCompleted() {
            onGetComponent(getRoad, id)
        }
    })

    const [addRoadWaypoint] = useMutation(addRoadWaypointM, {
        onCompleted() {
            onGetComponent(getRoad, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Дорога')

        if (account.shortid !== '') {
            onGetComponent(getRoad, id)
        }
    }, [account])

    useEffect(() => {
        if (road !== null) {
            setLines(road.lines)
            setCords(road.cords)
            setIsLoading(false)

            setState({...state, daypart: road.daypart, rating: road.rating, traffic: road.traffic, material: road.material})
        }
    }, [road])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})

        if (road !== null) {
            setIsSameCoordinates(road.cords.lat === cords.lat)
        }
    }, [cords])

    useEffect(() => {
        setIsDamageExist(damage !== null)
    }, [damage])

    useMemo(() => {
        setImage(damage !== null ? damage.image : '')
    }, [damage])

    const onManageDamage = (option: string) => manageRoadDamage({
        variables: {
            name: account.name, id, option, text, category, cords, image, dateUp, likes: isDamageExist ? damage.likes + account.shortid : '', collId: isDamageExist ? damage.shortid : ''
        }
    })

    const onUpdateInformation = () => updateRoadInformation({
        variables: {
            name: account.name, id, daypart, rating, traffic
        }
    })

    const onUpdateConstruction = () => updateRoadConstruction({
        variables: {
            name: account.name, id, material, lines
        }
    })

    const onAddWaypoint = () => addRoadWaypoint({
        variables: {
            name: account.name, id, title, format, level
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{road?.title}</h2>

                    {damage === null ?
                            <>
                                <h2>Новое повреждение</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это..' />

                                <div className='items small'>
                                    {DAMAGE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div> 

                                <h5 className='pale'>Отметье положение на карте</h5>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageDamage('create')}>Добавить</button>

                                <DataPagination items={road?.damages} setItems={setDamages} label='Список повреждений на карте:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setDamage(null)} />

                                <ImageLook src={image} className='photo' />

                                <h2>{damage.text}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {damage.category}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                <div className='items little'>
                                    {account.name === damage.name ? 
                                            <button onClick={() => onManageDamage('delete')}>Удалить</button>
                                        :
                                            <LikeButton onClick={() => onManageDamage('like')} dependency={damage} likes={damage.likes} setCounter={setLikes} />
                                    }

                                    <button onClick={() => onManageDamage('update')}>Обновить</button>
                                </div>
                            </>
                    }

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        {!isSameCoordinates &&
                            <Marker latitude={road.cords.lat} longitude={road.cords.long}>
                                <MapPicker isHome={true} />
                            </Marker>
                        }

                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>

                        {damages.map(el => 
                            <Marker onClick={() => setDamage(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {codus.short(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    <h2>Конструкция участка дороги</h2>

                    <CounterView num={lines} setNum={setLines} min={MIN_LINES} max={MAX_LINES} part={1}>
                        Количество полос: <b>{lines}</b>
                    </CounterView>

                    <select value={material} onChange={e => setState({...state, material: e.target.value})}>
                        {MATERIALS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={onUpdateConstruction} className='light'>Обновить</button>

                    <h5 className='pale'>Состояние полотна: <b>{rating}%</b></h5>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <h5 className='pale'>Загруженность: <b>{traffic}%</b></h5>
                    <input value={traffic} onChange={e => setState({...state, traffic: parseInt(e.target.value)})} type='range' step={5} />

                    <select value={daypart} onChange={e => setState({...state, daypart: e.target.value})}>
                        {DAYPARTS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    {waypoint === null ?
                            <>
                                <h2>Новое место</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название пункта назначения' type='text' />

                                <div className='items little'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {WAYPOINT_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={onAddWaypoint}>Опубликовать</button>

                                <DataPagination items={road?.waypoints} setItems={setWaypoints} label='Пункты назначения:' />
                            
                                <div className='items half'>
                                    {waypoints.map(el => 
                                        <div onClick={() => setWaypoint(el)} className='item card'>
                                            {codus.short(el.title)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setWaypoint(null)} />

                                <h2>{waypoint.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {waypoint.format}</h5>
                                    <h5 className='pale'>Частота посещения: {waypoint.level}</h5>
                                </div>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница дороги загружается'
        />
    )
}

export default Road