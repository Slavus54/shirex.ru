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
import {getFamilyM, manageFamilyNoteM, giveFamilyHonorM, manageFamilyQuestionM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {NOTE_TYPES, RELATIVES, DEFALT_HONOR, MAX_HONOR_CHANGE, QUESTION_TYPES} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Family: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [notes, setNotes] = useState<any[]>([])
    const [note, setNote] = useState<any | null>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [question, setQuestion] = useState<any | null>(null)
    const [family, setFamily] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [honor, setHonor] = useState<number>(DEFALT_HONOR)
    const [likes, setLikes] = useState<number>(0)
    const [reply, setReply] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '',
        category: NOTE_TYPES[0],
        relative: RELATIVES[0],
        dateUp: datus.now('date'),
        text: '',
        format: QUESTION_TYPES[0]
    })

    const {title, category, relative, dateUp, text, format} = state

    const [getFamily] = useMutation(getFamilyM, {
        onCompleted(data) {
            setFamily(data.getFamily)
        }
    })

    const [manageFamilyNote] = useMutation(manageFamilyNoteM, {
        onCompleted() {
            onGetComponent(getFamily, id)
        }
    })

    const [giveFamilyHonor] = useMutation(giveFamilyHonorM, {
        onCompleted() {
            onGetComponent(getFamily, id)
        }
    })

    const [manageFamilyQuestion] = useMutation(manageFamilyQuestionM, {
        onCompleted() {
            onGetComponent(getFamily, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Семья')

        if (account.shortid !== '') {
            onGetComponent(getFamily, id)
        }
    }, [account])

    useEffect(() => {
        if (family !== null) {
            setCords(family.cords)
            setIsAuthor(account.name === family.name)
            setIsLoading(false)

            setHonor(family.honor)
        }
    }, [family])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (family !== null) {
            let difference: number = Math.abs(family.honor - honor)

            if (difference > MAX_HONOR_CHANGE) {
                setHonor(family.honor)
            }
        }
    }, [family, honor])

    useMemo(() => {
        setReply(question !== null ? question.reply : '')
    }, [question])

    const onManageNote = option => {
        let isNoteExist: boolean = note !== null

        manageFamilyNote({
            variables: {
                name: account.name, id, option, title, category, relative, image, dateUp, likes: isNoteExist ? note.likes + account.shortid : '', collId: isNoteExist ? note.shortid : ''
            }
        })
    }

    const onGiveHonor = () => giveFamilyHonor({
        variables: {
            name: account.name, id, honor
        }
    })

    const onManageQuestion = option => {
        let isQuestionExist: boolean = question !== null

        manageFamilyQuestion({
            variables: {
                name: account.name, id, option, text, format, reply, isAnswered: isQuestionExist, collId: isQuestionExist ? question.shortid : ''
            }
        })
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{family?.title}</h2>

                    <h4 className='pale'>{family?.category} | {family?.religion} | {family?.century}</h4>

                    {isAuthor ? 
                            <>
                                <h2>Новый Пост</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите событие в вашей семье...' />

                                <div className='items small'>
                                    {NOTE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div> 

                                <select value={relative} onChange={e => setState({...state, relative: e.target.value})}>
                                    {RELATIVES.map(el => <option value={el}>{el}</option>)}
                                </select>  

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageNote('create')}>Добавить</button>
                            </>
                        :
                            <>
                                <h2>Новый Вопрос</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Формулировка вопроса к семье...' />

                                <div className='items small'>
                                    {QUESTION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div> 

                                <button onClick={() => onManageQuestion('create')}>Задать</button>

                                <h4 className='pale'>Репутация: <b>{honor}%</b></h4>
                                <input value={honor} onChange={e => setHonor(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={onGiveHonor} className='light'>Обновить</button>
                            </> 
                    }

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL> 

                    {notes === null ?
                            <>
                                <DataPagination items={family.notes} setItems={setNotes} label='Посты:' />

                                <div className='items half'>
                                    {notes.map(el => 
                                        <div onClick={() => setNote(el)} className='item panel'>
                                            {codus.short(el.title)}

                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setNote(null)} />

                                {note.image !== '' && <ImageLook src={note.image} className='photo' />}

                                <h2>{note.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {note.category}({note.relative})</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                {isAuthor ? 
                                        <button onClick={() => onManageNote('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManageNote('like')} dependency={note} likes={note.likes} setCounter={setLikes} />
                                }
                            </>
                    }

                    {question === null ?
                            <>
                                <DataPagination items={family.questions} setItems={setQuestions} label='Вопросы к семье:' />

                                <div className='items half'>
                                    {questions.map(el => 
                                        <div onClick={() => setQuestion(el)} className='item panel'>
                                            {codus.short(el.text)}

                                            <small>{el.format} ({el.isAnswered ? 'Есть ответ' : 'Ожидание ответа'})</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>{question.text}?</h2>

                                <h5 className='pale'>Тип: {question.format}</h5>

                                <span>Ответ: {reply}</span>

                                {!question.isAnswered && isAuthor &&
                                    <>
                                        <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder='Введите ответ на вопрос...' />

                                        <button onClick={() => onManageQuestion('reply')}>Ответить</button>
                                    </>
                                }

                                {account.name === question.name && <button onClick={() => onManageQuestion('delete')}>Удалить</button>}
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            text='Страница семьи загружается'
        />
    )
}

export default Family