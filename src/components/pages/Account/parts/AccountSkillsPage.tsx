import React, {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {updateProfileInfo} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import {classHandler} from '@/utils/css'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import useRandomPercent from '@/components/hooks/useRandomPercent'
import {manageProfileSkillM} from '../gql'
import {CURRENCY} from '@/env/env' 
import {SKILL_TYPES, SKILL_RATE_LIMIT} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountSkillsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [skills, setSkills] = useState<any[]>([])
    const [skill, setSkill] = useState<any | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [percent, setPercent] = useState<number>(useRandomPercent(25))
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        category: SKILL_TYPES[0],
        rate: 0
    })

    const {text, category, rate} = state

    const [manageProfileSkill] = useMutation(manageProfileSkillM, {
        onCompleted(data) {
            buildNotification(data.manageProfileSkill)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result = codus.percent(percent, SKILL_RATE_LIMIT, 0)

        setState({...state, rate: result})
    }, [percent])

    useMemo(() => {
        let flag: boolean = skill !== null

        setImage(flag ? skill.image : '')
        setPercent(flag ? codus.part(skill.rate, SKILL_RATE_LIMIT, 0) : useRandomPercent(25))
    }, [skill])

    const onManageSkill = (option: string) => {
        manageProfileSkill({
            variables: {
                id: profile.shortid, option, text, category, rate, image, likes: '', collId: skill !== null ? skill.shortid : ''
            }
        })

        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    {skill === null ? 
                            <>
                                <h2>Новое умение</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите свою услугу...' data-symbols={text.length} />

                                <div className='items little'>
                                    {SKILL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h5 className='pale'>Ставка: <b>{rate}{CURRENCY}</b>/час</h5>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageSkill('create')}>Добавить</button>

                                <DataPagination items={profile.skills} setItems={setSkills} label='Мои умения:' />

                                <div className='items small'>
                                    {skills.map(el => 
                                        <div onClick={() => setSkill(el)} className='item card'>
                                            {codus.short(el.text)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setSkill(null)} />
                            
                                {image !== '' && <ImageLook src={image} className='photo' />}

                                <h3>Услуга: <b>{skill.text}</b></h3>

                                <span className='pale'>Тип: {skill.category}</span>
                            
                                <h5 className='pale'>Ставка: <b>{rate}{CURRENCY}</b>/час</h5>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <ImageLoader setImage={setImage} />

                                <div className='items little'>
                                    <button onClick={() => onManageSkill('delete')}>Удалить</button>
                                    <button onClick={() => onManageSkill('update')}>Обновить</button>
                                </div>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Умение добавляется, ждите'
        /> 
    )    
}

export default AccountSkillsPage