import React from 'react'

const courseCard = () => {
  return (
    <div className='w-[290px] rounded-lg overflow-hidden border'>
        <div className='w-full h-36 bg-primary'></div>
        <div className='p-2'>
            <p className='font-semibold text-base text-black leading-tight'>Curso de Desarrollo Web moderno para principiantes</p>
            <span className='text-xs'>Tomás Ríos Vargas</span>
            <p>Calificacion (98)</p>
        </div>
    </div>
  )
}

export default courseCard