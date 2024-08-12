import Image from 'next/image'
import Form from '@/components/form'
import Bg from '../public/img/2bg.png'

export default function Home() {
  return (
    <section className='relative min-h-screen p-12 md:p-24'>
      <div className='absolute inset-0 z-0'>
        <Image
          src={Bg}
          alt="Background"
          layout='fill'
          objectFit='cover'
          className='opacity-30'
        />
        <div className='absolute inset-0 bg-stone-200 opacity-40'></div>
      </div>
      <div className='relative z-10 container'>
        <h1 className='text-3xl md:text-6xl font-semibold uppercase tracking-tight text-stone-900'>
          Plan Your Build with Precision
        </h1>
        <h1 className='text-xl md:text-4xl font-semibold uppercase tracking-tight text-zinc-500'>
          Labor and Time Estimates
        </h1>
      </div>
      <div className='relative z-10 container mt-8'>
        <Form />
      </div>
    </section>
  )
}
