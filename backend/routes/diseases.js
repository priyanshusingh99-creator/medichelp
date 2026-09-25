const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');

// Helper to titlecase string
const formatTitle = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Medical Intelligence Generator for Unseeded / New Conditions
const generateDynamicDossier = (query) => {
  const cleanName = formatTitle(query);
  const qLower = query.toLowerCase();

  let bodyRegion = 'General';
  if (/chest|lung|cough|breath|tb|tuberculosis|bronch|pneumo|asthma|heart|cardio/.test(qLower)) {
    bodyRegion = 'Chest';
  } else if (/head|brain|migraine|neuro|stroke|vertigo|mind|anxiety|skull/.test(qLower)) {
    bodyRegion = 'Head';
  } else if (/stomach|gut|gastr|ulcer|typhoid|cholera|bowel|liver|abdomen|acid|reflux/.test(qLower)) {
    bodyRegion = 'Abdomen';
  } else if (/knee|joint|eczema|skin|bone|limb|arthritis|foot|arm|leg|derma/.test(qLower)) {
    bodyRegion = 'Limbs';
  }

  let severity = 'Moderate';
  if (/tuberculosis|tb|cancer|stroke|infarction|malaria|hepatitis|sepsis|failure|critical|appendicitis|dengue/.test(qLower)) {
    severity = 'Critical';
  } else if (/mild|cold|eczema|sprain|strain/.test(qLower)) {
    severity = 'Mild';
  }

  // Plausible symptoms tailored to condition
  let symptoms = [];
  if (qLower.includes('tuberculosis') || qLower.includes('tb')) {
    symptoms = ['Persistent Cough (>3 Weeks)', 'Coughing up Blood (Hemoptysis)', 'Night Sweats', 'Unexplained Weight Loss', 'Low-Grade Fever', 'Chest Pain when Breathing'];
  } else if (qLower.includes('malaria')) {
    symptoms = ['Cyclical High Fever', 'Severe Shivering Chills', 'Profuse Sweating', 'Headache', 'Nausea & Vomiting', 'Muscle Pain'];
  } else if (qLower.includes('cholera')) {
    symptoms = ['Profuse Watery Diarrhea (Rice-Water Stools)', 'Rapid Dehydration', 'Severe Muscle Cramps', 'Low Blood Pressure', 'Excessive Thirst'];
  } else {
    symptoms = [
      `Localized ${cleanName} Pain / Discomfort`,
      `Fatigue and General Malaise`,
      `Mild Fever or Temperature Spikes`,
      `Inflammation in ${bodyRegion} Region`,
      `Disturbed Sleep Architecture`
    ];
  }

  // Long-term effects
  let longTermEffects = [];
  if (qLower.includes('tuberculosis') || qLower.includes('tb')) {
    longTermEffects = [
      'Permanent lung tissue cavitation and bronchial scarring',
      'Extrapulmonary TB spread to bones, kidneys, or meninges',
      'Chronic respiratory insufficiency and diminished vital capacity',
      'Secondary bacterial superinfections'
    ];
  } else {
    longTermEffects = [
      `Risk of chronic recurrence if ${cleanName} treatment is interrupted`,
      `Progressive tissue irritation in the ${bodyRegion} region`,
      `Secondary immune system fatigue`,
      `Impact on daily activity levels and physical stamina`
    ];
  }

  // Temporary First-Aid Solutions
  let temporarySolutions = [];
  if (qLower.includes('tuberculosis') || qLower.includes('tb')) {
    temporarySolutions = [
      'Isolate in a well-ventilated, sunlit room to minimize airborne transmission risks',
      'Wear an N95 respirator mask when in proximity to others',
      'Sip warm electrolyte fluids and maintain elevated head posture while resting',
      'Log daily temperature and monitor blood oxygen SpO2 levels'
    ];
  } else {
    temporarySolutions = [
      `Rest adequately in a comfortable, quiet environment`,
      `Maintain continuous hydration with electrolyte fluids or water`,
      `Apply targeted comfort care (warm or cool compress for ${bodyRegion} region)`,
      `Use over-the-counter pain or fever relief strictly per pharmacological guidance`
    ];
  }

  // Permanent Clinical Solutions
  let permanentSolutions = [];
  if (qLower.includes('tuberculosis') || qLower.includes('tb')) {
    permanentSolutions = [
      'Directly Observed Therapy Short-Course (DOTS) multi-antibiotic regimen (Rifampicin, Isoniazid, Pyrazinamide, Ethambutol)',
      'GeneXpert PCR diagnostic confirmation and drug-resistance screening',
      'Strict 6-month continuous antimicrobial therapy adherence'
    ];
  } else {
    permanentSolutions = [
      `Targeted clinical consultation with a physician or specialist`,
      `Prescription pharmacological therapy tailored to ${cleanName} etiology`,
      `Routine follow-up diagnostic bloodwork and organ function monitoring`,
      `Structured lifestyle and preventive hygiene protocol`
    ];
  }

  // Dietary recommendations
  const dietaryRecommendations = {
    foodsToEat: [
      'High-protein nutrient-dense foods (Eggs, Poultry, Legumes)',
      'Calorie-dense whole grains to maintain energy levels',
      'Vitamin C & Antioxidant-rich fresh fruits',
      'Electrolyte-rich hydration fluids'
    ],
    foodsToAvoid: [
      'Alcohol and tobacco exposure',
      'Highly processed, greasy, or fried foods',
      'Excessive refined sugars and artificial additives'
    ]
  };

  // Doctor questions
  const doctorQuestions = [
    `What diagnostic tests confirm the exact cause and stage of my ${cleanName}?`,
    `What is the expected timeline for symptom recovery with treatment?`,
    `Are there specific medication side effects or contraindications I should monitor?`,
    `What lifestyle modifications will prevent ${cleanName} recurrence?`
  ];

  return {
    name: cleanName,
    bodyRegion,
    severity,
    symptoms,
    longTermEffects,
    temporarySolutions,
    permanentSolutions,
    dietaryRecommendations,
    doctorQuestions
  };
};

