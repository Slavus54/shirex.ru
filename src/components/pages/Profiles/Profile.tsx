import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import Photo from '@/assets/photo/profile_photo.jpg'
import {AppContext} from '@/context/AppContext' 
import {codus} from '@/shared/libs/libs'
import {onInitMapStyle} from '@/utils/storage'
import {changeTitle} from '@/utils/notifications'
import {onGetComponent} from '@/utils/graphql'
import DataPagination from '@/shared/UI/DataPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ImageLook from '@/shared/UI/ImageLook'
import CloseIt from '@/shared/UI/CloseIt'
import LikeButton from '@/shared/UI/LikeButton'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {getProfileM, manageProfileSkillM, manageProfilePostM} from './gql'
import {CURRENCY, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {ContextType, MapType, Cords} from '@/env/types'

const Profile: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [skills, setSkills] = useState<any[]>([])
    const [skill, setSkill] = useState<any | null>(null)

    const [posts, setPosts] = useState<any[]>([])
    const [post, setPost] = useState<any | null>(null)

    const [profile, setProfile] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [rating, setRating] = useState<number>(0)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileSkill] = useMutation(manageProfileSkillM, {
        onCompleted() {
            onGetComponent(getProfile, id) 
        }
    })

    const [manageProfilePost] = useMutation(manageProfilePostM, {
        onCompleted() {
            onGetComponent(getProfile, id) 
        }
    })

    useLayoutEffect(() => {
        changeTitle('Пользователь')

        if (account.shortid !== '') {
            onGetComponent(getProfile, id)
        }
    }, [account])

    useEffect(() => {
        if (profile !== null) {
            setImage(profile.image !== '' ? profile.image : Photo) 
            setCords(profile.cords)
            
            setIsLoading(false)
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        setRating(post !== null ? post.rating : 0)
    }, [post])

    const onManageSkill = (option: string) => manageProfileSkill({
        variables: {
            id: profile.shortid, option, text: '', category: '', rate: 0, image: '', likes: skill.likes + account.shortid, collId: skill !== null ? skill.shortid : ''
        }
    })

    const onManagePost = (option: string) => manageProfilePost({
        variables: {
            id: profile.shortid, option, text: '', category: '', territory: '', image, rating, dateUp: '', collId: post !== null ? post.shortid : ''
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <ImageLook src={image} className='photo' />
                  
                    <h2>{profile?.name}</h2>

                    <p>Город - {profile?.region}</p>

                    <div className='items small'>
                        <h4 className='pale'>Почта: <b>{profile?.email}</b></h4>
                        <h4 className='pale'>В сети: <b>{profile?.timestamp}</b></h4>
                    </div>

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker isHome={true} />
                        </Marker>
                    </ReactMapGL> 

                    {skill === null ?
                            <>
                                <DataPagination items={profile?.skills} setItems={setSkills} label='Умения:' />
                                
                                <div className='items half'>
                                    {skills.map(el => 
                                        <div onClick={() => setSkill(el)} className='item card'>
                                            {codus.short(el.text)} ({el.rate}{CURRENCY})
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setSkill(null)} />

                                {skill.image !== '' && <ImageLook src={skill.image} className='photo' />}

                                <h2>{skill.text}</h2>

                                <p>Стоимость: {skill.rate}{CURRENCY} / час</p>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {skill.category}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                <LikeButton onClick={() => onManageSkill('like')} dependency={skill} likes={skill.likes} setCounter={setLikes} />
                            </>
                    }

                    {post === null ?
                            <>
                                <DataPagination items={profile?.posts} setItems={setPosts} label='Посты:' />
                                
                                <div className='items half'>
                                    {posts.map(el => 
                                        <div onClick={() => setPost(el)} className='item panel'>
                                            {codus.short(el.text)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPost(null)} />

                                {post.image !== '' && <ImageLook src={post.image} className='photo' />}

                                <h2>{post.text}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {post.category}</h5>
                                    <h5 className='pale'>Территория: {post.territory}</h5>
                                </div>

                                <h5 className='pale'>Рейтинг: <b>{rating}%</b></h5>
                                <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={() => onManagePost('rate')}>Оценить</button>
                            </>
                    }
                </>
            }
            isLoading={isLoading}
            type='page'
            text='Страница пользователя загружается'
        />
    )
}

export default Profile