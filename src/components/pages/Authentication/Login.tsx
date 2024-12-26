import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus, datus} from '@/shared/libs/libs'
import {createSession, getSession, onInitLocation} from '@/utils/storage'
import {changeTitle} from '@/utils/notifications'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {loginProfileM, resetProfilePasswordM} from './gql'
import {onGetLoadingText} from './env'
import {ID_DEFAULT_SIZE} from '@/env/env'
import {ContextType} from '@/env/types'

const Login: React.FC = () => {
    const {account, accountUpdate} = useContext<ContextType>(AppContext)

    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)

    const [ip, setIP] = useState<string>('')

    const [state, setState] = useState({
        name: '',
        region: '',
        dateUp: '',
        password: '',
        token: account !== null ? account.token : ''
    })

    const {name, region, dateUp, password, token} = state

    useLayoutEffect(() => {
        changeTitle('Логин')

        onInitLocation().then(data => {
            if (data !== null) {
                setIP(data.ip_address)
            }
        })

        let session = getSession()

        if (session !== null) {
            setState({...state, name: session.name, region: session.region, dateUp: session.dateUp})
        }
    }, [])
    
    const [loginProfile] = useMutation(loginProfileM, {
        onCompleted(data) {
            let result = data.loginProfile
            
            if (result.name !== '') {
                accountUpdate(false, result, 3)
                createSession({name: result.name, region: result.region, dateUp: datus.now('date')})
            } else {
                setIsLoginLoading(false)
            }           
        }
    })

    const [resetProfilePassword] = useMutation(resetProfilePasswordM)

    const onResetPassword = () => resetProfilePassword({
        variables: {
            name, password: codus.id(ID_DEFAULT_SIZE)
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                name, password, timestamp: datus.now(), ip, token
            }
        })

        setIsLoginLoading(true)
    }

    return (
            <ComponentLoadingWrapper 
                component={
                    <>
                        <h2>Логин в аккаунт</h2>
                    
                        <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше имя' type='text' />
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль к учётной записи' type='text' />                   

                        {ip !== '' && <b>IP: {ip}</b>}

                        {dateUp !== '' && <p className='pale'>Последние посещение было {dateUp}</p>}

                        <button onClick={onLogin}>Войти</button>

                        <p className='pale'>Забыли пароль?</p>

                        <button onClick={onResetPassword} className='light'>Восстановить</button>
                    </>
                } 
                isLoading={isLoginLoading}
                isAppShell={false}
                text={onGetLoadingText(name, region)}
            />
    )
}

export default Login