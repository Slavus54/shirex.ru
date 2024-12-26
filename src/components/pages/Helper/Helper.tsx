import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {datus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import useRandomPercent from '@/components/hooks/useRandomPercent'
import {sendHelperEmailM} from './gql'
import {PROBLEM_TYPES} from './env'
import {ContextType} from '@/env/types'

const Helper: React.FC = () => {
    const {account} = useContext<ContextType>(AppContext)

    const [state, setState] = useState({
        text: '',
        category: PROBLEM_TYPES[0],
        rating: useRandomPercent(2e1),
        dateUp: datus.now()
    })

    const {text, category, rating, dateUp} = state

    useLayoutEffect(() => {
        changeTitle('Техподдержка')
    }, [])

    const [sendHelperEmail] = useMutation(sendHelperEmailM)
    
    const onSendEmail = () => sendHelperEmail({
        variables: {
            id: account.shortid, text, category, rating, dateUp
        }
    })

    return (
        <>
            <h2>Техническая поддержка</h2>

            <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите вашу ситуацию...' />

            <h5 className='pale'>Классификация проблемы</h5>

            <div className='items small'>
                {PROBLEM_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className='item'>{el}</div>)}
            </div>

            <h5 className='pale'>Оценка платформы: {rating}%</h5>
            <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

            <button onClick={onSendEmail}>Отправить</button>
        </>
    )
}

export default Helper