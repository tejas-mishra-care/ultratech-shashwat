export interface CertificationLevel {
  name: string;
  minScore: number;
  color: string;
}

export interface CriterionOption {
  label: string;
  value: string;
  points: number;
}

export interface Criterion {
  id: string;
  name: string;
  type: "Mandatory" | "Credit";
  maxPoints: number;
  requirements: string;
  documents: string[];
  selectionType: "checkbox" | "dropdown" | "multiple-checkbox";
  options?: CriterionOption[];
  hasOtherOption?: boolean;
}

export interface StandardData {
  name: string;
  buildingType: string;
  maxScore: number;
  levels: CertificationLevel[];
  mandatoryCriteria: Criterion[];
  creditCriteria: Criterion[];
}

// NEST PLUS - New Building
export const nestPlusNewBuilding: StandardData = {
  name: "NEST PLUS",
  buildingType: "New",
  maxScore: 79,
  levels: [
    { name: "Certified", minScore: 40, color: "#059669" },
    { name: "Silver", minScore: 50, color: "#64748b" },
    { name: "Gold", minScore: 65, color: "#eab308" },
    { name: "Platinum", minScore: 75, color: "#6366f1" }
  ],
  mandatoryCriteria: [
    {
      id: "np-local-building-regulations",
      name: "Local Building Regulations",
      type: "Mandatory",
      maxPoints: 0,
      requirements: "Approved Plan from local municipal authority.",
      documents: ["Municipal approval document", "Building plan"],
      selectionType: "checkbox"
    },
    {
      id: "np-waste-segregation",
      name: "Waste Segregation - Dry & Wet",
      type: "Mandatory",
      maxPoints: 0,
      requirements: "Provide 2 separate bins to collect dry and wet waste.",
      documents: ["Photos of waste segregation bins"],
      selectionType: "checkbox"
    },
    {
      id: "np-rainwater-harvesting-500l",
      name: "Rainwater Harvesting 500 Liters",
      type: "Mandatory",
      maxPoints: 0,
      requirements: "Rainwater harvesting system to capture at least 500 litres from the entire site area runoff. Or Project can have rainwater harvesting pit to capture run-off from roof.",
      documents: ["Photos of rainwater harvesting system", "Technical drawings"],
      selectionType: "checkbox"
    }
  ],
  creditCriteria: [
    {
      id: "np-passive-architecture-features",
      name: "Passive Architecture Features",
      type: "Credit",
      maxPoints: 4,
      requirements: "Provide any two features mentioned below. For each feature two points (max 4 points for New): 1. Courtyard 2. Vernacular materials 3. Local Vernacular Elements 4. Climate responsive design 5. Natural ventilation",
      documents: ["Photos of passive architecture features", "Design drawings"],
      selectionType: "dropdown",
      options: [
        { label: "One Feature", value: "one", points: 2 },
        { label: "Two Features", value: "two", points: 4 }
      ]
    },
    {
      id: "np-top-soil-preservation",
      name: "Top soil Preservation",
      type: "Credit",
      maxPoints: 1,
      requirements: "Preserve top 150-200 mm soil during excavation.",
      documents: ["Photos of preserved topsoil", "Soil preservation certificate"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 1 }
      ]
    },
    {
      id: "np-passive-architecture-setbacks",
      name: "Passive Architecture (Setbacks)",
      type: "Credit",
      maxPoints: 2,
      requirements: "Provide minimum of 3 ft setback or as per local norms whichever is higher on 2 sides (1 point) or More than 2 sides (2 points)",
      documents: ["Site plan showing setbacks", "Photos of building setbacks"],
      selectionType: "dropdown",
      options: [
        { label: "2 sides", value: "two_sides", points: 1 },
        { label: "More than 2 sides", value: "more_than_two", points: 2 }
      ]
    },
    {
      id: "np-basic-amenities",
      name: "Basic Amenities",
      type: "Credit",
      maxPoints: 2,
      requirements: "Select 3 amenities for 1 point or 5 amenities for 2 points within a 1 km walk.",
      documents: ["Location map showing amenities", "Photos of nearby amenities"],
      selectionType: "multiple-checkbox",
      options: [
        { label: "School", value: "school", points: 0 },
        { label: "Hospital", value: "hospital", points: 0 },
        { label: "Bank", value: "bank", points: 0 },
        { label: "Post Office", value: "post_office", points: 0 },
        { label: "Market", value: "market", points: 0 },
        { label: "Public Transport", value: "transport", points: 0 },
        { label: "ATM", value: "atm", points: 0 },
        { label: "Pharmacy", value: "pharmacy", points: 0 },
        { label: "Police Station", value: "police", points: 0 },
        { label: "Fire Station", value: "fire", points: 0 },
        { label: "Community Center", value: "community", points: 0 },
        { label: "Park", value: "park", points: 0 },
        { label: "Library", value: "library", points: 0 },
        { label: "Grocery Store", value: "grocery", points: 0 },
        { label: "Gas Station", value: "gas", points: 0 }
      ]
    },
    {
      id: "np-vegetation-natural-topography",
      name: "Vegetation and Natural Topography",
      type: "Credit",
      maxPoints: 4,
      requirements: "Provide vegetation on Ground/built-up structures: 30 sq.ft (1 Pt), 50 sq.ft (2 Pts), 75 sq.ft (3 Pts), 100 sq.ft (4 Pts).",
      documents: ["Photos of vegetation", "Area calculation drawings"],
      selectionType: "dropdown",
      options: [
        { label: "30 sq.ft", value: "30", points: 1 },
        { label: "50 sq.ft", value: "50", points: 2 },
        { label: "75 sq.ft", value: "75", points: 3 },
        { label: "100 sq.ft", value: "100", points: 4 }
      ]
    },
    {
      id: "np-indoor-plants",
      name: "Indoor Plants - 5 Plants (Minimum)",
      type: "Credit",
      maxPoints: 1,
      requirements: "Grow a minimum of 5 indoor plants.",
      documents: ["Photos of indoor plants"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 1 }
      ]
    },
    {
      id: "np-e-vehicle",
      name: "E-Vehicle/Renewable fuel vehicle",
      type: "Credit",
      maxPoints: 1,
      requirements: "Use atleast one of the following vehicle type: E vehicle, CNG based, LPG based, or any other renewable fuel based vehicle.",
      documents: ["Vehicle registration certificate", "Photos of vehicle"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 1 }
      ]
    },
    {
      id: "np-water-saving-fixtures",
      name: "Water Saving Fixtures",
      type: "Credit",
      maxPoints: 8,
      requirements: "Provide efficient water fixtures: Dual flush cistern (3 pts), Tap with aerators (2 pts), Showers with aerators (2 pts), Health faucet with aerators (1 pt)",
      documents: ["Photos of water fixtures", "Product specifications"],
      selectionType: "multiple-checkbox",
      options: [
        { label: "Dual flush cistern", value: "dual_flush", points: 3 },
        { label: "Tap with aerators", value: "tap_aerators", points: 2 },
        { label: "Showers with aerators", value: "shower_aerators", points: 2 },
        { label: "Health faucet with aerators", value: "health_faucet", points: 1 }
      ]
    },
    {
      id: "np-renewable-energy",
      name: "Renewable Energy",
      type: "Credit",
      maxPoints: 5,
      requirements: "Install an on-site renewable solar energy system. 0.5 kW (1 pt), 1.5 kW (3 pts), 2.5 kW (5 pts).",
      documents: ["Solar system installation certificate", "Photos of solar panels"],
      selectionType: "dropdown",
      options: [
        { label: "0.5 kW", value: "0.5", points: 1 },
        { label: "1.5 kW", value: "1.5", points: 3 },
        { label: "2.5 kW", value: "2.5", points: 5 }
      ]
    },
    {
      id: "np-energy-efficient-appliances",
      name: "Energy Efficient Appliances",
      type: "Credit",
      maxPoints: 4,
      requirements: "Procure 100% BEE / Energy Certified appliances.",
      documents: ["BEE certificates", "Purchase receipts"],
      selectionType: "dropdown",
      options: [
        { label: "1 Credit", value: "1", points: 1 },
        { label: "2 Credits", value: "2", points: 2 },
        { label: "3 Credits", value: "3", points: 3 },
        { label: "4 Credits", value: "4", points: 4 }
      ]
    },
    {
      id: "np-daylighting",
      name: "Daylighting",
      type: "Credit",
      maxPoints: 4,
      requirements: "Ensure a minimum daylighting of 110 Lux during the daytime in 25% (1 pt), 50% (2 pts), 75% (3 pts), or 95% (4 pts) of occupied areas.",
      documents: ["Lux meter readings", "Photos showing daylight"],
      selectionType: "dropdown",
      options: [
        { label: "25% of areas", value: "25", points: 1 },
        { label: "50% of areas", value: "50", points: 2 },
        { label: "75% of areas", value: "75", points: 3 },
        { label: "95% of areas", value: "95", points: 4 }
      ]
    },
    {
      id: "np-house-automation",
      name: "House Automation",
      type: "Credit",
      maxPoints: 3,
      requirements: "Install automation devices (1 pt each, max 3).",
      documents: ["Photos of automation devices", "System specifications"],
      selectionType: "multiple-checkbox",
      hasOtherOption: true,
      options: [
        { label: "Lighting Controls", value: "lighting", points: 1 },
        { label: "CCTV", value: "cctv", points: 1 },
        { label: "Solar meter", value: "solar_meter", points: 1 },
        { label: "Sensors", value: "sensors", points: 1 },
        { label: "Others", value: "others", points: 1 }
      ]
    },
    {
      id: "np-innovation-exemplary",
      name: "Innovation & Exemplary",
      type: "Credit",
      maxPoints: 5,
      requirements: "Achieve innovative and exemplary performance in the green building categories.",
      documents: ["Innovation documentation", "Supporting evidence"],
      selectionType: "dropdown",
      options: [
        { label: "1 Credit", value: "1", points: 1 },
        { label: "2 Credits", value: "2", points: 2 },
        { label: "3 Credits", value: "3", points: 3 },
        { label: "4 Credits", value: "4", points: 4 },
        { label: "5 Credits", value: "5", points: 5 }
      ]
    }
  ]
};

