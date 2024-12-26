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
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getWalkingM, manageWalkingLocationM, updateWalkingOpusM, offerWalkingTopicM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {LOCATION_TYPES, TOPIC_TYPES, DURATIONS} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Walking: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [topics, setTopics] = useState<any[]>([])
    const [topic, setTopic] = useState<any | null>(null)
    const [walking, setWalking] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    
    const [state, setState] = useState({
        title: '',
        category: LOCATION_TYPES[0],
        dateUp: datus.now('date'),
        opus: '',
        text: '',
        format: TOPIC_TYPES[0],
        duration: DURATIONS[0]
    })

    const {title, category, dateUp, opus, text, format, duration} = state

    const [getWalking] = useMutation(getWalkingM, {
        onCompleted(data) {
            setWalking(data.getWalking)
        }
    })

    const [manageWalkingLocation] = useMutation(manageWalkingLocationM, {
        onCompleted() {
            onGetComponent(getWalking, id)
        }
    })

    const [updateWalkingOpus] = useMutation(updateWalkingOpusM, {
        onCompleted() {
            onGetComponent(getWalking, id)
        }
    })

    const [offerWalkingTopic] = useMutation(offerWalkingTopicM, {
        onCompleted() {
            onGetComponent(getWalking, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Прогулка')

        if (account.shortid !== '') {
            onGetComponent(getWalking, id)
        }
    }, [account])

    useEffect(() => {
        if (walking !== null) {
            setCords(walking.cords)
            setIsLoading(false)

            setState({...state, opus: walking.opus})
        }
    }, [walking])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const onManageLocation = (option: string) => {
        let isLocationExist: boolean = location !== null

        manageWalkingLocation({
            variables: {
                name: account.name, id, option, title, category, cords, image, dateUp, likes: isLocationExist ? location.likes + account.shortid : '', collId: isLocationExist ? location.shortid : '' 
            }
        })
    }

    const onUpdateOpus = () => updateWalkingOpus({
        variables: {
            name: account.name, id, opus
        }
    })

    const onOfferTopic = () => offerWalkingTopic({
        variables: {
            name: account.name, id, text, format, duration 
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{walking?.title}</h2>

                    <h5 className='pale'>Начало {walking?.dateUp} в {walking?.time}</h5>

                    {location === null ?
                            <>
                                <h2>Новое Место</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название места' type='input' />
                            
                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div> 

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Добавить</button>

                                <DataPagination items={walking?.locations} setItems={setLocations} label='Места для прогулки:' />

                                <div className='items half'>
                                    {locations.map(el => 
                                        <div onClick={() => setLocation(el)} className='item panel'>
                                            {codus.short(el.title)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo' />}

                                <h2>{location.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {location.category}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                {account.name === location.name ?
                                        <button onClick={() => onManageLocation('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManageLocation('like')} dependency={location} likes={location.likes} setCounter={setLikes} />
                                }
                            </>
                    }                    

                    <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL> 

                    <h2>Литератерное произведение</h2>

                    <input value={opus} onChange={e => setState({...state, opus: e.target.value})} placeholder='Название произведения' type='input' />

                    <button onClick={onUpdateOpus} className='light'>Обновить</button>

                    {topic === null ?
                            <>
                                <h2>Новая Тема</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Предмет для обсуждения' />

                                <div className='items small'>
                                    {TOPIC_TYPES.map(el => <div onClick={() => setState({...state, format: el})} className={classHandler(el, format)}>{el}</div>)}
                                </div> 

                                <select value={duration} onChange={e => setState({...state, duration: parseInt(e.target.value)})}>
                                    {DURATIONS.map(el => <option value={el}>{el} минут</option>)}
                                </select>

                                <button onClick={onOfferTopic}>Предложить</button>

                                <DataPagination items={walking?.topics} setItems={setTopics} label='Темы для обсуждения:' />

                                <div className='items half'>
                                    {topics.map(el => 
                                        <div onClick={() => setTopic(el)} className='item card'>
                                            {codus.short(el.text)}
                                            <small>{el.format}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTopic(null)} />

                                <h2>{topic.text}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {topic.format}</h5>
                                    <h5 className='pale'>Длитеность: <b>{topic.duration}</b> минут</h5>
                                </div>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница прогулки загружается'
        />
    )
}

export default Walking