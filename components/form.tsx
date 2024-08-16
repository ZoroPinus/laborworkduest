'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { z } from 'zod'
import { EstimationFormSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { format } from 'date-fns'
import Image from 'next/image'
import {
  CalendarPlus,
  DraftingCompass,
  Hammer,
  HardHat,
  ListRestart,
  PencilRuler,
  RotateCcw
} from 'lucide-react'
type Inputs = z.infer<typeof EstimationFormSchema>
const initialValues: Inputs = {
  projectType: '',
  prefUnits: '',
  startDate: new Date(),
  typeOfWork: '',
  estimationType: '',
  structuralMembers: '',
  wallType: '',
  tileType: '',
  width: 0,
  length: 0,
  depth: 0,
  quantity: 0,
  wallLength: 0,
  wallHeight: 0,
  totalRebar: 0,
  height: 0,
  roofing: 0,
  areaOfWindow: 0,
  areaOfDoor: 0,
  chbWidth: 4,
  totalArea: 0,
  special: 0,
  special2: 0,
  labor: 0,
  rainySeason: false,
  lackOfMaterial: false,
  lackOfLabor: false,
  lackOfWater: false,
  lackOfTools: false,
  rework: false,
  totalVolume: 0,
  totalRoofArea: 0,
  workDuration: 0,
  totalWallArea: 0,
  totalWorkDuration: 0,
  totalSpecial: 0,
  totalSpecial2: 0,
  totalLabor: 0
}

const steps = [
  {
    id: 'Step 1',
    name: 'Project Information',
    fields: [
      'projectType',
      'prefUnits',
      'startDate',
      'typeOfWork',
      'estimationType'
    ]
  },
  {
    id: 'Step 2',
    name: 'Data Entry',
    fields: [
      'wallType',
      'tileType',
      'width',
      'length',
      'depth',
      'quantity',
      'wallLength',
      'wallHeight',
      'totalRebar',
      'height',
      'roofing',
      'areaOfWindow',
      'areaOfDoor',
      'chbWidth',
      'totalArea',
      'special',
      'special2',
      'labor',
      'rainySeason',
      'lackOfMaterial',
      'lackOfLabor',
      'lackOfWater',
      'lackOfTools',
      'totalVolume',
      'totalRoofArea',
      'workDuration',
      'totalAreaTile',
      'heightTile',
      'rework',
      'totalWallArea'
    ]
  },
  {
    id: 'Step 3',
    name: 'Summary',
    fields: ['totalWorkDuration', 'totalSpecial', 'totalSpecial2', 'totalLabor']
  }
]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [workDuration, setWorkDuration] = useState(0)
  const [specialWorker, setSpecialWorker] = useState(0)
  const [specialWorker2, setSpecialWorker2] = useState(0)
  const [specialName, setSpecialName] = useState(0)
  const [specialName2, setSpecialName2] = useState(0)
  const [laborWorker, setLaborWorker] = useState(0)
  const [imgType, setImgType] = useState('/img/footing2.png')
  const [imgTypeStep2, setImgTypeStep2] = useState('/img/footing2.png')
  const delta = currentStep - previousStep
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(EstimationFormSchema),
    defaultValues: initialValues
  })

  const processForm: SubmitHandler<Inputs> = data => {
    getTotalWorkDuration()
    getTotalNumberOfWorkers()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        const res = await handleSubmit(processForm)()
        console.log(res)
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }
  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }
  const projecType = 'Bungalow'
  const typeOfWork = watch('typeOfWork')
  const estimationType = watch('estimationType')
  const prefUnits = 'm'
  const calculateCLP = () => {
    const rainySeasonValue = watch('rainySeason') ? 4 : 0
    const lackOfMaterialValue = watch('lackOfMaterial') ? 5 : 0
    const lackOfLaborValue = watch('lackOfLabor') ? 1 : 0
    const lackOfWaterValue = watch('lackOfWater') ? 1 : 0
    const lackOfToolsValue = watch('lackOfTools') ? 5 : 0
    const rework = watch('rework') ? 2 : 0

    const totalSum =
      rainySeasonValue +
      lackOfMaterialValue +
      lackOfLaborValue +
      lackOfWaterValue +
      lackOfToolsValue +
      rework
    return totalSum
  }
  const calculateAverage = (numbers: number[]): number => {
    const validNumbers = numbers.filter(num => num !== 0)
    const total = validNumbers.reduce((sum, num) => sum + num, 0)
    return validNumbers.length > 0 ? total / validNumbers.length : 0
  }
  const getLabelText = () => {
    switch (typeOfWork) {
      case 'Steel Works':
        return 'Skilled'
      case 'Painting Works':
        return 'Painter'
      case 'Roof Works':
        return 'Foreman'
      default:
        return 'Foreman'
    }
  }
  const getTotalUnits = () => {
    if (typeOfWork === 'Concrete Works') {
      return 'm³'
    } else {
      return 'm²'
    }
  }
  const getTotalVolume = () => {
    const w = watch('width')
    const l = watch('length')
    const d = watch('depth')
    const q = watch('quantity')
    const h = watch('height')
    const wt = watch('widthTile')
    const ht = watch('heightTile')

    const wallLength = watch('wallLength')
    const wallHeight = watch('wallHeight')
    const areaOfWindow = watch('areaOfWindow')
    const areaOfDoor = watch('areaOfDoor')

    if (typeOfWork === 'Concrete Works') {
      const area = w! * l! * d! * q!
      return area
    }
    if (typeOfWork === 'Masonry Works') {
      const area = wallLength! * wallHeight! - (areaOfWindow! + areaOfDoor!)
      return area
    }
    if (typeOfWork === 'Painting Works') {
      const area = w! * h!
      return area
    }
    if (typeOfWork === 'Tile Works') {
      const area = wt! * ht!
      return area
    }
  }
  const getUnits = () => {
    switch (prefUnits) {
      case 'mm':
        return 'mm'
      case 'cm':
        return 'cm'
      case 'in':
        return 'in'
      case 'ft':
        return 'ft'
      default:
        return 'm'
    }
  }
  const getDate = (date: Date) => {
    const newDate = new Date(date)

    // Format the date
    const formattedDate = format(newDate, 'MMMM dd, yyyy')
    return formattedDate
  }
  const getExpected = (date: Date, workDuration: number) => {
    const startDate = new Date(date)
    // Add the number of days to the start date
    startDate.setDate(startDate.getDate() + workDuration)

    // Format the date
    const formattedDate = format(startDate, 'MMMM dd, yyyy')

    return formattedDate
  }

  const totalVolume = getTotalVolume()
  const structuralMembers = watch('structuralMembers')
  const wallType = watch('wallType')
  const tileType = watch('tileType')
  const special = watch('special')
  const special2 = watch('special2')
  const labor = watch('labor')
  const clp = calculateCLP()
  const totalRebar = watch('totalRebar')
  const totalRoofArea = watch('totalRoofArea')
  // Formulas
  const getTotalWorkDuration = () => {
    let a, b, c, average, workDuration, res

    if (typeOfWork === 'Concrete Works') {
      if (
        structuralMembers === 'Floor Slab' ||
        structuralMembers === 'Footing'
      ) {
        a = totalVolume! / (5.0507 * special!)
        b = totalVolume! / (1.6836 * special2!)
        c = totalVolume! / (0.8418 * labor!)
      } else {
        a = totalVolume! / (5.0507 * special!)
        b = totalVolume! / (1.6836 * special2!)
        c = totalVolume! / (0.8418 * labor!)
      }

      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }

    if (typeOfWork === 'Masonry Works') {
      a = totalVolume! / (7.65 * special!)
      b = totalVolume! / (15.3 * special2!)
      c = totalVolume! / (7.65 * labor!)

      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }

    if (typeOfWork === 'Steel Works') {
      a = totalRebar! / (1059.2345 * special!)
      b = totalRebar! / (264.8086 * special2!)
      c = totalRebar! / (88.2695 * labor!)

      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }

    if (typeOfWork === 'Painting Works') {
      if (wallType === 'Interior Wall') {
        a = totalVolume! / (8.4 * special!)
        b = totalVolume! / (4.2 * special2!)
        c = totalVolume! / (8.4 * labor!)
      } else if (wallType === 'Exterior Wall') {
        a = totalVolume! / (8.4 * special!)
        b = totalVolume! / (4.2 * special2!)
        c = totalVolume! / (8.4 * labor!)
      } else {
        a = totalVolume! / (8.4 * special!)
        b = totalVolume! / (4.2 * special2!)
        c = totalVolume! / (8.4 * labor!)
      }

      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }

    if (typeOfWork === 'Roof Works') {
      a = totalRoofArea! / (4.152 * special!)
      b = totalRoofArea! / (4.152 * special2!)
      c = totalRoofArea! / (8.304 * labor!)
      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }

    if (typeOfWork === 'Tile Works') {
      if (tileType === 'Floor Tile') {
        a = totalVolume! / (0.9927 * special!)
        b = totalVolume! / (4.9636 * special2!)
        c = totalVolume! / (4.963636364 * labor!)
      } else {
        a = totalVolume! / (0.9927 * special!)
        b = totalVolume! / (4.9636 * special2!)
        c = totalVolume! / (4.963636364 * labor!)
      }

      const numbers = [a, b, c].filter(num => num !== 0)
      const average = calculateAverage(numbers)
      res = clp + average
      workDuration = Math.ceil(res)

      setWorkDuration(workDuration)
      return workDuration
    }
  }

  const getTotalNumberOfWorkers = () => {
    const workDurationInput = watch('workDuration')
    const totalRebar = watch('totalRebar')

    let a, b, noOfSpecial2, noOfSpecial, noOfLabor, res
    if (typeOfWork === 'Concrete Works') {
      if (
        structuralMembers === 'Floor Slab' ||
        structuralMembers === 'Footing'
      ) {
        noOfSpecial = totalVolume! / (5.0507 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (1.6836 * workDurationInput!)
        noOfLabor = totalVolume! / (0.8418 * workDurationInput!)
      } else {
        noOfSpecial = totalVolume! / (5.0507 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (1.6836 * workDurationInput!)
        noOfLabor = totalVolume! / (0.8418 * workDurationInput!)
      }
      setSpecialWorker(Math.ceil(noOfSpecial))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
    if (typeOfWork === 'Masonry Works') {
      noOfSpecial = totalVolume! / (7.65 * workDurationInput!)
      noOfSpecial2 = totalVolume! / (15.3 * workDurationInput!)
      noOfLabor = totalVolume! / (7.65 * workDurationInput!)
      setSpecialWorker(Math.ceil(noOfSpecial))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
    if (typeOfWork === 'Steel Works') {
      noOfSpecial = totalRebar! / (1059.2345 * workDurationInput!)
      noOfSpecial2 = totalRebar! / (264.8086 * workDurationInput!)
      noOfLabor = totalRebar! / (88.2695 * workDurationInput!)
      setSpecialWorker(Math.ceil(noOfSpecial))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
    if (typeOfWork === 'Painting Works') {
      if (structuralMembers === 'Interior Wall') {
        noOfSpecial = totalVolume! / (8.4 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (4.2 * workDurationInput!)
        noOfLabor = totalVolume! / (4.2 * workDurationInput!)
      } else if (structuralMembers === 'Exterior Wall') {
        noOfSpecial = totalVolume! / (8.4 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (4.2 * workDurationInput!)
        noOfLabor = totalVolume! / (4.2 * workDurationInput!)
      } else {
        noOfSpecial = totalVolume! / (8.4 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (4.2 * workDurationInput!)
        noOfLabor = totalVolume! / (4.2 * workDurationInput!)
      }
      setSpecialWorker(Math.ceil(noOfSpecial!))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
    if (typeOfWork === 'Roof Works') {
      noOfSpecial = totalRoofArea! / (8.304 * workDurationInput!)
      noOfSpecial2 = totalRoofArea! / (8.304 * workDurationInput!)
      noOfLabor = totalRoofArea! / (4.152 * workDurationInput!)
      setSpecialWorker(Math.ceil(noOfSpecial))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
    if (typeOfWork === 'Tile Works') {
      if (tileType === 'Floor Tile') {
        noOfSpecial = totalVolume! / (4.963636364 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (0.9927 * workDurationInput!)
        noOfLabor = totalVolume! / (0.9927 * workDurationInput!)
      } else {
        noOfSpecial = totalVolume! / (4.963636364 * workDurationInput!)
        noOfSpecial2 = totalVolume! / (0.9927 * workDurationInput!)
        noOfLabor = totalVolume! / (0.9927 * workDurationInput!)
      }
      setSpecialWorker(Math.ceil(noOfSpecial))
      setSpecialWorker2(Math.ceil(noOfSpecial2))
      setLaborWorker(Math.ceil(noOfLabor))
      return
    }
  }

  useEffect(() => {
    const imgFile = () => {
      switch (typeOfWork) {
        case 'Tile Works':
          return '/img/TILE.png'
        case 'Masonry Works':
          return '/img/CHB.png'
        case 'Steel Works':
          return '/img/REBAR.png'
        case 'Painting Works':
          return '/img/PAINT.png'
        case 'Roof Works':
          return '/img/ROOF.png'
        default:
          return '/img/FOOTING.png'
      }
    }
    const imgType2 = () => {
      if (typeOfWork === 'Concrete Works') {
        switch (structuralMembers) {
          case 'Footing':
            return '/img/FOOTING.png'
          case 'Column':
            return '/img/COLUMN.png'
          case 'Floor Slab':
            return '/img/SLAB.png'
          case 'Roof Beam':
            return '/img/ROOFBEAM.png'
          case 'Grade Beam':
            return '/img/GRADEBEAM.png'
          default:
            return '/img/FOOTING.png'
        }
      } else if (typeOfWork === 'Painting Works') {
        switch (wallType) {
          case 'Exterior Wall':
            return '/img/EXTERIORWALL.png'
          case 'Interior Wall':
            return '/img/INTERIORWALL.png'
          case 'Both':
            return '/img/EXTINTWALL.png'
          default:
            return '/img/EXTINTWALL.png'
        }
      } else if (typeOfWork === 'Tile Works') {
        switch (tileType) {
          case 'Floor Tile':
            return '/img/FLOORTILE.png'
          case 'Wall Tile':
            return '/img/WALLTILE.png'
          default:
            return '/img/FLOORTILE.png'
        }
      } else {
        return '/img/FLOORTILE.png'
      }
    }
    setImgTypeStep2(imgType2)
    setImgType(imgFile)
  }, [typeOfWork, structuralMembers, wallType, tileType])

  const typeOfWorkImg = () => {
    if (typeOfWork === '') {
      return 'Type of Work'
    } else {
      return typeOfWork
    }
  }

  const resetButton = () => {
    reset()
    location.reload()
  }
  return (
    <section className='flex flex-col justify-between py-12  '>
      {/* steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-xl font-semibold text-sky-600 transition-colors '>
                    {step.id}
                  </span>
                  <span className='text-md font-medium'>{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-xl font-semibold text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-md font-medium'>{step.name}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-400 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-xl font-semibold text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-md font-medium'>{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className=' py-10 ' onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='text-center'>
              <h2 className='text-2xl font-semibold leading-7 text-gray-900'>
                Project Information
              </h2>
              <p className='text-md mt-1 leading-6 text-gray-600'>
                Provide your project{`'`}s details.
              </p>
            </div>
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-10'>
              <div className='sm:col-span-5 '>
                <div className='grid-child grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-8 '>
                  <div className='sm:col-span-8'>
                    <label
                      htmlFor='projectType'
                      className='text-md  flex items-center font-medium leading-6 text-gray-900'
                    >
                      <HardHat size={28} className='mr-2' /> Project Type
                    </label>
                    <div className='mt-2 '>
                      <input
                        id='projectType'
                        {...register('projectType')}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                        placeholder='Bungalow'
                        value='Bungalow'
                        disabled
                      />
                      {errors.projectType?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.projectType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='sm:col-span-8'>
                    <label
                      htmlFor='prefUnits'
                      className='text-md  flex items-center font-medium leading-6 text-gray-900'
                    >
                      <PencilRuler size={28} className='mr-2' />
                      Units
                    </label>
                    <div className='mt-2'>
                      <input
                        id='prefUnits'
                        {...register('prefUnits')}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                        placeholder='m'
                        value='m'
                        disabled
                      />
                      {errors.prefUnits?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.prefUnits.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='sm:col-span-8'>
                    <label
                      htmlFor='startDate'
                      className='text-md  flex items-center font-medium leading-6 text-gray-900'
                    >
                      <CalendarPlus size={28} className='mr-2' />
                      Starting Date
                    </label>
                    <div className='mt-2'>
                      <input
                        id='startDate'
                        type='date'
                        {...register('startDate')}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                      />
                      {errors.startDate?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='sm:col-span-8'>
                    <label
                      htmlFor='typeOfWork'
                      className='text-md  flex items-center font-medium leading-6 text-gray-900'
                    >
                      <Hammer size={28} className='mr-2' />
                      Type of Work
                    </label>
                    <div className='mt-2'>
                      <select
                        id='typeOfWork'
                        {...register('typeOfWork')}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                      >
                        <option value='' disabled selected>
                          Select your option
                        </option>
                        <option value='Concrete Works'>Concrete</option>
                        <option value='Masonry Works'>CHB Laying</option>
                        <option value='Steel Works'>Steel Works</option>
                        <option value='Tile Works'>Tile</option>
                        <option value='Painting Works'>Painting</option>
                        <option value='Roof Works'>Roof</option>
                      </select>
                      {errors.typeOfWork?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.typeOfWork.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='sm:col-span-8'>
                    <label
                      htmlFor='estimationType'
                      className='text-md  flex items-center font-medium leading-6 text-gray-900'
                    >
                      <DraftingCompass size={28} className='mr-2' />
                      What kind of Estimation
                    </label>
                    <div className='mt-2'>
                      <select
                        id='estimationType'
                        {...register('estimationType')}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                      >
                        <option value='' disabled selected>
                          Select your option
                        </option>
                        <option value='Number of Labor'>Number of Labor</option>
                        <option value='Work Duration'>Work Duration</option>
                      </select>
                      {errors.estimationType?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.estimationType.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='relative row-start-1 mb-5 h-64 w-full sm:col-span-5 sm:col-start-6 sm:mx-10 sm:h-full'>
                <div className='absolute inset-0 rounded-2xl bg-stone-200 bg-opacity-10 shadow-lg backdrop-blur-sm'></div>
                <div className='justify-left relative z-10 flex h-full items-start p-4  '>
                  <Hammer size={36} className='mr-3' />
                  <h2 className='font-bold sm:text-xl'>{typeOfWorkImg()}</h2>
                </div>
                <Image
                  id='imgLg'
                  priority
                  fill
                  src={imgType}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  alt='Picture of the author'
                  className='rounded-xl  object-contain py-10 shadow-lg'
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='text-center'>
              <h2 className='text-2xl font-semibold leading-7 text-gray-900'>
                {typeOfWork}
              </h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Enter the necessary details for your estimation requirements.
              </p>
            </div>

            <div
              className={`mt-10 grid grid-cols-1 gap-y-8 ${estimationType === 'Work Duration' ? 'sm:grid-cols-10' : 'sm:grid-cols-4 '} sm:gap-x-6`}
            >
              {/* types */}
              {typeOfWork === 'Concrete Works' && (
                <div className=' sm:col-span-5'>
                  <label
                    htmlFor='structuralMembers'
                    className='block text-xl font-semibold leading-6 text-gray-900 sm:text-lg'
                  >
                    Structural Members
                  </label>
                  <div className='sm:col-span-5'>
                    <div className='relative mb-5 h-64 w-full'>
                      {/* Glassmorphism Effect */}
                      <div className='absolute inset-0 rounded-2xl bg-stone-200 bg-opacity-10 shadow-lg backdrop-blur-sm'></div>
                      <div className='relative h-full'>
                        <Image
                          priority
                          fill
                          src={imgTypeStep2}
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          alt='Picture of the author'
                          className='rounded-xl object-contain'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <select
                      id='structuralMembers'
                      {...register('structuralMembers')}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                    >
                      <option value='' disabled selected>
                        Select your option
                      </option>
                      <option value='Footing'>Footing</option>
                      <option value='Column'>Column</option>
                      <option value='Floor Slab'>Floor Slab</option>
                      <option value='Grade Beam'>Grade Beam</option>
                      <option value='Roof Beam'>Roof Beam</option>
                    </select>
                    {errors.structuralMembers?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.structuralMembers.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {typeOfWork === 'Painting Works' && (
                <div className=' sm:col-span-5'>
                  <label
                    htmlFor='wallType'
                    className='block text-xl font-semibold leading-6 text-gray-900 sm:text-lg'
                  >
                    Wall Type
                  </label>
                  <div className='sm:col-span-5'>
                    <div className='relative mb-5 h-64 w-full'>
                      {/* Glassmorphism Effect */}
                      <div className='absolute inset-0 rounded-2xl bg-stone-200 bg-opacity-10 shadow-lg backdrop-blur-sm'></div>
                      <div className='relative h-full'>
                        <Image
                          priority
                          fill
                          src={imgTypeStep2}
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          alt='Picture of the author'
                          className='rounded-xl object-contain'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <select
                      id='wallType'
                      {...register('wallType')}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                    >
                      <option value='' disabled selected>
                        Select your option
                      </option>
                      <option value='Exterior Wall'>Exterior Wall</option>
                      <option value='Interior Wall'>Interior Wall</option>
                      <option value='Both'>Both</option>
                    </select>
                    {errors.wallType?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.wallType.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {typeOfWork === 'Tile Works' && (
                <div className=' sm:col-span-5'>
                  <label
                    htmlFor='tileType'
                    className='block text-xl font-semibold leading-6 text-gray-900 sm:text-lg'
                  >
                    Tile Type
                  </label>
                  <div className='sm:col-span-5'>
                    <div className='relative mb-5 h-64 w-full'>
                      {/* Glassmorphism Effect */}
                      <div className='absolute inset-0 rounded-2xl bg-stone-200 bg-opacity-10 shadow-lg backdrop-blur-sm'></div>
                      <div className='relative h-full'>
                        <Image
                          priority
                          fill
                          src={imgTypeStep2}
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          alt='Picture of the author'
                          className='rounded-xl object-contain'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <select
                      id='tileType'
                      {...register('tileType')}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6'
                    >
                      <option value='' disabled selected>
                        Select your option
                      </option>
                      <option value='Floor Tile'>Floor Tile</option>
                      <option value='Wall Tile'>Wall Tile</option>
                    </select>
                    {errors.tileType?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.tileType.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* concrete Section */}
              {typeOfWork === 'Concrete Works' && (
                <div className='col-span-5 sm:col-span-5 sm:col-start-1'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-2'>
                      <label
                        htmlFor='width'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Width {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='width'
                          {...register('width', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.width?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.width.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='length'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Length {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='length'
                          {...register('length', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.length?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.length.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='depth'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Depth {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='depth'
                          {...register('depth', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.depth?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.depth.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='quantity'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Quantity {`(`}
                        Unit/s
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='quantity'
                          {...register('quantity', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.quantity?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='totalVolume'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Volume {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalVolume'
                          value={getTotalVolume()}
                          {...register('totalVolume', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalVolume?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalVolume.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Masonry Section */}
              {typeOfWork === 'Masonry Works' && (
                <div className='col-span-5 col-start-1 sm:col-span-5'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-2'>
                      <label
                        htmlFor='wallLength'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Wall Length {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='wallLength'
                          {...register('wallLength', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.wallLength?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.wallLength.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='wallHeight'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Wall Height {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='wallHeight'
                          {...register('wallHeight', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.wallHeight?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.wallHeight.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='areaOfWindow'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Area of Window {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='areaOfWindow'
                          {...register('areaOfWindow', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.areaOfWindow?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.areaOfWindow.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='areaOfDoor'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Area of Door {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='areaOfDoor'
                          {...register('areaOfDoor', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.areaOfDoor?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.areaOfDoor.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='totalWallArea'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Wall Area {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalWallArea'
                          value={getTotalVolume()}
                          {...register('totalWallArea', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalWallArea?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalWallArea.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='chbWidth'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        CHB Width {`(`}
                        in
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='chbWidth'
                          value={4}
                          disabled
                          {...register('chbWidth', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.chbWidth?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.chbWidth.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Painting Section */}
              {typeOfWork === 'Painting Works' && (
                <div className='col-span-5 sm:col-span-5 sm:col-start-1 '>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-2'>
                      <label
                        htmlFor='width'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Width {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='width'
                          {...register('width', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.width?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.width.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='height'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Height {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='height'
                          {...register('height', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.height?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.height.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='totalArea'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Area {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalArea'
                          value={getTotalVolume()}
                          {...register('totalArea', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalArea?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalArea.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Tile Works Section */}
              {typeOfWork === 'Tile Works' && (
                <div className='col-span-5 sm:col-span-5 sm:col-start-1'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-2'>
                      <label
                        htmlFor='width'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Width {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='widthTile'
                          {...register('widthTile', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.widthTile?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.widthTile.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='heightTile'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Height {`(`}
                        {getUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='heightTile'
                          {...register('heightTile', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.heightTile?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.heightTile.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='totalAreaTile'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Area {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalAreaTile'
                          value={getTotalVolume()}
                          {...register('totalAreaTile', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalAreaTile?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalAreaTile.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Steel works Section */}
              {typeOfWork === 'Steel Works' && (
                <div className='col-span-5 col-start-1 sm:col-span-5'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-4'>
                      <label
                        htmlFor='totalRebar'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Rebar {`(`}
                        Kgs.
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalRebar'
                          {...register('totalRebar', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalRebar?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalRebar.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Roofing works Section */}
              {typeOfWork === 'Roof Works' && (
                <div className='col-span-5 col-start-1 sm:col-span-5'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4'>
                    <div className='col-span-1 sm:col-span-4'>
                      <label
                        htmlFor='totalRoofArea'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Total Roof Area {`(`}
                        {getTotalUnits()}
                        {`)`}
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='totalRoofArea'
                          {...register('totalRoofArea', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.totalRoofArea?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.totalRoofArea.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manpower */}
              {estimationType === 'Work Duration' && (
                <div className='col-span-5 col-start-1 sm:col-span-5 sm:col-start-6 sm:row-start-1'>
                  <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-5'>
                    <div className='col-span-1 sm:col-span-5'>
                      <label
                        htmlFor='manpower'
                        className='block text-lg font-semibold leading-6 text-gray-900'
                      >
                        Manpower
                      </label>
                    </div>
                    <div className='sm:col-span-2' id='manpower'>
                      <label
                        htmlFor='special'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Foreman
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='special'
                          {...register('special', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.special?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.special.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='special2'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Skilled
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='special2'
                          {...register('special2', {
                            valueAsNumber: true
                          })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.special2?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.special2.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='labor'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Unskilled
                      </label>
                      <div className='mt-2'>
                        <input
                          type='number'
                          id='labor'
                          {...register('labor', { valueAsNumber: true })}
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.labor?.message && (
                          <p className='mt-2 text-sm text-red-400'>
                            {errors.labor.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='grid-child grid grid-cols-1 gap-x-6 sm:grid-cols-5 '>
                    <div className='mb-2 sm:col-span-5'>
                      <label
                        htmlFor='factorsCLP'
                        className='mt-10 block text-lg font-semibold leading-6 text-gray-900'
                      >
                        Factors of CLP {`(Check items if true/yes)`}
                      </label>
                    </div>
                    <div id='factorsCLP' className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='rainySeason'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Rainy season
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='rainySeason'
                            {...register('rainySeason')}
                            className={`form-check-input ${errors.rainySeason?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.rainySeason?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.rainySeason.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='lackOfMaterial'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Lack of required construction material
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='lackOfMaterial'
                            {...register('lackOfMaterial')}
                            className={`form-check-input ${errors.lackOfMaterial?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.lackOfMaterial?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.lackOfMaterial.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='lackOfLabor'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Lack of labor
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='lackOfLabor'
                            {...register('lackOfLabor')}
                            className={`form-check-input ${errors.lackOfLabor?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.lackOfLabor?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.lackOfLabor.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='lackOfWater'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Lack of experience and skills
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='lackOfWater'
                            {...register('lackOfWater')}
                            className={`form-check-input ${errors.lackOfWater?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.lackOfWater?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.lackOfWater.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='lackOfTools'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Lack of required tools and equipment
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='lackOfTools'
                            {...register('lackOfTools')}
                            className={`form-check-input ${errors.lackOfTools?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.lackOfTools?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.lackOfTools.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='flex w-full justify-between '>
                        <label
                          htmlFor='rework'
                          className='text-sm font-medium leading-6 text-gray-900'
                        >
                          Rework
                        </label>
                        <div className=''>
                          <input
                            type='checkbox'
                            id='rework'
                            {...register('rework')}
                            className={`form-check-input ${errors.rework?.message ? 'is-invalid' : ''}`}
                          />
                          {errors.rework?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                              {errors.rework.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Work Duration Section */}
            {estimationType === 'Number of Labor' && (
              <div className='col-span-5 col-start-1 mt-3 sm:col-span-5'>
                <div className='grid-child grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1'>
                  <div className='col-span-1 sm:col-span-2'>
                    <label
                      htmlFor='workDuration'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Work Duration
                    </label>
                    <div className='mt-2'>
                      <input
                        type='number'
                        id='workDuration'
                        {...register('workDuration', { valueAsNumber: true })}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                      />
                      {errors.workDuration?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                          {errors.workDuration.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold  leading-7 text-gray-900'>
                  Complete
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                  Thank you for your submission.
                </p>
              </div>
              <div
                onClick={() => resetButton()}
                className='flex h-[60px] w-[60px]  items-center justify-center rounded-full bg-white drop-shadow-md hover:bg-slate-100 hover:shadow-inner'
              >
                <RotateCcw size={32} />
              </div>
            </div>
            <div className='mt-10 grid gap-x-3 gap-y-8 rounded-sm border border-solid border-slate-300 bg-white p-5 sm:grid-cols-10'>
              <div className='col-span-4'>
                <div className='grid-child gap-y-3 sm:grid-cols-4'>
                  <div className='col-span-4'>
                    <h4 className='text-semibold my-2  text-center text-lg uppercase text-gray-900'>
                      {watch('projectType')}
                    </h4>
                    <div className='flex w-full flex-col items-center justify-center border-x-0 border-y-2 border-gray-950 py-2'>
                      <p className='pb-1 text-sm uppercase text-gray-600'></p>
                      {projecType === 'Bungalow' ? (
                        <Image
                          priority
                          src={'/img/bungalow.png'}
                          width={350}
                          height={350}
                          alt='Bungalow'
                        />
                      ) : (
                        <Image
                          priority
                          src={'/img/2storey.png'}
                          width={350}
                          height={350}
                          alt='Bungalow'
                        />
                      )}
                    </div>
                    <p className='text-semibold my-1 text-base uppercase text-gray-900'>
                      {watch('typeOfWork')}
                    </p>
                    <div className='gap-y-3 border-x-0 border-y-2 border-gray-950 py-2 '>
                      {typeOfWork === 'Concrete Works' && (
                        <h1 className='text-center text-base uppercase text-slate-600'>
                          {watch('structuralMembers')}
                        </h1>
                      )}
                      {typeOfWork === 'Painting Works' && (
                        <h1 className='text-center text-base uppercase text-slate-600'>
                          {watch('wallType')}
                        </h1>
                      )}
                      {typeOfWork === 'Tile Works' && (
                        <h1 className='text-center text-base uppercase text-slate-600'>
                          {watch('tileType')}
                        </h1>
                      )}
                      {typeOfWork === 'Concrete Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              WIDTH
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('width')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              LENGTH
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('length')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              depth
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('depth')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              quantity
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('quantity')} Unit/s`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total volume
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${getTotalVolume()} ${getTotalUnits()}`}
                            </p>
                          </div>
                        </>
                      )}
                      {typeOfWork === 'Painting Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              WIDTH
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('paintingWidth')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              height
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('height')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total area
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${getTotalVolume()} ${getTotalUnits()}`}
                            </p>
                          </div>
                        </>
                      )}
                      {typeOfWork === 'Tile Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              WIDTH
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('widthTile')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              height
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('heightTile')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total area
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${getTotalVolume()} ${getTotalUnits()}`}
                            </p>
                          </div>
                        </>
                      )}
                      {typeOfWork === 'Masonry Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              Wall length
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('wallLength')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              Wall height
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('width')} ${getUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              area of window
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('areaOfWindow')} ${getTotalUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              area of door
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('areaOfDoor')} ${getTotalUnits()}`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              CHB width
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('chbWidth')} in`}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total wall area
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${getTotalVolume()} ${getTotalUnits()}`}
                            </p>
                          </div>
                        </>
                      )}
                      {typeOfWork === 'Roof Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total roof area
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('totalRoofArea')} ${getTotalUnits()}`}
                            </p>
                          </div>
                        </>
                      )}
                      {typeOfWork === 'Steel Works' && (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm uppercase text-slate-600'>
                              total rebar
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {`${watch('totalRebar')} Kgs`}
                            </p>
                          </div>
                        </>
                      )}
                      {estimationType !== 'Work Duration' && (
                        <div className='flex items-center justify-between'>
                          <p className='text-sm uppercase text-slate-600'>
                            WORK DURATION
                          </p>
                          <p className='pr-4 text-sm text-slate-900'>
                            {watch('workDuration')} Days
                          </p>
                        </div>
                      )}
                      {estimationType !== 'Number of Labor' && (
                        <div>
                          <p className='text-sm uppercase text-slate-600'>
                            Number of labors
                          </p>
                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              Foreman
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {watch('special')}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              skilled
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {watch('special2')}
                            </p>
                          </div>

                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              unskilled
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {watch('labor')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className='text-semibold my-1 text-base uppercase text-gray-900'>
                      ESTIMATIONS
                    </p>
                    <div className='gap-y-3 border-x-0 border-t-2 border-gray-950 py-2 '>
                      {estimationType === 'Work Duration' && (
                        <div className='flex items-center justify-between'>
                          <p className='text-sm uppercase text-slate-600'>
                            WORK DURATION
                          </p>
                          <p className='pr-4 text-sm text-slate-900'>
                            {workDuration} Days
                          </p>
                        </div>
                      )}
                      {estimationType === 'Number of Labor' && (
                        <div>
                          <p className='text-sm uppercase text-slate-600'>
                            Number of labors
                          </p>
                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              Foreman
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {specialWorker}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              skilled
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {specialWorker2}
                            </p>
                          </div>

                          <div className='flex items-center justify-between'>
                            <p className='indent-4 text-sm uppercase text-slate-600'>
                              unskilled
                            </p>
                            <p className='pr-4 text-sm text-slate-900'>
                              {laborWorker}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-sm uppercase text-slate-600'>
                      starting date
                    </p>
                    <p className='text-sm uppercase text-slate-900'>
                      {getDate(watch('startDate'))}
                    </p>
                  </div>
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-sm uppercase text-slate-600'>
                      expected date
                    </p>
                    {estimationType !== 'Work Duration' ? (
                      <p className='text-sm uppercase text-slate-900'>
                        {getExpected(
                          watch('startDate'),
                          watch('workDuration')!
                        )}
                      </p>
                    ) : (
                      <p className='text-sm uppercase text-slate-900'>
                        {getExpected(watch('startDate'), workDuration)}
                      </p>
                    )}
                  </div>
                </div>
                <div className='relative h-64 w-full sm:h-full'>
                  {typeOfWork === 'Concrete Works' ||
                  typeOfWork === 'Painting Works' ||
                  typeOfWork === 'Tile Works' ? (
                    <Image
                      id='imgLg'
                      priority
                      fill
                      src={imgTypeStep2}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      alt='Picture of the author'
                      className='rounded-xl  object-contain py-10 '
                    />
                  ) : (
                    <Image
                      id='imgLg'
                      priority
                      fill
                      src={imgType}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      alt='Picture of the author'
                      className='rounded-xl  object-contain py-10 '
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Navigation */}
      <div className='pb-10'>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={prev}
            disabled={currentStep === 0}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5L8.25 12l7.5-7.5'
              />
            </svg>
          </button>
          <button
            type='button'
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
