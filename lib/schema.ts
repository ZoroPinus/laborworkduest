import { z } from 'zod'

export const EstimationFormSchema = z
  .object({
    projectType: z.string().min(1, 'Project Type Required'),
    prefUnits: z.string().min(1, 'Preferred Units Required'),
    startDate: z.preprocess(
      val => new Date(val as string),
      z.date({
        required_error: 'Starting date Required'
      })
    ),
    typeOfWork: z.string().min(1, 'Type of Work Required'),
    estimationType: z.string().min(1, 'Estimation Type Required'),

    // concrete section
    structuralMembers: z.string(),
    width: z.number().optional(),
    widthTile: z.number().optional(),
    length: z.number().optional(),
    depth: z.number().optional(),
    quantity: z.number().optional(),
    totalVolume: z.number().optional(),

    // masonry section
    wallLength: z.number().optional(),
    wallHeight: z.number().optional(),
    roofing: z.number().optional(),
    areaOfWindow: z.number().optional(),
    areaOfDoor: z.number().optional(),
    chbWidth: z.number().optional(),
    totalWallArea: z.number().optional(),

    // steel section
    totalRebar: z.number().optional(),

    // painting section
    wallType: z.string(),
    height: z.number().optional(),
    heightTile: z.number().optional(),
    paintingWidth: z.number().optional(),

    // roof secion
    totalRoofArea: z.number().optional(),

    // tile section
    tileType: z.string(),
    totalArea: z.number().optional(),
    totalAreaTile: z.number().optional(),

    // universal inputs
    special: z.number().optional(),
    special2: z.number().optional(),
    labor: z.number().optional(),
    //universal but shown if estimation type is workduration
    rainySeason: z.boolean().optional(),
    lackOfMaterial: z.boolean().optional(),
    lackOfLabor: z.boolean().optional(),
    lackOfWater: z.boolean().optional(),
    lackOfTools: z.boolean().optional(),
    workDuration: z.number().optional(),

    //universal but shown if estimation type is workduration
    totalWorkDuration: z.number().optional(),
    totalSpecial: z.number().optional(),
    totalSpecial2: z.number().optional(),
    totalLabor: z.number().optional()
  })
  .refine(
    data => {
      // Validate based on typeOfWork
      if (data.typeOfWork === 'Concrete Works') {
        return (
          data.width !== undefined &&
          data.length !== undefined &&
          data.depth !== undefined &&
          data.quantity !== undefined &&
          data.totalVolume !== undefined
        )
      }
      if (data.typeOfWork === 'Masonry Works') {
        return (
          data.wallLength !== undefined &&
          data.wallHeight !== undefined &&
          data.areaOfWindow !== undefined &&
          data.areaOfDoor !== undefined &&
          data.totalWallArea !== undefined &&
          data.chbWidth !== undefined
        )
      }

      if (data.typeOfWork === 'Steel Works') {
        return data.totalRebar !== undefined
      }

      if (data.typeOfWork === 'Roof Works') {
        return data.totalRoofArea !== undefined
      }
      if (data.typeOfWork === 'Painting Works') {
        return (
          data.width !== undefined &&
          data.height !== undefined &&
          data.totalArea !== undefined
        )
      }
      if (data.typeOfWork === 'Tile Works') {
        return (
          data.width !== undefined &&
          data.length !== undefined &&
          data.totalArea !== undefined
        )
      }

      return true // No issues for other types of work
    },
    {
      message:
        'Please provide all required fields for the selected type of work.',
      path: ['typeOfWork']
    }
  )
