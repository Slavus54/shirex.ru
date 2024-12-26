import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus, weekdays} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import {onGetComponent} from '@/utils/graphql'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getBlockM, manageBlockStatusM, updateBlockAmountRateM, offerBlockPlaceM, publishBlockItemM, manageBlockTaskM} from './gql'
import {TERRITORY_TYPES, CURRENCY, MAP_ICON, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {BLOCK_ROLES, TASK_TYPES, ITEM_FORMATS, DEFAULT_AMOUNT, DEFAULT_PROGRESS} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Block: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [tasks, setTasks] = useState<any[]>([])
    const [task, setTask] = useState<any | null>(null)
    const [items, setItems] = useState<any[]>([])
    const [item, setItem] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [personality, setPersonality] = useState<any | null>(null)
    const [block, setBlock] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isTaskOpen, setIsTaskOpen] = useState<boolean>(true)
    const [paySymbol, setPaySymbol] = useState<string>('=')
    const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT)
    const [additive, setAdditive] = useState<number>(0)
    const [progress, setProgress] = useState<number>(DEFAULT_PROGRESS)
    const [likes, setLikes] = useState<number>(0)
    const [role, setRole] = useState<string>(BLOCK_ROLES[0])
    const [weekday, setWeekday] = useState<string>(weekdays[0])
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        category: TASK_TYPES[0],
        dateUp: datus.now('date'),
        territory: TERRITORY_TYPES[0],
        url: '',
        title: '',
        format: ITEM_FORMATS[0],
        building: '',
        isCommon: true
    })

    const {text, category, dateUp, territory, url, title, format, building, isCommon} = state

    const [getBlock] = useMutation(getBlockM, {
        onCompleted(data) {
            setBlock(data.getBlock)
        }
    })

    const [manageBlockStatus] = useMutation(manageBlockStatusM, {
        onCompleted() {
            onGetComponent(getBlock, id)
        }
    })

    const [updateBlockAmountRate] = useMutation(updateBlockAmountRateM, {
        onCompleted() {
            onGetComponent(getBlock, id)
        }
    })

    const [offerBlockPlace] = useMutation(offerBlockPlaceM, {
        onCompleted() {
            onGetComponent(getBlock, id)
        }
    })

    const [publishBlockItem] = useMutation(publishBlockItemM, {
        onCompleted() {
            onGetComponent(getBlock, id)
        }
    })

    const [manageBlockTask] = useMutation(manageBlockTaskM, {
        onCompleted() {
            onGetComponent(getBlock, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Квартал')

        if (account.shortid !== '') {
            onGetComponent(getBlock, id)
        }
    }, [account])

    useEffect(() => {
        if (block !== null) {
            let member = block.members.find(el => el.shortid === account.shortid)
            let isBuildingsExists: boolean = Boolean(block.buildings.length)

            if (member !== undefined) {
                setPersonality(member)
            }

            setAmount(block.amount)
            setCords(block.cords)

            setState({...state, territory: block.territory, url: block.url, building: isBuildingsExists ? block.buildings[0] : ''})

            setIsLoading(false)
        }
    }, [block])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (personality !== null) {
            setRole(personality.role)
            setWeekday(personality.weekday)
        }
    }, [personality])

    useMemo(() => {
        if (block !== null) {
            if (isNaN(amount)) {
                setAmount(block.amount)
            } else {
                let difference: number = Math.abs(amount - block.amount)
                
                setAdditive(difference)
                setPaySymbol(Boolean(difference) ? amount > block.amount ? '+' : '-' : '=')
            }
        }
    }, [block, amount]) 

    useMemo(() => {
        let flag: boolean = task !== null
    
        setImage(flag ? task.image : '')
        setProgress(flag ? task.progress : DEFAULT_PROGRESS)

        setIsTaskOpen(flag)
    }, [task])

    const onView = () => window.open(block?.url)

    const onManageStatus = (option: string) => manageBlockStatus({
        variables: {
            name: account.name, id, option, role, weekday
        }
    })

    const onUpdateAmount = () => updateBlockAmountRate({
        variables: {
            name: account.name, id, amount
        }
    })

    const onOfferPlace = () => offerBlockPlace({
        variables: {
            name: account.name, id, territory, url
        }
    })

    const onPublishItem = () => publishBlockItem({
        variables: {
            name: account.name, id, title, format, building, isCommon
        }
    })

    const onManageTask = (option: string) => manageBlockTask({
        variables: {
            name: account.name, id, option, text, category, progress, image, likes: isTaskOpen ? task.likes + account.shortid : '', dateUp, collId: isTaskOpen ? task.shortid : ''
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{block?.title}</h2>

                    <h4 className='pale'>Тип: <b>{block?.category}</b>, Всего строений: <b>{block?.buildings.length}</b></h4>

                    {block?.url !== '' && <ImageLook onClick={onView} src={MAP_ICON} className='icon' />}

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker isHome={true} />
                        </Marker>
                    </ReactMapGL> 

                    <h4 className='pale'>Роль и день уборки подъезда</h4>

                    <div className='items small'>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            {BLOCK_ROLES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={weekday} onChange={e => setWeekday(e.target.value)}>
                            {weekdays.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    {personality === null && <button onClick={() => onManageStatus('join')}>Присоединиться</button>}

                    {personality !== null &&
                        <>
                            <button onClick={() => onManageStatus('update')}>Обновить</button>

                            {task === null ?
                                    <>
                                        <h2>Новое Задание</h2>

                                        <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Сформулируйте, что необходимо будет сделать...' />

                                        <div className='items small'>
                                            {TASK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                        </div>  
                                        
                                        <ImageLoader setImage={setImage} />

                                        <button onClick={() => onManageTask('create')}>Добавить</button>

                                        <DataPagination items={block?.tasks} setItems={setTasks} label='Список актуальных заданий:' />

                                        <div className='items half'>
                                            {tasks.map(el => 
                                                <div onClick={() => setTask(el)} className='item panel'>
                                                    {codus.short(el.text)}
                                                    <small>{el.category} | {el.progress}%</small>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                :
                                    <>
                                        <CloseIt onClick={() => setTask(null)} />

                                        {image !== '' && <ImageLook src={image} className='photo' />} 

                                        <h2>{task.text} ({task.dateUp})</h2>

                                        <div className='items little'>
                                            <h5 className='pale'>Категория: {task.category}</h5>
                                            <h5 className='pale'><b>{likes}</b> лайков</h5>
                                        </div>

                                        <h5 className='pale'>Прогресс: <b>{progress}%</b></h5>
                                        <input value={progress} onChange={e => setProgress(parseInt(e.target.value))} type='range' step={1} />

                                        <ImageLoader setImage={setImage} />

                                        <div className='items little'>
                                            {account.name === task.name ? 
                                                    <button onClick={() => onManageTask('delete')}>Удалить</button>
                                                :
                                                    <LikeButton onClick={() => onManageTask('like')} dependency={task} likes={task.likes} setCounter={setLikes} />
                                            }
                                            
                                            <button onClick={() => onManageTask('update')}>Обновить</button>
                                        </div>
                                    </>
                            }

                            <h2>Основная информация</h2>

                            <h4 className='pale'>Ежемесячный платёж: <b>{amount} {Boolean(additive) ? `(${paySymbol}${additive}${CURRENCY})` : CURRENCY}</b></h4>
                            <p>Банковская карта - {block?.card}</p>
                            <input value={amount} onChange={e => setAmount(parseInt(e.target.value))} placeholder='Размер платежа' type='text' />

                            <button onClick={onUpdateAmount} className='light'>Обновить</button>

                            <h4 className='pale'>Определите территорию для подражания</h4>

                            <select value={territory} onChange={e => setState({...state, territory: e.target.value})}>
                                {TERRITORY_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>

                            <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='Google Maps URL' type='text' />

                            <button onClick={onOfferPlace}>Предложить</button>

                            {item === null ?
                                    <>
                                        <h2>Новый предмет</h2>

                                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название' type='text' />

                                        <div className='items small'>
                                            {block?.buildings.map(el => <div onClick={() => setState({...state, building: el})} className={classHandler(el, building)}>{el}</div>)}
                                        </div>

                                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                            {ITEM_FORMATS.map(el => <option value={el}>{el}</option>)}
                                        </select>

                                        <span onClick={() => setState({...state, isCommon: !isCommon})}>Собственность: {isCommon ? 'Общая' : 'Частная'}</span>
                                   
                                        <button onClick={onPublishItem}>Опубликовать</button>

                                        <DataPagination items={block?.items} setItems={setItems} label='Список предметов квартала:' />

                                        <div className='items half'>
                                            {items.map(el => 
                                                <div onClick={() => setItem(el)} className='item card'>
                                                    {codus.short(el.title)}
                                                    <small>{el.category}</small>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                :
                                    <>
                                        <CloseIt onClick={() => setItem(null)} />

                                        <h2>{item.title} ({item.building})</h2>

                                        <div className='items little'>
                                            <h5 className='pale'>Тип: {item.format}</h5>
                                            <h5 className='pale'>Собственность: {item.isCommon ? 'Общая' : 'Частная'}</h5>
                                        </div> 
                                    </>
                            }

                            <DataPagination items={block?.members} setItems={setMembers} label='Участники сообщества:' />
                            
                            <div className='items half'>
                                {members.map(el => 
                                    <div className='item card'>
                                        <RouterNavigator url={`/profile/${el.shortid}`}>
                                            {el.name}
                                            <small>{el.role}</small>
                                        </RouterNavigator>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => onManageStatus('exit')} className='light'>Выйти</button>
                        </>
                    }                    
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница квартала загружается'
        />
    )
}

export default Block