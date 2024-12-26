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
import CounterView from '@/shared/UI/CounterView'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getYardM, manageYardMowingM, updateYardInformationM, publishYardEquipmentM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {SEEDS, STATUSES, EQUIPMENT_TYPES, DEFAULT_RATING, DAMAGES, MIN_HEIGHT, MAX_HEIGHT} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Yard: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [mowings, setMowings] = useState<any[]>([])
    const [mowing, setMowing] = useState<any | null>(null)
    const [equipments, setEquipments] = useState<any[]>([])
    const [equipment, setEquipment] = useState<any | null>(null)
    const [yard, setYard] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [height, setHeight] = useState<number>(Math.floor(Math.random() * MAX_HEIGHT))
    const [rating, setRating] = useState<number>(DEFAULT_RATING)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        dateUp: datus.now('date'),
        seeds: SEEDS[0],
        status: STATUSES[0],
        damage: DAMAGES[0],
        title: '',
        category: EQUIPMENT_TYPES[0]
    })

    const {text, dateUp, seeds, status, damage, title, category} = state

    const [getYard] = useMutation(getYardM, {
        onCompleted(data) {
            setYard(data.getYard)
        }
    })

    const [manageYardMowing] = useMutation(manageYardMowingM, {
        onCompleted() {
            onGetComponent(getYard, id)
        }
    })

    const [updateYardInformation] = useMutation(updateYardInformationM, {
        onCompleted() {
            onGetComponent(getYard, id)
        }
    })

    const [publishYardEquipment] = useMutation(publishYardEquipmentM, {
        onCompleted() {
            onGetComponent(getYard, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Газон')

        if (account.shortid !== '') {
            onGetComponent(getYard, id)
        }
    }, [account])

    useEffect(() => {
        if (yard !== null) {
            setCords(yard.cords)
            setState({...state, seeds: yard.seeds, status: yard.status, damage: yard.damage})

            setIsLoading(false)
        }
    }, [yard])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        setRating(DEFAULT_RATING)
    }, [equipment])

    const onManageMowing = (option: string) => {
        let isMowingExist: boolean = mowing !== null

        manageYardMowing({
            variables: {
                name: account.name, id, option, text, height, image, dateUp, likes: isMowingExist ? mowing.likes + account.shortid : '', collId: isMowingExist ? mowing.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => updateYardInformation({
        variables: {
            name: account.name, id, seeds, status, damage
        }
    })

    const onPublishEquipment = () => publishYardEquipment({
        variables: {
            name: account.name, id, title, category, rating
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{yard?.title}</h2>

                    <h5 className='pale'>Тип: <b>{yard?.category}</b> | Ландшафт: <b>{yard?.landscape}</b> | Площадь: <b>{yard?.square}м²</b></h5>

                    {mowing === null ?
                            <>
                                <h2>Новый покос</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <CounterView num={height} setNum={setHeight} min={MIN_HEIGHT} max={MAX_HEIGHT} part={1}>
                                    Высоты травы: <b>{height} см</b>
                                </CounterView>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageMowing('create')}>Добавить</button>

                                <DataPagination items={yard?.mowings} setItems={setMowings} label='Последние покосы:' />

                                <div className='items small'>
                                    {mowings.map(el => 
                                        <div className='item card'>
                                            {codus.short(el.text)}
                                            <small>{el.dateUp}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setMowing(null)} />

                                {mowing.image !== '' && <ImageLook src={mowing.image} className='photo' />}

                                <h2>{mowing.text}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Высота травы: <b>{mowing} см</b></h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                {account.name === mowing.name ?
                                        <button onClick={() => onManageMowing('delete')}>Удалить</button> 
                                    :
                                        <LikeButton onClick={() => onManageMowing('like')} dependency={mowing} likes={mowing.likes} setCounter={setLikes} />
                                }
                            </>
                    }

                    <h2>Дополнительная информация</h2>

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

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL> 

                    {equipment === null ?
                            <>
                                <h2>Новое оборудование</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название' type='text' />

                                <div className='items small'>
                                    {EQUIPMENT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h5 className='pale'>Оценка: <b>{rating}%</b></h5>
                                <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={onPublishEquipment}>Опубликовать</button>

                                <DataPagination items={yard?.equipments} setItems={setEquipments} label='Последние покосы:' />

                                <div className='items small'>
                                    {equipments.map(el => 
                                        <div className='item panel'>
                                            {codus.short(el.title)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setEquipment(null)} />

                                <h2>{equipment.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {equipment.category}</h5>
                                    <h5 className='pale'>Оценка: {equipment.rating}%</h5>
                                </div>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница газона загружается'
        />
    )
}

export default Yard