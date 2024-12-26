import React, {useState, useMemo} from 'react'
import {codus, datus} from '@/shared/libs/libs'
import {onGetDraft, onCreateDraft} from '@/utils/storage' 
import {DraftFormType} from '@/env/types'

const DraftFormWrapper: React.FC<DraftFormType> = ({title, setTitle}) => {
    const [draft] = useState(onGetDraft(window.location.pathname))

    useMemo(() => {
        if (title !== '') {
            onCreateDraft(title, window.location.pathname, datus.now())
        }
    }, [title])
    
    return draft?.title !== '' ? 
            <div onClick={() => setTitle(draft?.title)} className='draft-area'>
                {codus.short(draft?.title, 5)}
                <small>Дата черновика: {draft?.dateUp}</small>
            </div>
        :
            <>
            </>  
}

export default DraftFormWrapper