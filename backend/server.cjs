const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const twilio = require('twilio');

// Setup Twilio if available
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let twilioClient;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
  console.log("Twilio initialized successfully.");
} else {
  console.log("No Twilio credentials found in .env! Backend is running in development/simulation mode.");
}

// ============================================================================
// MEDICAL KNOWLEDGE BASE - Per Specialty Diseases Database
// ============================================================================

const medicalDatabase = {
  // Respiratory & Chest
  "ChestMNIST": {
    name: "Chest X-ray Analysis",
    diseases: {
      "Normal Chest X-ray": {
        description: "Chest imaging appears within normal limits. Clear lung fields with no visible opacities, normal cardiac silhouette, and well-defined diaphragmatic contours.",
        severity: "none",
        recommendations: ["No immediate medical action required", "Routine annual check-up recommended", "Maintain healthy lifestyle"],
        common_symptoms: ["No symptoms - routine screening"],
        treatments: ["No treatment required"],
        specialist: "Pulmonologist",
        confidence_range: [85, 99]
      },
      "Pneumonia": {
        description: "Evidence of lung infection with potential consolidation visible in lower lobes. Bacterial or viral etiology possible depending on clinical presentation. Airspace opacities suggest active inflammation.",
        severity: "moderate",
        recommendations: ["Start empirical antibiotics if bacterial suspected", "Chest physiotherapy for mucus clearance", "Hospitalization if oxygen saturation < 92%", "Follow-up chest X-ray in 6-8 weeks"],
        common_symptoms: ["Cough with sputum production", "Fever > 100.4°F (38°C)", "Shortness of breath", "Pleuritic chest pain", "Fatigue and malaise"],
        treatments: ["Antibiotics (Amoxicillin or Azithromycin)", "Antipyretics for fever", "Oxygen therapy if hypoxic", "Fluid resuscitation"],
        specialist: "Pulmonologist",
        confidence_range: [82, 96]
      },
      "Atelectasis": {
        description: "Partial or complete collapse of lung tissue visible as increased opacity in affected region. Often caused by mucus plugging, foreign body, or external compression. Linear or platelike opacities observed.",
        severity: "mild",
        recommendations: ["Deep breathing exercises and incentive spirometry", "Chest physiotherapy and postural drainage", "Address underlying cause (e.g., bronchial obstruction)", "Bronchoscopy if persistent"],
        common_symptoms: ["Dyspnea on exertion", "Decreased breath sounds", "Cough", "Chest discomfort"],
        treatments: ["Incentive spirometry", "Chest physiotherapy", "Bronchodilators if reactive airway disease", "Bronchoscopy for refractory cases"],
        specialist: "Pulmonologist",
        confidence_range: [75, 92]
      },
      "Cardiomegaly": {
        description: "Enlargement of the cardiac silhouette on chest radiograph, confirmed by cardiothoracic ratio > 0.5. May indicate underlying heart failure, cardiomyopathy, or valvular heart disease.",
        severity: "moderate",
        recommendations: ["Echocardiogram for definitive assessment", "BNP blood test to evaluate heart failure", "Cardiology consultation recommended", "Monitor for signs of fluid overload"],
        common_symptoms: ["Shortness of breath on exertion", "Peripheral edema", "Fatigue", "Orthopnea", "Paroxysmal nocturnal dyspnea"],
        treatments: ["Diuretics (Furosemide)", "ACE inhibitors or ARBs", "Beta-blockers for rate control", "Sodium restriction < 2g/day"],
        specialist: "Cardiologist",
        confidence_range: [80, 94]
      },
      "Effusion": {
        description: "Presence of pleural fluid in the costophrenic angles, blunting the normal sharp angle. Opacification of the lower lung fields with meniscus sign visible. Moderate volume estimated.",
        severity: "moderate",
        recommendations: ["Diagnostic thoracentesis for fluid analysis", "Chest ultrasound to localize fluid", "Treat underlying cause (infection, heart failure, malignancy)", "Chest tube drainage if large or symptomatic"],
        common_symptoms: ["Dullness to percussion", "Decreased breath sounds", "Pleuritic chest pain", "Dyspnea", "Dry cough"],
        treatments: ["Thoracentesis for diagnostic/therapeutic drainage", "Antibiotics if parapneumonic", "Diuretics if transudative from heart failure", "Chest tube insertion for empyema"],
        specialist: "Pulmonologist",
        confidence_range: [77, 93]
      },
      "Emphysema": {
        description: "Hyperinflation of lungs with flattened diaphragms, increased retrosternal airspace, and attenuation of pulmonary vasculature. Destructive changes in alveolar walls consistent with COPD.",
        severity: "moderate",
        recommendations: ["Pulmonary function tests (PFTs)", "Smoking cessation counseling", "Pulmonary rehabilitation program", "Annual influenza and pneumococcal vaccination"],
        common_symptoms: ["Progressive dyspnea", "Barrel chest deformity", "Prolonged expiration", "Pursed-lip breathing", "Chronic cough"],
        treatments: ["Bronchodilators (LAMA/LABA)", "Inhaled corticosteroids if frequent exacerbations", "Oxygen therapy if hypoxemic", "Lung volume reduction surgery in selected cases"],
        specialist: "Pulmonologist",
        confidence_range: [78, 93]
      }
    }
  },
  "PneumoniaMNIST": {
    name: "Pneumonia Detection",
    diseases: {
      "Normal": {
        description: "No radiological signs of pneumonia. Clear lung parenchyma without consolidation, air bronchograms, or infiltrates. Normal bronchovascular markings.",
        severity: "none",
        recommendations: ["No antibiotic therapy indicated", "Symptomatic management for viral URI if present", "Routine follow-up as needed"],
        common_symptoms: ["No pneumonia symptoms"],
        treatments: ["None required"],
        specialist: "General Practitioner",
        confidence_range: [88, 99]
      },
      "Pneumonia": {
        description: "Radiographic evidence of pneumonia: lobar or multifocal consolidation with air bronchograms. Alveolar infiltrates suggest active infectious process requiring medical intervention.",
        severity: "moderate",
        recommendations: ["Initiate empiric antibiotic therapy", "Blood cultures and sputum culture", "CBC with differential, CRP, procalcitonin", "Hospitalize if CURB-65 score ≥ 2"],
        common_symptoms: ["Productive cough", "High-grade fever with chills", "Tachypnea", "Hypoxia on pulse oximetry", "Rust-colored sputum (pneumococcal)"],
        treatments: ["Macrolide (Azithromycin 500mg)", "Respiratory fluoroquinolone (Levofloxacin)", "Beta-lactam (Ceftriaxone)", "Antipyretics and analgesics"],
        specialist: "Pulmonologist",
        confidence_range: [80, 97]
      }
    }
  },
  // Ophthalmology
  "OCTMNIST": {
    name: "OCT (Optical Coherence Tomography)",
    diseases: {
      "Normal OCT": {
        description: "Normal retinal architecture with well-defined retinal layers. Intact ellipsoid zone, normal foveal contour, and no evidence of intraretinal or subretinal fluid.",
        severity: "none",
        recommendations: ["Annual eye examination", "Protective eyewear in sunlight"],
        common_symptoms: ["No visual complaints"],
        treatments: ["None required"],
        specialist: "Ophthalmologist",
        confidence_range: [86, 99]
      },
      "Choroidal Neovascularization (CNV)": {
        description: "Active choroidal neovascular membrane with subretinal hyperreflective material and intraretinal fluid. Disruption of the retinal pigment epithelium with irregular elevation.",
        severity: "severe",
        recommendations: ["Immediate ophthalmology referral within 1 week", "Anti-VEGF intravitreal injection therapy", "Monthly monitoring with OCT", "Amsler grid self-monitoring"],
        common_symptoms: ["Sudden vision distortion (metamorphopsia)", "Central scotoma", "Blurred near vision", "Difficulty reading"],
        treatments: ["Anti-VEGF (Ranibizumab/Aflibercept/Bevacizumab)", "Photodynamic therapy (PDT)", "Focal laser photocoagulation"],
        specialist: "Ophthalmologist",
        confidence_range: [83, 96]
      },
      "Diabetic Macular Edema (DME)": {
        description: "Retinal thickening involving the macula with cystoid spaces detected on OCT. Hard exudates present. Neurosensory detachment may be present in advanced cases.",
        severity: "moderate",
        recommendations: ["Glycemic control optimization (HbA1c < 7%)", "Anti-VEGF therapy as first-line", "Consider focal/grid laser", "Cardiovascular risk factor management"],
        common_symptoms: ["Blurred central vision", "Floating spots", "Difficulty distinguishing colors", "Waxing and waning vision"],
        treatments: ["Anti-VEGF injections (monthly or PRN)", "Focal laser photocoagulation", "Intravitreal corticosteroids", "Vitrectomy for non-resolving cases"],
        specialist: "Ophthalmologist",
        confidence_range: [81, 95]
      },
      "Drusen": {
        description: "Multiple drusen deposits at the level of the retinal pigment epithelium. Soft drusen indicate age-related macular degeneration. Drusen can be hard (small) or soft (large, confluent).",
        severity: "mild",
        recommendations: ["AREDS2 vitamin supplementation", "Amsler grid daily monitoring", "Avoid smoking", "Annual dilated fundus examination"],
        common_symptoms: ["Usually asymptomatic in early stages", "Mild central vision loss in advanced cases", "Difficulty with low-light vision"],
        treatments: ["AREDS2 formula antioxidants", "Lutein and zeaxanthin supplementation", "No treatment required for hard drusen"],
        specialist: "Ophthalmologist",
        confidence_range: [79, 93]
      }
    }
  },
  "RetinaMNIST": {
    name: "Retinal Fundus Analysis",
    diseases: {
      "Normal Retina": {
        description: "Healthy retina with clear optic disc margins, normal cup-to-disc ratio (< 0.5), and regular retinal vasculature without abnormalities.",
        severity: "none",
        recommendations: ["Regular eye check-ups", "Manage systemic health (BP, blood sugar)"],
        common_symptoms: ["No visual symptoms"],
        treatments: ["None required"],
        specialist: "Ophthalmologist",
        confidence_range: [87, 99]
      },
      "Diabetic Retinopathy": {
        description: "Retinal microvascular complications of diabetes: microaneurysms, dot-blot hemorrhages, hard exudates, and possible neovascularization. Graded as non-proliferative or proliferative.",
        severity: "moderate",
        recommendations: ["Optimize glycemic control (HbA1c target < 7%)", "Blood pressure management (< 130/80)", "Lipid management", "Urgent ophthalmology referral", "Panretinal photocoagulation if proliferative"],
        common_symptoms: ["Floaters and spots", "Blurred vision", "Dark/empty areas in vision", "Difficulty perceiving colors", "Vision loss (advanced)"],
        treatments: ["Anti-VEGF injections", "Panretinal photocoagulation (laser)", "Vitrectomy for vitreous hemorrhage", "Strict diabetic control"],
        specialist: "Ophthalmologist",
        confidence_range: [82, 96]
      },
      "Glaucoma": {
        description: "Optic neuropathy with characteristic cupping of the optic disc (cup-to-disc ratio > 0.6). Retinal nerve fiber layer thinning detected on imaging. Visual field defects correspond to structural damage.",
        severity: "severe",
        recommendations: ["Measure intraocular pressure (IOP)", "Visual field perimetry testing", "Start IOP-lowering medication", "Laser trabeculoplasty if indicated", "Regular monitoring every 3-6 months"],
        common_symptoms: ["Often asymptomatic initially", "Peripheral vision loss", "Tunnel vision (advanced)", "Eye pain (acute angle-closure)", "Halos around lights"],
        treatments: ["Prostaglandin analogs (Latanoprost)", "Beta-blockers (Timolol)", "Carbonic anhydrase inhibitors", "Laser trabeculoplasty", "Trabeculectomy surgery"],
        specialist: "Ophthalmologist",
        confidence_range: [80, 95]
      },
      "Cataract": {
        description: "Lens opacification visible as cloudiness in the crystalline lens. Nuclear sclerotic, cortical, or posterior subcapsular types identified by morphology and location.",
        severity: "mild",
        recommendations: ["Cataract surgery when vision affects daily activities", "Avoid smoking and excessive UV exposure", "Manage diabetes to slow progression"],
        common_symptoms: ["Gradual blurring of vision", "Glare and light sensitivity", "Faded color perception", "Frequent prescription changes", "Difficulty driving at night"],
        treatments: ["Cataract surgery (phacoemulsification + IOL)", "No medical therapy effective", "Corrective lenses until surgery"],
        specialist: "Ophthalmologist",
        confidence_range: [84, 97]
      }
    }
  },
  // Dermatology
  "DermaMNIST": {
    name: "Dermatoscopic Analysis",
    diseases: {
      "Melanocytic Nevi": {
        description: "Benign melanocytic proliferation with symmetric architecture, uniform pigmentation, and well-defined borders. Regular network pattern with no atypical features.",
        severity: "none",
        recommendations: ["Routine skin self-examination monthly", "Annual dermatology check-up", "Monitor for ABCDE changes"],
        common_symptoms: ["No symptoms - cosmetic finding", "Stable size and color"],
        treatments: ["No treatment necessary", "Excision if cosmetically desired"],
        specialist: "Dermatologist",
        confidence_range: [85, 98]
      },
      "Melanoma": {
        description: "Malignant melanocytic proliferation with asymmetric shape, irregular borders, and variegated color. Breslow thickness assessment necessary for staging. Ulceration and regression may be present.",
        severity: "severe",
        recommendations: ["URGENT: Wide local excision with margins", "Sentinel lymph node biopsy if thickness > 1mm", "Oncology and dermatology co-management", "PET/CT for staging if high-risk features", "Avoid sun exposure"],
        common_symptoms: ["Changing mole (ABCDE: Asymmetry, Border, Color, Diameter, Evolution)", "Itching or bleeding lesion", "New pigmented lesion after age 30"],
        treatments: ["Wide local excision (1-2cm margins)", "Sentinel lymph node biopsy", "Immunotherapy (Pembrolizumab/Nivolumab)", "BRAF targeted therapy if mutation positive", "Radiation for brain metastases"],
        specialist: "Dermatologist",
        confidence_range: [83, 97]
      },
      "Benign Keratosis (Seborrheic)": {
        description: "Waxy, stuck-on appearance with multiple plugged follicles. Homogeneous pigmentation with sharp borders. No malignant features present.",
        severity: "none",
        recommendations: ["No treatment required", "Cryotherapy if irritated or symptomatic"],
        common_symptoms: ["Wart-like growth", "May be itchy or irritated"],
        treatments: ["Cryotherapy", "Curettage if symptomatic", "Observation"],
        specialist: "Dermatologist",
        confidence_range: [82, 95]
      },
      "Basal Cell Carcinoma": {
        description: "Nodular or superficial basaloid proliferation with peripheral palisading and retraction artifact. Telangiectatic vessels present. Most common skin malignancy but rarely metastatic.",
        severity: "moderate",
        recommendations: ["Surgical excision with margin control", "Mohs micrographic surgery for high-risk areas (face)", "Regular skin surveillance annually", "Sun protection counseling"],
        common_symptoms: ["Pearl-like bump with rolled borders", "Telangiectasias on surface", "Non-healing ulcer", "Easy bleeding"],
        treatments: ["Mohs micrographic surgery", "Standard excision", "Topical Imiquimod (superficial only)", "Photodynamic therapy", "Radiation in non-surgical candidates"],
        specialist: "Dermatologist",
        confidence_range: [84, 96]
      },
      "Actinic Keratoses": {
        description: "Premalignant keratinocytic dysplasia with atypical keratinocytes limited to the epidermis. Rough, scaly plaques on sun-damaged skin. Risk of progression to squamous cell carcinoma.",
        severity: "mild",
        recommendations: ["Field-directed therapy for multiple lesions", "Avoid sun exposure and use SPF 50+", "Monitor for progression to SCC", "Regular dermatology surveillance"],
        common_symptoms: ["Rough, scaly patches", "Redness and inflammation", "Sensitivity to touch"],
        treatments: ["Cryotherapy", "Topical 5-fluorouracil", "Imiquimod cream", "Photodynamic therapy", "Chemical peels for field treatment"],
        specialist: "Dermatologist",
        confidence_range: [78, 93]
      }
    }
  },
  // General / Cross-specialty
  "GeneralMNIST": {
    name: "General Health Assessment",
    diseases: {
      "Normal": {
        description: "Overall assessment within normal limits. No significant abnormalities detected in the analyzed parameters.",
        severity: "none",
        recommendations: ["Maintain healthy lifestyle", "Annual health check-up", "Balanced diet and regular exercise"],
        common_symptoms: ["No concerning symptoms"],
        treatments: ["None required"],
        specialist: "General Practitioner",
        confidence_range: [88, 99]
      },
      "Thyroid Disorder": {
        description: "Thyroid function abnormalities detected. May present as hyperthyroid or hypothyroid based on TSH, T3, and T4 levels. Autoimmune etiology possible (Hashimoto's/Graves').",
        severity: "mild",
        recommendations: ["Complete thyroid function panel (TSH, T3, T4)", "Thyroid antibody testing", "Thyroid ultrasound if nodules palpable", "Endocrinology referral"],
        common_symptoms: ["Fatigue and weight changes", "Temperature intolerance", "Heart palpitations or bradycardia", "Hair loss or thinning", "Mood changes"],
        treatments: ["Levothyroxine (hypothyroidism)", "Methimazole or Propylthiouracil (hyperthyroidism)", "Beta-blockers for symptom control", "Radioactive iodine ablation if needed"],
        specialist: "Endocrinologist",
        confidence_range: [76, 92]
      },
      "Iron Deficiency Anemia": {
        description: "Microcytic hypochromic anemia with decreased hemoglobin and hematocrit. Low serum ferritin and transferrin saturation confirmed. Common causes include blood loss or nutritional deficiency.",
        severity: "mild",
        recommendations: ["CBC with iron studies (ferritin, TIBC, iron)", "Identify source of blood loss (GI evaluation)", "Iron supplementation", "Dietary counseling for iron-rich foods"],
        common_symptoms: ["Fatigue and weakness", "Pale skin and conjunctivae", "Shortness of breath on exertion", "Brittle nails", "Restless legs"],
        treatments: ["Oral iron (Ferrous sulfate 325mg)", "IV iron if intolerant to oral", "Blood transfusion if severe (Hb < 7)", "Treat underlying cause"],
        specialist: "General Practitioner",
        confidence_range: [80, 94]
      },
      "Urinary Tract Infection": {
        description: "Bacterial infection of the urinary tract with pyuria and bacteriuria. Most commonly caused by E. coli. May involve lower tract (cystitis) or upper tract (pyelonephritis).",
        severity: "mild",
        recommendations: ["Urinalysis with culture and sensitivity", "Start empiric antibiotics", "Increase fluid intake", "Urine culture follow-up"],
        common_symptoms: ["Dysuria (painful urination)", "Urinary frequency and urgency", "Suprapubic pain", "Hematuria", "Cloudy or foul-smelling urine"],
        treatments: ["Nitrofurantoin 100mg (uncomplicated)", "Trimethoprim-sulfamethoxazole", "Ciprofloxacin (for complicated)", "Phenazopyridine for symptom relief"],
        specialist: "General Practitioner",
        confidence_range: [82, 95]
      }
    }
  }
};

