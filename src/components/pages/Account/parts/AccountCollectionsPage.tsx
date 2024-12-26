import React, {useState, useMemo} from 'react'
import {codus} from '@/shared/libs/libs'
import RouterNavigator from '../../../router/RouterNavigator'
import DataPagination from '@/shared/UI/DataPagination'
import {SEARCH_PERCENT} from '@/env/env'
import {components} from '@/env/collections'
import {DOMAIN_BASE_URL} from '@/env/env'
import {AccountPropsType, AccountCollectionType} from '@/env/types'

const AccountCollectionsPage: React.FC<AccountPropsType> = ({profile}) => {   
    const [urls] = useState([...components, {title: 'Любое', url: ''}])
    const [collections, setCollections] = useState<AccountCollectionType[]>([])

    const [title, setTitle] = useState<string>('')
    const [url, setUrl] = useState<string>('')

    useMemo(() => {
        let result: AccountCollectionType[] = profile.components

        if (title.length !== 0) {
            result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
        }

        if (url.length !== 0) {
            result = result.filter(el => el.url === url)
        }

        setCollections(result)
    }, [title, url])

    const onInviteCode = () => window.navigator.clipboard.writeText(`${DOMAIN_BASE_URL}/register/${profile.name}`)

    return (
        <>
            <h2>Компоненты</h2>

            <div className='items small'>
                {components.map(el => 
                    <div className='item'>
                        <RouterNavigator url={`/create-${el.url}/${profile.shortid}`}>
                            {el.title}
                        </RouterNavigator>
                    </div>
                )}
            </div>
            
            <h2>Поиск</h2>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название компонента...' type='text' />

            <h5 className='pale'>Выберите тип компонента</h5>

            <select value={url} onChange={e => setUrl(e.target.value)}>
                {urls.map(el => <option value={el.url}>{el.title}</option>)}
            </select>

            <h5 className='pale'>Пригласите своих друзей на платформу ShireX через инвайт-ссылку</h5>

            <button onClick={onInviteCode}>Скопировать</button>

            <DataPagination items={profile.components} setItems={setCollections} label='Список ваших компонентов:' />
            <div className='items half'>
                {collections.map(el => 
                    <div className='item panel'>
                        <RouterNavigator url={`/${el.url}/${el.shortid}`}>
                            {codus.short(el.title)}
                        </RouterNavigator>
                        <small>{el.url}</small>
                    </div>
                )}
            </div>            
        </>
    )
}

export default AccountCollectionsPage