// @route   GET /api/diseases/search?query=...
// @desc    Omni-search diseases by name or symptoms, with dynamic AI dossier auto-generation
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      const allDiseases = await Disease.find().limit(15);
      return res.status(200).json({ success: true, count: allDiseases.length, data: allDiseases });
    }

    const cleanQuery = query.trim();
    const regex = new RegExp(cleanQuery, 'i');
    
    let diseases = await Disease.find({
      $or: [
        { name: { $regex: regex } },
        { bodyRegion: { $regex: regex } },
        { symptoms: { $elemMatch: { $regex: regex } } },
        { temporarySolutions: { $elemMatch: { $regex: regex } } },
        { permanentSolutions: { $elemMatch: { $regex: regex } } }
      ]
    }).limit(20);

    let isAutoGenerated = false;

    // DYNAMIC FALLBACK: If 0 results, generate structured clinical dossier & persist to MongoDB!
    if (diseases.length === 0) {
      console.log(`No database entry found for "${cleanQuery}". Generating dynamic clinical dossier...`);
      const dynamicDossierData = generateDynamicDossier(cleanQuery);
      
      try {
        const createdDisease = await Disease.create(dynamicDossierData);
        diseases = [createdDisease];
      } catch (createErr) {
        diseases = [dynamicDossierData];
      }
      isAutoGenerated = true;
    }

    res.status(200).json({
      success: true,
      query: cleanQuery,
      count: diseases.length,
      isAutoGenerated,
      data: diseases
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Server error during disease search' });
  }
});

// @route   POST /api/diseases/symptom-checker
// @desc    Rank diseases by selected symptom match percentage
// @access  Public
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of symptoms'
      });
    }

    const normalizedInput = symptoms.map(s => s.toLowerCase().trim());
    const allDiseases = await Disease.find();

    const ranked = allDiseases.map(disease => {
      const diseaseSymptoms = disease.symptoms.map(s => s.toLowerCase().trim());
      
      let matchedCount = 0;
      const matchedSymptoms = [];

      normalizedInput.forEach(inputSym => {
        const found = diseaseSymptoms.some(ds => ds.includes(inputSym) || inputSym.includes(ds));
        if (found) {
          matchedCount++;
          matchedSymptoms.push(inputSym);
        }
      });

      const matchPercentage = Math.round((matchedCount / Math.max(normalizedInput.length, 1)) * 100);
      const conditionCoverage = Math.round((matchedCount / Math.max(diseaseSymptoms.length, 1)) * 100);
      const confidenceScore = Math.min(100, Math.round((matchPercentage * 0.7) + (conditionCoverage * 0.3)));

      return {
        disease,
        matchedCount,
        matchedSymptoms,
        matchPercentage,
        confidenceScore
      };
    })
    .filter(item => item.matchedCount > 0)
    .sort((a, b) => b.confidenceScore - a.confidenceScore);

    res.status(200).json({
      success: true,
      inputSymptoms: symptoms,
      count: ranked.length,
      data: ranked
    });
  } catch (err) {
    console.error('Symptom checker error:', err);
    res.status(500).json({ success: false, error: 'Server error during symptom evaluation' });
  }
});

// @route   GET /api/diseases/symptoms
// @desc    Get all unique available symptoms in database
// @access  Public
router.get('/symptoms', async (req, res) => {
  try {
    const diseases = await Disease.find({}, 'symptoms');
    const symptomSet = new Set();
    
    diseases.forEach(d => {
      if (d.symptoms && Array.isArray(d.symptoms)) {
        d.symptoms.forEach(s => symptomSet.add(s.trim()));
      }
    });

    const symptomsList = Array.from(symptomSet).sort();
    res.status(200).json({
      success: true,
      count: symptomsList.length,
      data: symptomsList
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error fetching symptoms list' });
  }
});

// @route   GET /api/diseases/:id
// @desc    Get full condition dossier by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ success: false, error: 'Condition not found' });
    }
    res.status(200).json({ success: true, data: disease });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Invalid condition ID or server error' });
  }
});

module.exports = router;
