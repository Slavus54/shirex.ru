import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import {codus, datus} from '@/shared/libs/libs'
import {updateProfileInfo} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import {classHandler} from '@/utils/css'
import DataPagination from '@/shared/UI/DataPagination'
import ImageLoader from '@/shared/UI/ImageLoader'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {manageProfilePostM} from '../gql'
import {TERRITORY_TYPES} from '@/env/env' 
import {POST_TYPES, DEFAULT_RATING} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountPostsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [posts, setPosts] = useState<any[]>([])
    const [post, setPost] = useState<any | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        category: POST_TYPES[0],
        territory: TERRITORY_TYPES[0],
        dateUp: datus.now('date')
    })

    const {text, category, territory, dateUp} = state

    const [manageProfilePost] = useMutation(manageProfilePostM, {
        onCompleted(data) {
            buildNotification(data.manageProfilePost)
            updateProfileInfo(null)
        }
    })

    const onManagePost = (option: string) => {
        manageProfilePost({
            variables: {
                id: profile.shortid, option, text, category, territory, image, rating: DEFAULT_RATING, dateUp, collId: post !== null ? post.shortid : ''
            }
        })

        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    {post === null ? 
                            <>
                                <h2>Новый пост</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите своё путешествие...' />

                                <div className='items little'>
                                    {POST_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h5 className='pale'>Выберите местоположение</h5>

                                <select value={territory} onChange={e => setState({...state, territory: e.target.value})}>
                                    {TERRITORY_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePost('create')}>Добавить</button>

                                <DataPagination items={profile.posts} setItems={setPosts} label='Мои посты:' />

                                <div className='items small'>
                                    {posts.map(el => 
                                        <div onClick={() => setPost(el)} className='item card'>
                                            {codus.short(el.text)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPost(null)} />
                            
                                {post.image !== '' && <ImageLook src={post.image} className='photo' />}

                                <h3>Описание: <b>{post.text}</b> ({post.dateUp})</h3>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {post.category}</h5>
                                    <h5 className='pale'>Территория: {post.territory}</h5>
                                </div>

                                <button onClick={() => onManagePost('delete')}>Удалить</button>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Пост публикуется, ждите'
        /> 
    )    
}

export default AccountPostsPage