// NEST PLUS - Existing Building
export const nestPlusExistingBuilding: StandardData = {
  name: "NEST PLUS",
  buildingType: "Existing",
  maxScore: 61,
  levels: [
    { name: "Certified", minScore: 35, color: "#059669" },
    { name: "Silver", minScore: 45, color: "#64748b" },
    { name: "Gold", minScore: 60, color: "#eab308" },
    { name: "Platinum", minScore: 70, color: "#6366f1" }
  ],
  mandatoryCriteria: nestPlusNewBuilding.mandatoryCriteria,
  creditCriteria: [
    {
      id: "np-passive-architecture-features",
      name: "Passive Architecture Features",
      type: "Credit",
      maxPoints: 2,
      requirements: "Provide any two features mentioned below. For each feature one point (max 2 points for Existing): 1. Courtyard 2. Vernacular materials 3. Local Vernacular Elements",
      documents: ["Photos of passive architecture features", "Design drawings"],
      selectionType: "dropdown",
      options: [
        { label: "One Feature", value: "one", points: 1 },
        { label: "Two Features", value: "two", points: 2 }
      ]
    },
    {
      id: "np-vegetables-fruits",
      name: "Vegetables / Fruits - 2 varieties",
      type: "Credit",
      maxPoints: 1,
      requirements: "Grow at least 2 varieties of vegetables or fruits.",
      documents: ["Photos of vegetable/fruit plants"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 1 }
      ]
    },
    {
      id: "np-medicinal-plants",
      name: "Medicinal Plants- 2 varieties",
      type: "Credit",
      maxPoints: 1,
      requirements: "Grow at least 2 varieties of medicinal plants.",
      documents: ["Photos of medicinal plants"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 1 }
      ]
    },
    // Include other applicable criteria from new building with modified points
    ...nestPlusNewBuilding.creditCriteria.filter(c => 
      !["np-passive-architecture-features", "np-top-soil-preservation", "np-best-practices-construction", "np-efficient-envelope", "np-local-materials"].includes(c.id)
    ).map(criterion => {
      if (criterion.id === "np-energy-efficient-appliances") {
        return {
          ...criterion,
          maxPoints: 10,
          options: Array.from({length: 10}, (_, i) => ({
            label: `${i + 1} Credit${i > 0 ? 's' : ''}`,
            value: (i + 1).toString(),
            points: i + 1
          }))
        };
      }
      if (criterion.id === "np-green-procurement") {
        return {
          ...criterion,
          maxPoints: 2,
          options: [
            { label: "1 Material", value: "1", points: 1 },
            { label: "2 Materials", value: "2", points: 2 }
          ]
        };
      }
      if (criterion.id === "np-house-automation") {
        return {
          ...criterion,
          maxPoints: 2
        };
      }
      if (criterion.id === "np-innovation-exemplary") {
        return {
          ...criterion,
          maxPoints: 3,
          options: [
            { label: "1 Credit", value: "1", points: 1 },
            { label: "2 Credits", value: "2", points: 2 },
            { label: "3 Credits", value: "3", points: 3 }
          ]
        };
      }
      return criterion;
    })
  ]
};

