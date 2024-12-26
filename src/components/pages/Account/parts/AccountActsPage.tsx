import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {updateProfileInfo} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import {classHandler} from '@/utils/css'
import DataPagination from '@/shared/UI/DataPagination'
import CloseIt from '@/shared/UI/CloseIt'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {manageProfileActM} from '../gql'
import {ACT_TYPES, ACT_FORMATS, LEVELS} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountActsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [acts, setActs] = useState<any[]>([])
    const [act, setAct] = useState<any | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [state, setState] = useState({
        text: '',
        category: ACT_TYPES[0],
        format: ACT_FORMATS[0],
        level: LEVELS[0],
        respect: ''
    })

    const {text, category, format, level, respect} = state

    const [manageProfileAct] = useMutation(manageProfileActM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAct)
            updateProfileInfo(null)
        }
    })

    const onManageAct = (option: string) => {
        manageProfileAct({
            variables: {
                id: profile.shortid, option, text, category, format, level, respect, collId: act !== null ? act.shortid : ''
            }
        })

        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    {act === null ? 
                            <>
                                <h2>Новый акт</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Формулировка...' />

                                <div className='items little'>
                                    {ACT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h5 className='pale'>Выберите тип и масштаб</h5>

                                <div className='items little'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {ACT_FORMATS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={() => onManageAct('create')}>Добавить</button>

                                <DataPagination items={profile.acts} setItems={setActs} label='Законотворчество:' />

                                <div className='items small'>
                                    {acts.map(el => 
                                        <div onClick={() => setAct(el)} className='item card'>
                                            {codus.short(el.text)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setAct(null)} />

                                <h3>Формулировка: <b>{act.text}</b></h3>

                                <div className='items little'>
                                    <h5 className='pale'>Категория: {act.category}</h5>
                                    <h5 className='pale'>Тип: {act.format} ({act.level})</h5>
                                </div>

                                {act.respect !== '' && <p>Респект от {act.respect}</p>}

                                <button onClick={() => onManageAct('delete')}>Удалить</button>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Акт публикуется, ждите'
        /> 
    )    
}

export default AccountActsPage