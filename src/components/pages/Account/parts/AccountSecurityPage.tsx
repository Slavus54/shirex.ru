import React, {useState, useRef, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {updateProfileInfo} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {updateProfilePasswordM} from '../gql'
import {PASSWORD_POWER_COLORS, PASSWORD_DEFAULT_COLOR, PASSWORD_DEFAULT_SIZE, PASSWORD_SIZE_LIMIT, PASSWORD_ITEMS_SIZE} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountSecurityPage: React.FC<AccountPropsType> = ({profile}) => {    
    const newPasswordInput = useRef(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [percent, setPercent] = useState<number>(codus.part(PASSWORD_DEFAULT_SIZE, PASSWORD_SIZE_LIMIT))
    const [length, setLength] = useState<number>(codus.percent(percent, PASSWORD_SIZE_LIMIT))

    const [passwords, setPasswords] = useState<string[]>(new Array(PASSWORD_ITEMS_SIZE).fill('').map(() => codus.id(PASSWORD_DEFAULT_SIZE)))
    const [points, setPoints] = useState<number>(0)
    const [state, setState] = useState({
        current_password: '', 
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePassword)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result = codus.passwordDifficulty(new_password)

        setPoints(result)
    }, [new_password])

    useMemo(() => {
        let input = newPasswordInput.current
        let colors = PASSWORD_POWER_COLORS.filter(el => points >= el.points)
        let latest = colors[colors.length - 1]

        if (input) {
            if (Boolean(colors.length)) {
                input.style.borderBottom = `.2rem solid ${latest.title}`
            } else {
                input.style.borderBottom = `.2rem solid ${PASSWORD_DEFAULT_COLOR}`
            }
        } 
    }, [points])

    useMemo(() => {
        let result: number = codus.percent(percent, PASSWORD_SIZE_LIMIT)

        setLength(result)
    }, [percent])

    useMemo(() => {
        setPasswords(new Array(PASSWORD_ITEMS_SIZE).fill('').map(() => codus.id(length)))
    }, [length])

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                id: profile.shortid, current_password, new_password, points
            }
        })

        setIsLoading(true)
    }

    return <ComponentLoadingWrapper 
        component={
            <>
                <h2>Безопасность</h2>
            
                <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Текущий пароль' type='text' />

                <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} ref={newPasswordInput} placeholder='Новый пароль' type='text' />
            
                <h5 className='pale'>Длина пароля: <b>{length}</b></h5>
                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />             

                <h5 className='pale'>Рекомендуемые пароли</h5>
                
                <div className='items small'>
                    {passwords.map(el => <div onClick={() => setState({...state, new_password: new_password !== el ? el : ''})} className='item'>{el}</div>)}
                </div>                          
            
                <button onClick={onUpdate}>Обновить</button>
            </>
        }
        isLoading={isLoading}
        isAppShell={false}
        text='Устанавливается новый пароль'
    />
}

export default AccountSecurityPage