// NEST - New Building
export const nestNewBuilding: StandardData = {
  name: "NEST",
  buildingType: "New",
  maxScore: 45,
  levels: [
    { name: "Certified", minScore: 20, color: "#059669" },
    { name: "Silver", minScore: 35, color: "#64748b" },
    { name: "Gold", minScore: 40, color: "#eab308" },
    { name: "Platinum", minScore: 45, color: "#6366f1" }
  ],
  mandatoryCriteria: [
    {
      id: "n-local-building-regulations",
      name: "Local Building Regulations",
      type: "Mandatory",
      maxPoints: 0,
      requirements: "Approved Plan from local municipal authority.",
      documents: ["Municipal approval document", "Building plan"],
      selectionType: "checkbox"
    },
    {
      id: "n-waste-segregation",
      name: "Waste Segregation - Dry & Wet",
      type: "Mandatory",
      maxPoints: 0,
      requirements: "Provide 2 separate bins to collect dry and wet waste.",
      documents: ["Photos of waste segregation bins"],
      selectionType: "checkbox"
    }
  ],
  creditCriteria: [
    {
      id: "n-vegetation-or-indoor-plants",
      name: "Vegetation or Indoor Plants",
      type: "Credit",
      maxPoints: 4,
      requirements: "Vegetation 30 sq. ft, 50 sq. ft or Indoor Plant - 5 no., 10 no.",
      documents: ["Photos of vegetation or indoor plants"],
      selectionType: "dropdown",
      options: [
        { label: "Vegetation 30 sq.ft OR 5 Indoor Plants", value: "option1", points: 2 },
        { label: "Vegetation 50 sq.ft OR 10 Indoor Plants", value: "option2", points: 4 }
      ]
    },
    {
      id: "n-daylighting",
      name: "Daylighting",
      type: "Credit",
      maxPoints: 6,
      requirements: "Ensure daylight in occupied areas. 25% (2 pts), 50% (4 pts), 75% (6 pts).",
      documents: ["Lux meter readings", "Photos showing daylight"],
      selectionType: "dropdown",
      options: [
        { label: "25% of areas", value: "25", points: 2 },
        { label: "50% of areas", value: "50", points: 4 },
        { label: "75% of areas", value: "75", points: 6 }
      ]
    },
    {
      id: "n-energy-efficient-appliances",
      name: "Energy Efficient Appliances",
      type: "Credit",
      maxPoints: 5,
      requirements: "Procure BEE / Energy Certified appliances.",
      documents: ["BEE certificates", "Purchase receipts"],
      selectionType: "dropdown",
      options: [
        { label: "1 Credit", value: "1", points: 1 },
        { label: "2 Credits", value: "2", points: 2 },
        { label: "3 Credits", value: "3", points: 3 },
        { label: "4 Credits", value: "4", points: 4 },
        { label: "5 Credits", value: "5", points: 5 }
      ]
    }
  ]
};

