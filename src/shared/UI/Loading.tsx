import React from 'react'
import {LoadingPropsType} from '@/env/types'

const Loading: React.FC<LoadingPropsType> = ({label = ''}) => 
    <>
        <img src='../loading.gif' className='loading' alt='Загрузка' />
        {label}...
    </>

export default Loading