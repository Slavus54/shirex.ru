import React, {useState, useMemo} from 'react'
import {codus} from '@/shared/libs/libs'
import ImageLook from '@/shared/UI/ImageLook'
import {CURRENCY} from '@/env/env'
import {DEFAULT_MAX_VALUE, DEFAULT_BASE, DEFAULT_WASTE, TAX_INCOME_RATE, TAX_MEDICAL_RATE, TAX_SOCIAL_RATE, TAX_PANSION_RATE, TAX_PRICE_RATE, TAX_ICON_URL} from '../env'
import {AccountPropsType} from '@/env/types'

const AccountTaxCalculatorPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [base, setBase] = useState<number>(DEFAULT_BASE)
    const [waste, setWaste] = useState<number>(DEFAULT_WASTE)

    const [incomeTax, setIncomeTax] = useState<number>(codus.percent(TAX_INCOME_RATE, base, 1))
    const [medTax, setMedTax] = useState<number>(codus.percent(TAX_MEDICAL_RATE, base, 1))
    const [socialTax, setSocialTax] = useState<number>(codus.percent(TAX_SOCIAL_RATE, base, 1))
    const [pansionTax, setPansionTax] = useState<number>(codus.percent(TAX_PANSION_RATE, base, 1))
    const [priceTax, setPriceTax] = useState<number>(codus.percent(TAX_PRICE_RATE, waste, 1))
    const [totalTax, setTotalTax] = useState<number>(incomeTax + medTax + socialTax + pansionTax + priceTax)

    useMemo(() => {
        if (isNaN(waste) || waste > base) {
            setWaste(DEFAULT_WASTE)
        }

        setIncomeTax(codus.percent(TAX_INCOME_RATE, base, 1))
        setMedTax(codus.percent(TAX_MEDICAL_RATE, base, 1))
        setSocialTax(codus.percent(TAX_SOCIAL_RATE, base, 1))
        setPansionTax(codus.percent(TAX_PANSION_RATE, base, 1))
        setPriceTax(codus.percent(TAX_PRICE_RATE, waste, 1))
    }, [waste, base])

    useMemo(() => {
        setTotalTax(codus.round(incomeTax + medTax + socialTax + pansionTax + priceTax, 1))
    }, [incomeTax, medTax, socialTax, pansionTax, priceTax])

    useMemo(() => {
        if (isNaN(base) || base > DEFAULT_MAX_VALUE) {
            setBase(DEFAULT_BASE)
        }
    }, [base])

    return (
        <>
            <h2>Калькулятор налогов гражданина РФ</h2>

            <div className='items little'>
                <div className='item'>
                    <h4 className='pale'>Доход: <b>{base} тыс. {CURRENCY}</b></h4>
                    <input value={base} onChange={e => setBase(parseInt(e.target.value))} placeholder='Зарплата' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Расходы <b>{waste} тыс. {CURRENCY}</b></h4>
                    <input value={waste} onChange={e => setWaste(parseInt(e.target.value))} placeholder='Траты' type='text' />
                </div>
            </div>         

            <ImageLook src={TAX_ICON_URL} className='icon' />   

            <div className='items small'>
                <div className='item'>
                    <h5 className='pale'>НДФЛ ({TAX_INCOME_RATE}%) - {incomeTax} тыс.</h5>
                    <h5 className='pale'>ОМС ({TAX_MEDICAL_RATE}%) - {medTax} тыс.</h5>
                </div>
                <div className='item'>
                    <h5 className='pale'>ФСС ({TAX_SOCIAL_RATE}%) - {socialTax} тыс.</h5>
                    <h5 className='pale'>ПФР ({TAX_PANSION_RATE}%) - {pansionTax} тыс.</h5>
                </div>
                <div className='item'>
                    <h5 className='pale'>НДС ({TAX_PRICE_RATE}%) - {priceTax} тыс.</h5>
                    <h5 className='pale'>Всего: <b>{totalTax} тыс.</b></h5>
                </div>          
            </div>  
        </>
    )    
}

export default AccountTaxCalculatorPage