// NEST - Existing Building  
export const nestExistingBuilding: StandardData = {
  name: "NEST",
  buildingType: "Existing",
  maxScore: 38,
  levels: [
    { name: "Certified", minScore: 20, color: "#059669" },
    { name: "Silver", minScore: 30, color: "#64748b" },
    { name: "Gold", minScore: 35, color: "#eab308" },
    { name: "Platinum", minScore: 40, color: "#6366f1" }
  ],
  mandatoryCriteria: nestNewBuilding.mandatoryCriteria,
  creditCriteria: [
    ...nestNewBuilding.creditCriteria.map(criterion => {
      if (criterion.id === "n-energy-efficient-appliances") {
        return {
          ...criterion,
          maxPoints: 7,
          options: Array.from({length: 7}, (_, i) => ({
            label: `${i + 1} Credit${i > 0 ? 's' : ''}`,
            value: (i + 1).toString(),
            points: i + 1
          }))
        };
      }
      return criterion;
    }),
    {
      id: "n-sunshades-chajjas",
      name: "Sunshades/ Chajjas",
      type: "Credit",
      maxPoints: 2,
      requirements: "All exterior openings shall have sun shades/ chajjas of minimum 400 MM.",
      documents: ["Photos of sunshades/chajjas"],
      selectionType: "checkbox",
      options: [
        { label: "Achieved", value: "achieved", points: 2 }
      ]
    }
  ]
};

export function getCertificationData(standard: string, buildingType: string): StandardData | null {
  const key = `${standard}_${buildingType}`;
  
  switch (key) {
    case "NEST_PLUS_New":
      return nestPlusNewBuilding;
    case "NEST_PLUS_Existing":
      return nestPlusExistingBuilding;
    case "NEST_New":
      return nestNewBuilding;
    case "NEST_Existing":
      return nestExistingBuilding;
    default:
      return null;
  }
}