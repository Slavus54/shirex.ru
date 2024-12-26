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
import {getCompanyM, manageCompanyReviewM, updateCompanyInformationM, manageCompanyProductM} from './gql'
import {CURRENCY, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {CRITERIONS, PRODUCT_TYPES, REVIEW_DEFAULT_RATING, PRODUCT_STATUSES, PRODUCT_DEFAULT_COST} from './env'
import {ContextType, MapType, Cords} from '@/env/types'

const Company: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [reviews, setReviews] = useState<any[]>([])
    const [review, setReview] = useState<any | null>(null)
    const [products, setProducts] = useState<any[]>([])
    const [product, setProduct] = useState<any | null>(null)
    const [company, setCompany] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isProductExist, setIsProductExist] = useState<boolean>(false)
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [cost, setCost] = useState<number>(PRODUCT_DEFAULT_COST)
    const [likes, setLikes] = useState<number>(0)
    const [status, setStatus] = useState<string>(PRODUCT_STATUSES[0])
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        criterion: CRITERIONS[0],
        rating: REVIEW_DEFAULT_RATING,
        dateUp: datus.now('date'),
        capitalization: 0,
        url: '',
        title: '',
        category: PRODUCT_TYPES[0]
    })

    const {text, criterion, rating, dateUp, capitalization, url, title, category} = state

    const [getCompany] = useMutation(getCompanyM, {
        onCompleted(data) {
            setCompany(data.getCompany)
        }
    })

    const [manageCompanyReview] = useMutation(manageCompanyReviewM, {
        onCompleted() {
            onGetComponent(getCompany, id)
        }
    })

    const [updateCompanyInformation] = useMutation(updateCompanyInformationM, {
        onCompleted() {
            onGetComponent(getCompany, id)
        }
    })

    const [manageCompanyProduct] = useMutation(manageCompanyProductM, {
        onCompleted() {
            onGetComponent(getCompany, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Комании')

        if (account.shortid !== '') {
            onGetComponent(getCompany, id)
        }
    }, [account])

    useEffect(() => {
        if (company !== null) {
            setCords(company.cords)
            setIsLoading(false)
            setIsAuthor(account.name === company.name)

            setState({...state, capitalization: company.capitalization, url: company.url})
        }
    }, [company])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        setIsProductExist(product !== null)
    }, [product])

    useMemo(() => {
        setStatus(isProductExist ? product.status : PRODUCT_STATUSES[0])
        setCost(isProductExist ? product.cost : PRODUCT_DEFAULT_COST)
    }, [isProductExist])

    useMemo(() => {
        if (company !== null && isNaN(capitalization)) {
            setState({...state, capitalization: company.capitalization})
        }
    }, [capitalization])

    useMemo(() => {
        if (isNaN(cost)) {
            setCost(isProductExist ? product.cost : PRODUCT_DEFAULT_COST)
        }
    }, [cost, isProductExist])

    const onView = () => window.open(company.url)

    const onManageReview = (option: string) => {
        let isReviewExist: boolean = review !== null

        manageCompanyReview({
            variables: {
                name: account.name, id, option, text, criterion, rating, image, dateUp, likes: isReviewExist ? review.likes + account.shortid : '', collId: isReviewExist ? review.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => updateCompanyInformation({
        variables: {
            name: account.name, id, capitalization, url
        }
    })

    const onManageProduct = (option: string) => manageCompanyProduct({
        variables: {
            name: account.name, id, option, title, category, status, cost, collId: isProductExist ? product.shortid : ''
        }
    })

    return (
        <ComponentLoadingWrapper 
            component={
                <>
                    <h2>{company?.title}</h2>

                    <h5 className='pale'>{company?.category} | {company?.format}</h5>

                    <button onClick={onView} className='light'>Веб-ресурс</button>

                    {isAuthor ? 
                            <>
                                <h5 className='pale'>Капитализация: (млн. {CURRENCY})</h5>
                            
                                <input value={capitalization} onChange={e => setState({...state, capitalization: parseInt(e.target.value)})} placeholder='Размер оборота' type='text' />
                               
                                <h5 className='pale'>URL</h5>

                                <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' /> 

                                <button onClick={onUpdateInformation}>Обновить</button>

                                <h2>Новый Продукт</h2>
                            
                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Полное название продукта...' />

                                <div className='items small'>
                                    {PRODUCT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div> 

                                <h5 className='pale'>Цена: <b>{cost}{CURRENCY}</b></h5>

                                <input value={cost} onChange={e => setCost(parseInt(e.target.value))} placeholder='Стоимость' type='input' />

                                <select value={status} onChange={e => setStatus(e.target.value)}>
                                    {PRODUCT_STATUSES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <button onClick={() => onManageProduct('create')}>Добавить</button>
                            </>
                        :
                            <>
                                <h2>Отзыв</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Ваше мнение...' />

                                <div className='items small'>
                                    {CRITERIONS.map(el => <div onClick={() => setState({...state, criterion: el})} className={classHandler(el, criterion)}>{el}</div>)}
                                </div> 

                                <h5 className='pale'>Рейтинг: <b>{rating}%</b></h5> 
                            
                                <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                                <ImageLoader setImage={setImage} />
                            
                                <button onClick={() => onManageReview('create')}>Опубликовать</button>
                            </>
                    }

                    {review === null ?
                            <>
                                <DataPagination items={company.reviews} setItems={setReviews} label='Отзывы о компании:' />

                                <div className='items half'>
                                    {reviews.map(el => 
                                        <div onClick={() => setReview(el)} className='item panel'>
                                            {codus.short(el.text)}
                                            <small>{el.criterion}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setReview(null)} />

                                {review.image !== '' && <ImageLook src={review.image} className='photo' />}

                                <h2>Отзыв от {review.name}</h2>

                                <small>{review.text} ({review.dateUp})</small>

                                <div className='items little'>
                                    <h5 className='pale'>Критерий: {review.criterion}</h5>
                                    <h5 className='pale'><b>{likes}</b> лайков</h5>
                                </div>

                                {account.name === review.name ?
                                        <button onClick={() => onManageReview('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManageReview('like')} dependency={review} likes={review.likes} setCounter={setLikes} />
                                }
                            </>
                    }        

                    <ReactMapGL mapStyle={onInitMapStyle()} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker />
                        </Marker>
                    </ReactMapGL>     

                    {product === null ?
                            <>
                                <DataPagination items={company.products} setItems={setProducts} label='Продукты компании:' />

                                <div className='items half'>
                                    {products.map(el => 
                                        <div onClick={() => setProduct(el)} className='item card'>
                                            {codus.short(el.title)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setProduct(null)} />

                                <h2>{product.title}</h2>

                                <div className='items little'>
                                    <h5 className='pale'>Тип: {product.category}</h5>
                                    <h5 className='pale'>Цена: <b>{product.cost}{CURRENCY}</b></h5>
                                </div>

                                {isAuthor &&
                                    <>
                                        <div className='items little'>
                                            <button onClick={() => onManageProduct('delete')}>Удалить</button>
                                            <button onClick={() => onManageProduct('update')}>Обновить</button>
                                        </div>
                                    </>
                                }
                            </>
                    }        
                </>
            }
            isLoading={isLoading}
            text='Страница компании загружается'
        />
    )
}

export default Company