import Form from '@/components/form'
export default function Home() {
  return (
    <section className='relative min-h-screen p-12 md:p-24  '>
      <div className='container'>
        <h1 className='text-3xl md:text-6xl font-semibold uppercase tracking-tight text-gray-900'>
          Plan Your Build with Precision
        </h1>
        <h1 className='text-xl md:text-4xl font-semibold uppercase tracking-tight text-gray-400'>
          Labor and Time Estimates
        </h1>
      </div>
      <div className='container'>
        <Form />
      </div>
    </section>
  )
}
