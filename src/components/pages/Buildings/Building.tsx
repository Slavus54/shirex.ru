import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {onInitMapStyle} from '@/utils/storage'
import {classHandler, onGetRatingChangeSelector} from '@/utils/css'
import {onGetComponent} from '@/utils/graphql'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getBuildingM, manageBuildingPhotoM, updateBuildingInformationM, publishBuildingFactM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {STATUSES, PHOTO_TYPES, FACT_TYPES} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Building: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [photos, setPhotos] = useState<any[]>([])
    const [photo, setPhoto] = useState<any | null>(null)
    const [facts, setFacts] = useState<any[]>([])
    const [fact, setFact] = useState<any | null>(null)
    const [building, setBuilding] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [rating, setRating] = useState<number>(0)
    const [likes, setLikes] = useState<number>(0)
    const [changeSelector, setChangeSelector] = useState<string>('')
    const [change, setChange] = useState<string>('')
    const [photography, setPhotography] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '',
        category: PHOTO_TYPES[0],
        status: STATUSES[0],
        text: '',
        format: FACT_TYPES[0],
        dateUp: datus.now('date')
    })

    const {title, category, status, text, format, dateUp} = state

    const [getBuilding] = useMutation(getBuildingM, {
        onCompleted(data) {
            setBuilding(data.getBuilding)
        }
    })

    const [manageBuildingPhoto] = useMutation(manageBuildingPhotoM, {
        onCompleted() {
           onGetComponent(getBuilding, id)
        }
    })

    const [updateBuildingInformation] = useMutation(updateBuildingInformationM, {
        onCompleted() {
           onGetComponent(getBuilding, id)
        }
    })

    const [publishBuildingFact] = useMutation(publishBuildingFactM, {
        onCompleted() {
           onGetComponent(getBuilding, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Здание')

        if (account.shortid !== '') {
            onGetComponent(getBuilding, id)
        }
    }, [account])

    useEffect(() => {
        if (building !== null) {
            setCords(building.cords)
            setIsLoading(false)

            setState({...state, status: building.status})
        }
    }, [building])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (building !== null) {
            let difference: number = Math.abs(building.rating - rating)

            if (Boolean(difference)) {
                setChange(`${building.rating > rating ? '-' : '+'} ${difference}%`)
            }
           
            setChangeSelector(onGetRatingChangeSelector(building.rating, rating))
        }
    }, [rating])

    const onManagePhoto = (option: string) => {
        let isPhotoExist: boolean = photo !== null

        manageBuildingPhoto({
            variables: {
                name: account.name, id, option, title, category, image, likes: isPhotoExist ? photo.likes + account.shortid : '', collId: isPhotoExist ? photo.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => updateBuildingInformation({
        variables: {
            name: account.name, id, status, photography, rating, change
        }
    })

    const onPublishFact = () => publishBuildingFact({
        variables: {
            name: account.name, id, text, format, dateUp
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{building?.title}</h2>

                    {photo === null ?
                            <>
                                <h2>Новая Фотография</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Подпись к фотографии' type='input' />
                            
                                <div className='items small'>
                                    {PHOTO_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>  

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePhoto('create')}>Добавить</button>

                                <DataPagination items={building?.photos} setItems={setPhotos} label='Галерея фотографий здания:' />

                                <div className='items half'>
                                    {photos.map(el => 
                                        <div onClick={() => setPhoto(el)} className='item panel'>
                                            {codus.short(el.title)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPhoto(null)} />

                                {photo.image !== '' && <ImageLook src={photo.image} className='photo' />}

                                <h2>{photo.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {photo.category}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                {account.name === photo.name ?
                                        <button onClick={() => onManagePhoto('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManagePhoto('like')} dependency={photo} likes={photo.likes} setCounter={setLikes} />
                                }
                            </>
                    }
                    
                    <h2>Основная информация</h2>

                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                        {STATUSES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <h5 className='pale'>Состояние здания: <b>{rating}%</b></h5> <p className={changeSelector}>{change}</p>
                    <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />

                    <ImageLoader setImage={setPhotography} />

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL> 

                    {fact === null ?
                            <>
                                <h2>Новый Факт</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Информация о здании...' />

                                <div className='items small'>
                                    {FACT_TYPES.map(el => <div onClick={() => setState({...state, format: el})} className={classHandler(el, format)}>{el}</div>)}
                                </div>

                                <button onClick={onPublishFact}>Опубликовать</button> 

                                <DataPagination items={building?.facts} setItems={setFacts} label='Факты о здании:' />

                                <div className='items half'>
                                    {facts.map(el => 
                                        <div onClick={() => setFact(el)} className='item card'>
                                            {codus.short(el.text)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <span>Факт: {fact.text}</span>
                            
                                <div className='items little'>
                                    <h5 className='pale'>Тип: {fact.format}</h5>
                                    <h5 className='pale'>Опубликовано {fact.dateUp}</h5>
                                </div>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница здания загружается'
        />
    )
}

export default Building