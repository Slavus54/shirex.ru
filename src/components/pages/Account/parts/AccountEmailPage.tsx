import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import {updateProfileInfo} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {updateProfileEmailM} from '../gql'
import {MAILBOX_TYPES, MAILBOX_ICON} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountEmailPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [state, setState] = useState({
        base: '', 
        mailbox: MAILBOX_TYPES[0]
    })

    const {base, mailbox} = state

    const [updateProfileEmail] = useMutation(updateProfileEmailM, {
        onCompleted(data) {
            buildNotification(data.updateProfileEmail)
            updateProfileInfo(null)
        }
    })

    const onUpdate = () => {
        updateProfileEmail({
            variables: {
                id: profile.shortid, email: `${base}${MAILBOX_ICON}${mailbox}`
            }
        })

        setIsLoading(true)
    }

    return <ComponentLoadingWrapper
        component={
            <>
                <h2>Почтовый ящик</h2>

                <input value={base} onChange={e => setState({...state, base: e.target.value})} placeholder='Почтовый адрес' type='text' />
            
                <h5 className='pale'>Выберите домен для почты</h5>

                <select value={mailbox} onChange={e => setState({...state, mailbox: e.target.value})}>
                    {MAILBOX_TYPES.map(el => <option value={el}>{el}</option>)}
                </select>

                <span>Старый адрес: {profile.email}</span>

                <button onClick={onUpdate}>Обновить</button>
            </>
        }
        isLoading={isLoading}
        isAppShell={false}
        text='Новый почтовый ящик устанавливается'
    />
}

export default AccountEmailPage