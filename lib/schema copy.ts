import { z, ZodSchema } from 'zod';

// Define base schema for common fields
const baseSchema = z.object({
  projectType: z.string().min(1, "Project Type Required"),
  prefUnits: z.string().min(1, "Preferred Units Required"),
  startDate: z.preprocess((val) => new Date(val as string), z.date({
    required_error: "Starting date Required",
  })),
  typeOfWork: z.string().min(1, 'Type of Work Required'), 
  estimationType: z.string().min(1, 'Estimation Type Required'), 
});

// Define conditional schemas
const concreteSchema = z.object({
  width: z.number().optional(),
  length: z.number().optional(),
  depth: z.number().optional(),
  quantity: z.number().optional(),
  totalVolume: z.number().optional(),
});

const masonrySchema = z.object({
  wallLength: z.number().optional(),
  wallHeight: z.number().optional(),
  roofing: z.number().optional(),
  areaOfWindow: z.number().optional(),
  areaOfDoor: z.number().optional(),
  chbWidth: z.number().optional(),
  totalWallArea: z.number().optional(),
});

const steelSchema = z.object({
  totalRebar: z.number().optional(),
});

const paintingSchema = z.object({
  wallType: z.string(),
  height: z.number().optional(),
  paintingWidth: z.number().optional(),
});

const roofSchema = z.object({
  totalRoofArea: z.number().optional(),
});

const tileSchema = z.object({
  tileType: z.string(),
  totalArea: z.number().optional(),
});

const universalSchema = z.object({
  special: z.number().optional(),
  special2: z.number().optional(),
  labor: z.number().optional(),
  rainySeason: z.boolean().optional(),
  lackOfMaterial: z.boolean().optional(),
  lackOfLabor: z.boolean().optional(),
  lackOfWater: z.boolean().optional(),
  lackOfTools: z.boolean().optional(),
  workDuration: z.number().optional(),
  totalWorkDuration: z.number().optional(),
  totalSpecial: z.number().optional(),
  totalSpecial2: z.number().optional(),
  totalLabor: z.number().optional(),
});

// Define a type for typeOfWork
type TypeOfWork = 'Concrete Works' | 'Masonry Works' | 'Steel Works' | 'Painting Works' | 'Roof Works' | 'Tile Works';

// Create a function to dynamically build the schema based on current step and conditions
export const buildSchema = (typeOfWork: TypeOfWork): ZodSchema => {
  let conditionalSchema;

  switch (typeOfWork) {
    case 'Concrete Works':
      conditionalSchema = concreteSchema;
      break;
    case 'Masonry Works':
      conditionalSchema = masonrySchema;
      break;
    case 'Steel Works':
      conditionalSchema = steelSchema;
      break;
    case 'Painting Works':
      conditionalSchema = paintingSchema;
      break;
    case 'Roof Works':
      conditionalSchema = roofSchema;
      break;
    case 'Tile Works':
      conditionalSchema = tileSchema;
      break;
    default:
      conditionalSchema = z.object({});
  }

  return baseSchema.merge(conditionalSchema).merge(universalSchema);
};
