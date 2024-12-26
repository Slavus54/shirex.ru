import {SimpleTriggerProps} from '@/env/types'

const CloseIt: React.FC<SimpleTriggerProps> = ({onClick}) => <div onClick={onClick} className='close'>✖</div>

export default CloseIt