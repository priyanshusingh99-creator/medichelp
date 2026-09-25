const mongoose = require('mongoose');
const Disease = require('./models/Disease');

const initialDiseases = [
  {
    name: 'Viral Fever',
    bodyRegion: 'General',
    severity: 'Mild',
    symptoms: ['High Fever', 'Body Aches', 'Fatigue', 'Headache', 'Chills', 'Sore Throat', 'Loss of Appetite'],
    longTermEffects: [
      'Post-viral fatigue syndrome',
      'Temporary immune system suppression',
      'Dehydration-related electrolyte imbalances'
    ],
    temporarySolutions: [
      'Rest adequately and avoid physical exertion',
      'Take antipyretics (e.g., Paracetamol / Acetaminophen 650mg) to control fever spikes',
      'Sip warm electrolyte fluids, coconut water, or herbal teas to stay hydrated',
      'Use cool wet cloth forehead compresses to reduce body temperature'
    ],
    permanentSolutions: [
      'Symptomatic supportive care until viral cycle resolves (typically 3-7 days)',
      'Routine annual influenza vaccination',
      'Proper hand hygiene and immune-supportive sleep hygiene'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Warm vegetable broths', 'Boiled lentils & rice (Khichdi)', 'Bananas & Citrus fruits (Vitamin C)', 'Coconut water'],
      foodsToAvoid: ['Heavy oily or fried foods', 'Cold sugary ice creams', 'Caffeinated beverages', 'Raw unwashed salads']
    },
    doctorQuestions: [
      'Is my fever viral or does it require diagnostic blood tests to rule out bacterial infection?',
      'At what temperature threshold should I seek urgent emergency evaluation?',
      'What fever-reducing medication interval is safest for my liver?'
    ]
  },
  {
    name: 'Dengue Fever',
    bodyRegion: 'General',
    severity: 'Critical',
    symptoms: ['Sudden High Fever', 'Severe Retro-Orbital Eye Pain', 'Joint & Muscle Pain (Breakbone Fever)', 'Skin Rash', 'Nausea', 'Bleeding Gums'],
    longTermEffects: [
      'Dengue Hemorrhagic Fever (DHF) & Dengue Shock Syndrome (DSS)',
      'Severe thrombocytopenia (critical drop in blood platelet count)',
      'Internal plasma leakage and organ dysfunction'
    ],
    temporarySolutions: [
      'Take Paracetamol only for fever relief (STRICTLY AVOID Aspirin or Ibuprofen as they increase bleeding risks!)',
      'Maintain rigorous oral hydration with oral rehydration salts (ORS)',
      'Complete physical bed rest in mosquito-netted environment'
    ],
    permanentSolutions: [
      'Immediate hospital admission for intravenous fluid replacement if platelets drop below 100,000/µL',
      'Daily Complete Blood Count (CBC) monitoring',
      'Mosquito vector control and protective nets'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Papaya leaf extract juice', 'Pomegranate & Fresh Kiwi', 'ORS electrolyte solution', 'Soft easy-to-digest foods'],
      foodsToAvoid: ['NSAIDs & Blood thinners', 'Dark red or black foods (may mask GI bleeding)', 'Spicy or acidic meals']
    },
    doctorQuestions: [
      'What is my current blood platelet count and hematocrit percentage?',
      'Do I exhibit any warning signs of Dengue Hemorrhagic Fever?',
      'How frequently should my complete blood count be re-tested?'
    ]
  },
  {
    name: 'Typhoid Fever',
    bodyRegion: 'Abdomen',
    severity: 'Critical',
    symptoms: ['Sustained High Fever (Step-Ladder Pattern)', 'Abdominal Pain & Rose Spots Rash', 'Extreme Weakness', 'Constipation or Diarrhea', 'Headache'],
    longTermEffects: [
      'Intestinal perforation or severe gastrointestinal hemorrhage',
      'Chronic gallbladder carrier state (Salmonella typhi retention)',
      'Myocarditis and toxic encephalopathy'
    ],
    temporarySolutions: [
      'Administer targeted oral antibiotics (Ciprofloxacin or Azithromycin) strictly as prescribed',
      'Consume high-calorie soft fluid diets',
      'Maintain continuous fever logging and hydration'
    ],
    permanentSolutions: [
      'Complete 10-14 day full course of intravenous or oral antibiotic therapy',
      'Typhoid Vi capsular polysaccharide vaccine administration',
      'Strict food and drinking water sanitation standards'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Boiled potatoes and soft rice', 'Clear vegetable broths', 'Pasteurized yogurt & buttermilk', 'Boiled safe drinking water'],
      foodsToAvoid: ['Raw unpasteurized dairy', 'Street food and unpeeled raw fruits', 'High-fiber raw vegetables', 'Spicy chili dishes']
    },
    doctorQuestions: [
      'Is my Widal test or Typhidot test positive for Salmonella typhi?',
      'Which antibiotic protocol is most effective against local resistant strains?',
      'How many stool cultures are needed post-treatment to confirm I am not a carrier?'
    ]
  },
  {
    name: 'Migraine with Aura',
    bodyRegion: 'Head',
    severity: 'Moderate',
    symptoms: ['Throbbing Headache', 'Nausea', 'Sensitivity to Light', 'Visual Distortions (Aura)', 'Dizziness', 'Neck Stiffness'],
    longTermEffects: [
      'Increased risk of chronic daily headaches',
      'Cognitive fatigue and sleep disruption',
      'Persistent sensory hypersensitivity'
    ],
    temporarySolutions: [
      'Rest immediately in a dark, quiet, cool room',
      'Apply a cold gel compress across forehead and temples',
      'Sip 500ml of cold electrolyte water to address dehydration triggers',
      'Take over-the-counter NSAIDs or prescribed Triptans early at aura onset'
    ],
    permanentSolutions: [
      'Preventative daily prescription therapy (Beta-blockers, Topiramate, or CGRP Inhibitors)',
      'Regular biofeedback and relaxation protocols',
      'Strict sleep schedule hygiene (7-8 hours fixed schedule)'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Magnesium-rich foods (Spinach, Almonds)', 'Omega-3 Fatty Acids (Salmon, Flaxseed)', 'Ginger Tea'],
      foodsToAvoid: ['Aged Cheeses', 'Red Wine', 'Processed Meats with Nitrates', 'Excessive Caffeine']
    },
    doctorQuestions: [
      'Am I a candidate for prophylactic CGRP monoclonal antibody treatments?',
      'What rescue medication strategy is safest to avoid medication-overuse headaches?'
    ]
  },
  {
    name: 'Type 2 Diabetes Mellitus',
    bodyRegion: 'General',
    severity: 'Critical',
    symptoms: ['Excessive Thirst (Polydipsia)', 'Frequent Urination (Polyuria)', 'Unexplained Fatigue', 'Blurry Vision', 'Slow-Healing Sores'],
    longTermEffects: [
      'Diabetic Peripheral Neuropathy (nerve damage)',
      'Diabetic Nephropathy and kidney disease',
      'Diabetic Retinopathy and vision loss',
      'Cardiovascular disease'
    ],
    temporarySolutions: [
      'Perform instant capillary blood glucose test',
      'Drink plain water to help flush excess blood glucose',
      'Engage in a light 15-minute walk after meals'
    ],
    permanentSolutions: [
      'Pharmacological management (Metformin, SGLT2 inhibitors, GLP-1 receptor agonists)',
      'Low Glycemic Index (GI) dietary protocol',
      'Structured weight reduction program'
    ],
    dietaryRecommendations: {
      foodsToEat: ['High-fiber legumes', 'Non-starchy vegetables (Broccoli, Spinach)', 'Lean proteins'],
      foodsToAvoid: ['Sugary Beverages & Soda', 'Refined White Bread', 'High Fructose Corn Syrup']
    },
    doctorQuestions: [
      'What is my latest HbA1c target, and how frequently should we test it?',
      'When should I schedule my annual dilated eye exam and podiatry nerve assessment?'
    ]
  },
  {
    name: 'Acute Gastritis & Acid Reflux (GERD)',
    bodyRegion: 'Abdomen',
    severity: 'Moderate',
    symptoms: ['Burning Epigastric Pain', 'Heartburn', 'Acid Regurgitation', 'Nausea after Meals', 'Abdominal Bloating'],
    longTermEffects: [
      'Esophageal mucosal ulceration and stricture',
      'Barrett’s Esophagus',
      'Gastric mucosal atrophy'
    ],
    temporarySolutions: [
      'Sip a glass of lukewarm water or sodium bicarbonate solution',
      'Remain upright for at least 2 hours after eating (do not lie flat)',
      'Take Famotidine or Omeprazole antacids'
    ],
    permanentSolutions: [
      'Proton Pump Inhibitor (PPI) standard course',
      'Helicobacter pylori eradication therapy if positive',
      'Small, frequent meals (4-5 per day)'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Oatmeal & Whole Grains', 'Non-citrus fruits (Bananas, Melons)', 'Steamed Lean Poultry'],
      foodsToAvoid: ['Spicy Peppers & Chili Oil', 'Citrus Fruits & Tomatoes', 'Coffee & Soda']
    },
    doctorQuestions: [
      'Do I require an Upper Endoscopy (EGD) to evaluate for inflammation or H. pylori?',
      'Is long-term PPI therapy safe for my bone density?'
    ]
  },
  {
    name: 'Bronchial Asthma',
    bodyRegion: 'Chest',
    severity: 'Moderate',
    symptoms: ['Wheezing', 'Shortness of Breath', 'Persistent Dry Cough', 'Chest Tightness'],
    longTermEffects: [
      'Airway remodeling and loss of lung capacity',
      'Frequent respiratory infections'
    ],
    temporarySolutions: [
      'Sit upright immediately; do not lie down',
      'Administer 2-4 puffs of Albuterol rescue inhaler',
      'Maintain calm diaphragmatic breathing'
    ],
    permanentSolutions: [
      'Daily inhaled corticosteroid (ICS) controller inhaler',
      'Peak Flow Meter monitoring at home',
      'Written Asthma Action Plan'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Antioxidant-rich berries', 'Vitamin D foods', 'Warm herbal infusions'],
      foodsToAvoid: ['Sulfite-containing dried fruits', 'Known personal food allergens']
    },
    doctorQuestions: [
      'Is my current controller inhaler keeping my asthma well-controlled?',
      'What steps should I take if my rescue inhaler fails to relieve symptoms within 15 minutes?'
    ]
  },
  {
    name: 'Hypertension (High Blood Pressure)',
    bodyRegion: 'Chest',
    severity: 'Critical',
    symptoms: ['Silent/Asymptomatic', 'Morning Headaches', 'Shortness of Breath', 'Chest Pressure', 'Blurred Vision'],
    longTermEffects: [
      'Coronary Artery Disease & Heart Attack',
      'Ischemic or Hemorrhagic Stroke',
      'Chronic Kidney Disease'
    ],
    temporarySolutions: [
      'Sit comfortably and practice slow deep breathing',
      'Avoid sudden physical exertion, sodium, and caffeine',
      'Check blood pressure with cuff monitor'
    ],
    permanentSolutions: [
      'Daily antihypertensive medication (Lisinopril, ARBs, Calcium channel blockers)',
      'DASH Diet adherence (<1,500mg sodium daily)',
      'Regular aerobic exercise'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Potassium-rich foods (Bananas, Sweet Potatoes)', 'Leafy Greens', 'Beetroot Juice'],
      foodsToAvoid: ['High-Sodium Processed Foods', 'Pickles & Salt-Cured Meats', 'Energy Drinks']
    },
    doctorQuestions: [
      'What is my target blood pressure baseline?',
      'Are my current medications affecting my serum electrolyte balance?'
    ]
  },
  {
    name: 'Community-Acquired Pneumonia',
    bodyRegion: 'Chest',
    severity: 'Critical',
    symptoms: ['Productive Cough with Greenish Sputum', 'High Fever & Shivering Chills', 'Pleuritic Chest Pain', 'Fatigue'],
    longTermEffects: [
      'Pleural effusion and empyema',
      'Permanent lung scarring',
      'Acute Respiratory Distress Syndrome'
    ],
    temporarySolutions: [
      'Rest in an elevated semi-Fowler position',
      'Use steam humidifier to mobilize mucus',
      'Monitor blood oxygen level SpO2'
    ],
    permanentSolutions: [
      'Targeted antibiotic regimen (Amoxicillin-clavulanate, Azithromycin)',
      'Incentive Spirometry daily breathing exercises',
      'Pneumococcal vaccine administration'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Warm chicken soup with garlic', 'Electrolyte hydration fluids', 'Citrus fruits'],
      foodsToAvoid: ['Cold sugary beverages', 'Alcohol & Tobacco smoke']
    },
    doctorQuestions: [
      'Is my pneumonia bacterial or viral in origin?',
      'What is my baseline oxygenation level?'
    ]
  },
  {
    name: 'Osteoarthritis of the Knee',
    bodyRegion: 'Limbs',
    severity: 'Mild',
    symptoms: ['Joint Stiffness after Inactivity', 'Deep Aching Joint Pain', 'Crepitus (Grinding Sensation)', 'Joint Swelling'],
    longTermEffects: [
      'Progressive articular cartilage breakdown',
      'Joint deformity and limb alignment changes',
      'Chronic mobility impairment'
    ],
    temporarySolutions: [
      'Apply R.I.C.E protocol (Rest, Ice, Compression, Elevation)',
      'Apply topical NSAID gel (Diclofenac)',
      'Use supportive knee brace'
    ],
    permanentSolutions: [
      'Physical therapy strengthening quadriceps',
      'Intra-articular Corticosteroid or Hyaluronic Acid injections',
      'Total Knee Arthroplasty if end-stage'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Turmeric & Curcumin', 'Bone broth', 'Walnuts & Chia seeds'],
      foodsToAvoid: ['Refined sugars', 'Fried foods', 'Trans fats']
    },
    doctorQuestions: [
      'What grade of joint space narrowing is visible on X-rays?',
      'What low-impact exercise is best for my knees?'
    ]
  },
  {
    name: 'Atopic Dermatitis (Eczema)',
    bodyRegion: 'Limbs',
    severity: 'Mild',
    symptoms: ['Intense Pruritus (Itching)', 'Dry Scaly Red Patches', 'Lichenification', 'Small Raised Bumps'],
    longTermEffects: [
      'Secondary bacterial skin infections',
      'Post-inflammatory hyperpigmentation',
      'Sleep disruption'
    ],
    temporarySolutions: [
      'Apply fragrance-free ceramide ointment',
      'Apply cool wet cotton compresses',
      'Take short colloidal oatmeal bath'
    ],
    permanentSolutions: [
      'Topical Corticosteroids or Tacrolimus',
      'Daily fragrance-free emollient regimen',
      'Avoid harsh detergents and synthetic dyes'
    ],
    dietaryRecommendations: {
      foodsToEat: ['Omega-3 fish oil', 'Probiotic foods', 'Hydration fluids'],
      foodsToAvoid: ['Artificial food additives & preservatives']
    },
    doctorQuestions: [
      'Is my eczema flare driven by contact allergens or internal triggers?',
      'What topical steroid schedule is safest for my skin?'
    ]
  }
];

const autoSeedIfEmpty = async () => {
  try {
    const count = await Disease.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Executing automatic startup auto-seed...');
      await Disease.insertMany(initialDiseases);
      console.log(`Auto-seeded ${initialDiseases.length} condition dossiers into MongoDB!`);
    } else {
      console.log(`Database auto-seed check: ${count} conditions already exist.`);
    }
  } catch (err) {
    console.error('Error during auto-seed check:', err.message);
  }
};

// Standalone execution support
if (require.main === module) {
  const connectDB = require('./config/db');
  connectDB().then(async () => {
    await Disease.deleteMany();
    await Disease.insertMany(initialDiseases);
    console.log('Manual database seed complete.');
    process.exit(0);
  });
}

module.exports = { initialDiseases, autoSeedIfEmpty };
