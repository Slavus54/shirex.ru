import {useState, useLayoutEffect, useRef} from 'react'
import {onInitTest, onUpdateTest} from "@/utils/storage"
import questions from '@/api/questions.json'

const Test = () => {
    const [isAnswered, setIsAnswered] = useState<boolean>(false)
    const answers = useRef(null)

    const [question] = useState(questions[Math.floor(questions.length * Math.random())]) 
    const [state, setState] = useState({
        points: 0, 
        percent: 0, 
        length: 0
    })

    useLayoutEffect(() => {
        let data = onInitTest()

        if (data) {
            setState({...state, points: data.points, percent: data.percent, length: data.length})
        } 
    }, [])

    const onAnswer = answer => {
        answers.current.childNodes.forEach(el => {
            let value = el.textContent

            if (value === question.right_answer) {
                el.classList.add('right-answer')
            } else {
                el.classList.add('wrong-answer')
            }
        })

        let data = onUpdateTest(question.right_answer === answer)       
        
        setIsAnswered(true)
        setState({...state, points: data.points, percent: data.percent, length: data.length})
    }

    return (
        <div className='test'>
            {question.text}

            <div className='items little' ref={answers}>
                {question.answers.map(el => <div onClick={() => isAnswered ? '' : onAnswer(el)} className='test__item'>{el}</div>)}
            </div>

            <div className='items little'>
                <small>Очки: {state?.points}</small>
                <small>Правильные ответы: {state?.percent}%</small>
            </div>
        </div>
    )
}

export default Test