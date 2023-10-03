import React, { memo } from 'react';
import integerLogo from '../../assets/icons/tabler_decimal.svg';
import stringLogo from '../../assets/icons/tabler_text-recognition.svg';
import arrayLogo from '../../assets/icons/tabler_brackets-contain.svg';
import booleanLogo from '../../assets/icons/radix-icons_component-boolean.png';

export default memo(({ data, isConnectable }) => {
    const apiLogo = {
        integerLogo: integerLogo,
        stringLogo: stringLogo,
        arrayLogo: arrayLogo,
        booleanLogo: booleanLogo
    }
    return (
        <div className={`nodeHeader ${data.function}BG`}>
            <div>
                <div className='nodeHeaderDetails'>
                    <img style={{ height: 16 }} src={apiLogo[data.function+"Logo"]} />
                    <div className='functionTitle'>{data.function}</div>
                </div>
            </div>
        </div>
    )
})