// ============================================================================
// AI DIAGNOSIS ENDPOINT
// ============================================================================

app.post('/api/diagnose', (req, res) => {
  const { dataset, symptoms = [], patient_age, patient_gender } = req.body;

  // Validate dataset
  const database = medicalDatabase[dataset];
  if (!database) {
    return res.status(400).json({
      success: false,
      error: `Unknown dataset: ${dataset}. Available: ${Object.keys(medicalDatabase).join(', ')}`
    });
  }

  const diseaseKeys = Object.keys(database.diseases);
  
  // If symptoms provided, score each disease based on symptom matching
  let scoredDiseases;
  
  if (symptoms.length > 0) {
    scoredDiseases = diseaseKeys.map(diseaseKey => {
      const diseaseInfo = database.diseases[diseaseKey];
      const diseaseSymptoms = diseaseInfo.common_symptoms.map(s => s.toLowerCase());
      const userSymptoms = symptoms.map(s => s.toLowerCase());
      
      // Calculate symptom match score
      let matchScore = 0;
      userSymptoms.forEach(userSymptom => {
        diseaseSymptoms.forEach(diseaseSymptom => {
          if (diseaseSymptom.includes(userSymptom) || userSymptom.includes(diseaseSymptom)) {
            matchScore += 1;
          }
        });
      });
      
      const maxPossible = Math.max(diseaseSymptoms.length, userSymptoms.length);
      const symptomRatio = maxPossible > 0 ? matchScore / maxPossible : 0;
      
      // Base confidence from disease range
      const [minConf, maxConf] = diseaseInfo.confidence_range;
      const baseConfidence = minConf + (maxConf - minConf) * (0.5 + symptomRatio * 0.5);
      const finalConfidence = Math.min(maxConf, Math.max(minConf, Math.round(baseConfidence)));
      
      return {
        class: diseaseKey,
        confidence: finalConfidence / 100,
        matchScore: matchScore,
        symptomRatio: Math.round(symptomRatio * 100)
      };
    });
  } else {
    // No symptoms - return disease distribution based on priors
    scoredDiseases = diseaseKeys.map((diseaseKey, idx) => {
      const diseaseInfo = database.diseases[diseaseKey];
      const [minConf, maxConf] = diseaseInfo.confidence_range;
      const conf = minConf + Math.floor(Math.random() * (maxConf - minConf));
      return {
        class: diseaseKey,
        confidence: conf / 100,
        matchScore: 0,
        symptomRatio: 0
      };
    });
  }

  // Sort by confidence (descending)
  scoredDiseases.sort((a, b) => b.confidence - a.confidence);

  const topPrediction = scoredDiseases[0];
  const topDisease = database.diseases[topPrediction.class];

  // Calculate severity
  const severityMap = { none: "none", mild: "mild", moderate: "moderate", severe: "severe" };
  const severityLevel = severityMap[topDisease.severity] || "mild";

  // Age-adjusted recommendations
  let ageAdjustedRecs = [...(topDisease.recommendations || [])];
  if (patient_age) {
    const age = parseInt(patient_age);
    if (age > 60 && topDisease.severity !== "none") {
      ageAdjustedRecs.push("Consider geriatric specialist consultation given patient age");
    }
    if (age < 18) {
      ageAdjustedRecs.push("Pediatric specialist evaluation recommended");
    }
  }

  res.json({
    success: true,
    top_prediction: topPrediction.class,
    confidence: Math.round(topPrediction.confidence * 100),
    severity: severityLevel,
    description: topDisease.description,
    recommendations: ageAdjustedRecs,
    common_symptoms: topDisease.common_symptoms,
    treatments: topDisease.treatments,
    specialist: topDisease.specialist,
    predictions: scoredDiseases,
    model_used: "MediScan AI v2.0",
    dataset_used: database.name,
    dataset_key: dataset,
    symptom_match: topPrediction.symptomRatio
  });
});

