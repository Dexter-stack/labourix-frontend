// Keyword-based lookup so it works regardless of exact API trade name casing/punctuation
const TRADE_SKILL_MAP: { keywords: string[]; skills: string[] }[] = [
  {
    keywords: ['electrician', 'electrical'],
    skills: ['Electrical Wiring', 'Cable Management', 'Conduit Installation', 'Fault Diagnosis', '18th Edition', 'Testing & Inspection', 'EV Charger Installation', 'Solar Panel Installation', 'Fire Alarm Systems'],
  },
  {
    keywords: ['plumber', 'plumbing'],
    skills: ['Pipe Fitting', 'Central Heating', 'Boiler Installation', 'Bathroom Fitting', 'Drainage', 'Gas Pipework', 'Underfloor Heating', 'Pressure Testing'],
  },
  {
    keywords: ['carpenter', 'joiner', 'joinery'],
    skills: ['First Fix', 'Second Fix', 'Formwork', 'Shuttering', 'Door Hanging', 'Staircase Fitting', 'Roof Carpentry', 'Decking'],
  },
  {
    keywords: ['bricklayer', 'brickie'],
    skills: ['Brickwork', 'Blockwork', 'Brick Cutting', 'Cavity Wall Construction', 'Tuckpointing', 'Retaining Walls', 'Restoration Masonry'],
  },
  {
    keywords: ['roofer', 'roofing'],
    skills: ['Flat Roofing', 'Pitched Roofing', 'Felt & Batten', 'Lead Flashing', 'Guttering', 'Fascias & Soffits', 'Slate Tiling', 'EPDM'],
  },
  {
    keywords: ['hvac', 'heating', 'ventilation', 'air con'],
    skills: ['HVAC Installation', 'Air Conditioning', 'Ductwork', 'Refrigeration', 'Heat Pumps', 'BMS', 'Commissioning', 'F-Gas'],
  },
  {
    keywords: ['scaffolder', 'scaffolding'],
    skills: ['Tube & Fitting', 'System Scaffolding', 'Load Calculations', 'Risk Assessment', 'Scaffold Inspection', 'PASMA', 'IPAF'],
  },
  {
    keywords: ['painter', 'decorator', 'decorating'],
    skills: ['Painting', 'Decorating', 'Wallpapering', 'Spray Painting', 'Wood Staining', 'Exterior Rendering', 'Surface Preparation'],
  },
  {
    keywords: ['plasterer', 'plastering'],
    skills: ['Skimming', 'Rendering', 'Dry Lining', 'Coving', 'SBR Bonding', 'Insulated Render', 'Stucco'],
  },
  {
    keywords: ['general labour', 'labourer', 'general labor'],
    skills: ['Manual Handling', 'Site Clearance', 'Groundwork', 'Concrete Mixing', 'Trenching', 'CSCS', 'Health & Safety'],
  },
  {
    keywords: ['welder', 'welding'],
    skills: ['MIG Welding', 'TIG Welding', 'Arc Welding', 'Pipe Welding', 'Structural Welding', 'Coded Welding', 'Aluminium Welding'],
  },
  {
    keywords: ['pipefitter', 'pipe fit'],
    skills: ['Pipe Fitting', 'Pipe Welding', 'Hydraulics', 'Pressure Testing', 'Isometric Reading', 'Flange Fitting', 'Valve Maintenance'],
  },
  {
    keywords: ['tiler', 'tiling'],
    skills: ['Floor Tiling', 'Wall Tiling', 'Mosaic', 'Waterproofing', 'Tile Cutting', 'Grouting', 'Levelling Systems'],
  },
  {
    keywords: ['glazier', 'glass'],
    skills: ['Glass Fitting', 'Double Glazing', 'Curtain Walling', 'Structural Glazing', 'Safety Glass', 'Frameless Glazing'],
  },
  {
    keywords: ['steelworker', 'steel erector', 'ironworker'],
    skills: ['Structural Steel', 'Steel Erection', 'Bolting', 'Plating', 'Ironwork', 'Reading Drawings', 'Rigging'],
  },
]

const FALLBACK_SKILLS = ['Health & Safety', 'CSCS Card', 'Manual Handling', 'Risk Assessment', 'Inspection']

export function getSkillsForTrade(tradeName: string): string[] {
  if (!tradeName) return FALLBACK_SKILLS
  const lower = tradeName.toLowerCase()
  const match = TRADE_SKILL_MAP.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  )
  return match?.skills ?? FALLBACK_SKILLS
}
