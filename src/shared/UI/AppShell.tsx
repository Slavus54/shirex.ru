import ImageLoader from "./ImageLoader"

const AppShell = ({type}) => {
    return (
        <div className='main'>
            {type === 'search' &&
                <>
                    <h2>Поиск</h2>

                    <div className='items little'>
                        <div className='item'>
                            <h4 className='pale'>Название</h4>
                            <input placeholder='Название' type='text' />
                        </div>

                        <div className='item'>
                            <h4 className='pale'>Регион</h4>
                            <input placeholder='Регион' type='text' />
                        </div>
                    </div>

                    <div className='map'>
                    </div>
                </>
            }
            {type === 'profile' &&
                <>

                    <div className='photo-shell'></div>
                    <h3><b>Имя пользователя</b></h3> 

                    <ImageLoader setImage={() => {}} />

                    <button>Обновить</button>      
                </>
            }
            {type === 'page' &&
                <>
                    <div className='headline-shell'></div>      
                    <div className='description-shell'></div>      
                </>
            }
        </div>
    )
}

export default AppShell
