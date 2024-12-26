import React, {useState, useMemo, useEffect} from 'react'
import {PAGINATION_LIMIT} from '@/env/env'
import {DataPaginationProps} from '@/env/types'

const DataPagination: React.FC<DataPaginationProps> = ({items = [], setItems, label = 'Список:'}) => {
    const [maxPage, setMaxPage] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(0)

    useMemo(() => {
        let max = Math.ceil(items.length / PAGINATION_LIMIT)

        setMaxPage(max)    
        setCurrentPage(max > 0 ? 1 : 0)
    }, [items])

    useMemo(() => {
        if (currentPage > maxPage) {
            setCurrentPage(maxPage)
        }
    }, [maxPage])

    useEffect(() => {
        let result = items.slice((currentPage - 1) * PAGINATION_LIMIT, currentPage * PAGINATION_LIMIT)
  
        setItems(result)
    }, [currentPage])

    return (
        <>
            <div className='items small'>
                <img onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} src='https://img.icons8.com/ios/50/left--v1.png' className='icon' alt='prev' />
                <h3>{label} {currentPage}/{maxPage}</h3>
                <img onClick={() => currentPage < maxPage && setCurrentPage(currentPage + 1)} src='https://img.icons8.com/ios/50/right--v1.png' className='icon' alt='next' />
            </div>
        </>
    )
}

export default DataPagination