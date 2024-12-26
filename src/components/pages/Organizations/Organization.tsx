import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {onInitMapStyle} from '@/utils/storage'
import {onGetComponent} from '@/utils/graphql'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getOrganizationM, manageOrganizationOpinionM, updateOrganizationPhotographyM, publishOrganizationRateM} from './gql'
import {CURRENCY, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {LEVENS, DEFAULT_SALARY, DEFAULT_RATIO, DEFAULT_PERCENT} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Organization: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [opinions, setOpinions] = useState<any[]>([])
    const [opinion, setOpinion] = useState<any | null>(null)
    const [rates, setRates] = useState<any[]>([])
    const [organization, setOrganization] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [salary, setSalary] = useState<number>(DEFAULT_SALARY)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        employee: '',
        level: LEVENS[0],
        dateUp: datus.now('date'),
        ratio: DEFAULT_RATIO,
        percent: DEFAULT_PERCENT
    })

    const {text, employee, level, dateUp, ratio, percent} = state

    const [getOrganization] = useMutation(getOrganizationM, {
        onCompleted(data) {
            setOrganization(data.getOrganization)
        }
    })

    const [manageOrganizationOpinion] = useMutation(manageOrganizationOpinionM, {
        onCompleted() {
            onGetComponent(getOrganization, id)
        }
    })

    const [updateOrganizationPhotography] = useMutation(updateOrganizationPhotographyM, {
        onCompleted() {
            onGetComponent(getOrganization, id)
        }
    })

    const [publishOrganizationRate] = useMutation(publishOrganizationRateM, {
        onCompleted() {
            onGetComponent(getOrganization, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Организация')

        if (account.shortid !== '') {
            onGetComponent(getOrganization, id)
        }
    }, [account])

    useEffect(() => {
        if (organization !== null) {
            setIsLoading(false)
            setImage(organization.image)
            setCords(organization.cords)
        }
    }, [organization])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (isNaN(salary)) {
            setSalary(DEFAULT_SALARY)
        }
    }, [salary])

    const onManageOpinion = (option: string) => {
        let isOpinionExist: boolean = opinion !== null

        manageOrganizationOpinion({
            variables: {
                name: account.name, id, option, text, employee, level, dateUp, likes: isOpinionExist ? opinion.likes + account.shortid : '', collId: isOpinionExist ? opinion.shortid : '' 
            }
        })
    } 

    const onUpdatePhotography = () => updateOrganizationPhotography({
        variables: {
            name: account.name, id, image
        }
    })

    const onPublishRate = () => publishOrganizationRate({
        variables: {
            name: account.name, id, salary, ratio, percent 
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <ImageLook src={image} className='photo' />

                    <h2>{organization?.title}</h2>
                    
                    <h5 className='pale'>{organization?.category} | {organization?.format}</h5>

                    <ImageLoader setImage={setImage} />

                    <button onClick={onUpdatePhotography} className='light'>Обновить</button>

                    {opinion === null ?
                            <>
                                <h2>Новое Мнение</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите ваши впечатления...' />

                                <input value={employee} onChange={e => setState({...state, employee: e.target.value})} placeholder='ФИО сотрудника' type='text' />

                                <h5 className='pale'>Уровень компетенции</h5>

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVENS.map(el => <option value={el}>{el}</option>)}
                                </select> 

                                <button onClick={() => onManageOpinion('create')}>Добавить</button>

                                <DataPagination items={organization?.options} setItems={setOpinions} label='Мнения об учереждении:' />

                                <div className='items half'>
                                    {opinions.map(el => 
                                        <div onClick={() => setOpinion(el)} className='item panel'>
                                            {codus.short(el.text)}
                                            <small>{el.level}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setOpinion(null)} />

                                <h2>Мнение о {opinion.employee} от {opinion.name} ({opinion.dateUp})</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Уровень компетенции: {opinion.level}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                <p>Текст: {opinion.text}</p>

                                {account.name === opinion.name ?
                                        <button onClick={() => onManageOpinion('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManageOpinion('like')} dependency={opinion} likes={opinion.likes} setCounter={setLikes} />
                                }
                            </>
                    }

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL> 

                    <h2>Новая Оценка</h2>

                    <h5 className='pale'>Уровень ЗП руководства: <b>{salary}К {CURRENCY}</b></h5>

                    <input value={salary} onChange={e => setSalary(parseInt(e.target.value))} type='text' />

                    <div className='items little'>
                        <div className='item'>
                            <h5 className='pale'>Соотношение зарплат (min & max)</h5>
                            <input value={ratio} onChange={e => setState({...state, ratio: parseInt(e.target.value)})} type='range' step={1} />
                        </div>
                        <div className='item'>
                            <h5 className='pale'>Размер НДФЛ: <b>{percent}%</b></h5>
                            <input value={percent} onChange={e => setState({...state, percent: parseInt(e.target.value)})} type='range' step={1} />
                        </div>
                    </div>

                    <button onClick={onPublishRate}>Опубликовать</button>

                    <h2>Текущие оценки</h2>
                </>
            }
            isLoading={isLoading}
            text='Стравница организации загружается'
        />
    )
}

export default Organization