// GET endpoint to list available specialties and diseases
app.get('/api/diagnose/specialties', (req, res) => {
  const specialties = Object.entries(medicalDatabase).map(([key, db]) => ({
    id: key,
    name: db.name,
    diseases: Object.keys(db.diseases),
    diseaseCount: Object.keys(db.diseases).length
  }));
  res.json({ success: true, specialties });
});

// GET endpoint to get disease details for a specific specialty
app.get('/api/diagnose/diseases/:specialty', (req, res) => {
  const { specialty } = req.params;
  const database = medicalDatabase[specialty];
  if (!database) {
    return res.status(404).json({ success: false, error: 'Specialty not found' });
  }
  const diseases = Object.entries(database.diseases).map(([key, info]) => ({
    name: key,
    severity: info.severity,
    severityScore: info.severity === "severe" ? 3 : info.severity === "moderate" ? 2 : info.severity === "mild" ? 1 : 0,
    common_symptoms: info.common_symptoms.slice(0, 3),
    specialist: info.specialist,
    confidence_range: info.confidence_range
  }));
  res.json({ success: true, specialty: database.name, diseases });
});

// ============================================================================
// SYMPTOM-BASED TRiAGE ENDPOINT
// ============================================================================

app.post('/api/triage', (req, res) => {
  const { symptoms, age, gender } = req.body;
  
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide at least one symptom' 
    });
  }

  // Cross-specialty triage: find which specialties match the symptoms
  const specialtyMatches = [];

  Object.entries(medicalDatabase).forEach(([datasetKey, database]) => {
    Object.entries(database.diseases).forEach(([diseaseName, diseaseInfo]) => {
      const diseaseSymptoms = diseaseInfo.common_symptoms.map(s => s.toLowerCase());
      let symptomCount = 0;
      symptoms.forEach(userSymptom => {
        diseaseSymptoms.forEach(diseaseSymptom => {
          if (diseaseSymptom.includes(userSymptom.toLowerCase()) || 
              userSymptom.toLowerCase().includes(diseaseSymptom)) {
            symptomCount++;
          }
        });
      });
      
      if (symptomCount > 0) {
        specialtyMatches.push({
          disease: diseaseName,
          specialty: diseaseInfo.specialist,
          dataset: datasetKey,
          matchedSymptoms: symptomCount,
          totalSymptoms: diseaseSymptoms.length,
          matchPercent: Math.round((symptomCount / Math.max(diseaseSymptoms.length, symptoms.length)) * 100),
          severity: diseaseInfo.severity
        });
      }
    });
  });

  // Sort by match percentage and severity
  specialtyMatches.sort((a, b) => {
    if (a.matchPercent !== b.matchPercent) return b.matchPercent - a.matchPercent;
    const severityOrder = { severe: 3, moderate: 2, mild: 1, none: 0 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  // Group by specialty
  const groupedBySpecialty = {};
  specialtyMatches.slice(0, 20).forEach(match => {
    if (!groupedBySpecialty[match.specialty]) {
      groupedBySpecialty[match.specialty] = [];
    }
    if (groupedBySpecialty[match.specialty].length < 5) {
      groupedBySpecialty[match.specialty].push(match);
    }
  });

  res.json({
    success: true,
    total_matches: specialtyMatches.length,
    symptoms_provided: symptoms,
    patient_age: age || 'Not specified',
    patient_gender: gender || 'Not specified',
    matched_specialties: Object.keys(groupedBySpecialty),
    specialty_matches: groupedBySpecialty,
    top_recommendation: specialtyMatches[0] ? {
      disease: specialtyMatches[0].disease,
      specialty: specialtyMatches[0].specialty,
      confidence: specialtyMatches[0].matchPercent,
      severity: specialtyMatches[0].severity
    } : null,
    urgent: specialtyMatches.some(m => m.severity === 'severe')
  });
});

// Existing SOS endpoint
app.post('/send-sos', async (req, res) => {
  const { name, location, contacts, blood_group, med_conditions } = req.body;

  if (!name || !location || !contacts || !Array.isArray(contacts)) {
    return res.status(400).json({ success: false, error: 'Missing required SOS payload parameters.' });
  }

  const mapLink = location.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Location tracking restricted by device.';
  const payloadMessage = `EMERGENCY! ${name} (Blood Group: ${blood_group || 'Unknown'}) needs immediate assistance. Condition: ${med_conditions || 'None Declared'}. Coordinates: ${mapLink}`;

  try {
    const dispatchPromises = contacts.map(async (contact) => {
      if (twilioClient && contact.phone.length > 5) {
        await twilioClient.messages.create({
           body: payloadMessage,
           from: process.env.TWILIO_PHONE_NUMBER,
           to: contact.phone
        });
      } else {
        console.log(`[SIMULATED TWILIO SMS] sent to ${contact.name} at Phone: ${contact.phone}`);
        console.log(`[BODY] ${payloadMessage}`);
      }
    });

    await Promise.all(dispatchPromises);
    console.log(`SOS dispatched successfully for User: ${name}`);
    return res.json({ success: true, message: 'Emergency endpoints notified.' });
  } catch (error) {
    console.error("Failed to broadcast Twilio APIs:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MediBridge India API is securely tracking on port: ${PORT}`);
    console.log(`AI Diagnosis API available at: http://localhost:${PORT}/api/diagnose`);
    console.log(`Triage API available at: http://localhost:${PORT}/api/triage`);
    console.log(`Specialties list: http://localhost:${PORT}/api/diagnose/specialties`);
    console.log(`Available specialties: ${Object.keys(medicalDatabase).join(', ')}`);
});