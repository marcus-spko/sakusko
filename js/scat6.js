// SCAT6 (Sport Concussion Assessment Tool 6) — teks instrumen kata per kata dari PDF resmi BJSM 2023;57(11):622-31.
// Isian identitas (nama, tanggal lahir, nomor ID, pemeriksa, tanda tangan) sengaja tidak disertakan: SakuSKO tidak menyimpan identitas.
// Reformat digital memerlukan izin tertulis BMJ; dibangun atas keputusan dr. Marcus sambil izin diurus.

export const SCAT6 = {
  title: 'Sport Concussion Assessment Tool 6 (SCAT6)',
  sub: 'For Adolescents (13 years +) & Adults',
  hcp: 'For use by Health Care Professionals Only',
  what: [
    'The SCAT6 is a standardised tool for evaluating concussions designed for use by Health Care Professionals (HCPs). The SCAT6 cannot be performed correctly in less than 10-15 minutes.',
    'Except for the symptoms scale, the SCAT6 is intended to be used in the acute phase, ideally within 72 hours (3 days), and up to 7 days, following injury. If greater than 7 days post-injury, consider using the SCOAT6/Child SCOAT6.',
    'The SCAT6 is used for evaluating athletes aged 13 years and older. For children aged 12 years or younger, please use the Child SCAT6.',
    'If you are not an HCP, please use the Concussion Recognition Tool 6 (CRT6).',
    'Preseason baseline testing with the SCAT6 can be helpful for interpreting post-injury test scores but is not required for that purpose. Detailed instructions for use of the SCAT6 are provided as a supplement. Please read through these instructions carefully before testing the athlete. Brief verbal instructions for each test are given in blue italics. The only equipment required for the examiner is athletic tape and a watch or timer.',
  ],
  copyright: 'This tool may be freely copied in its current form for distribution to individuals, teams, groups, and organizations. Any alteration (including translations and digital re-formatting), re-branding, or sale for commercial gain is not permissible without the expressed written consent of BMJ.',
  recognise: 'A head impact by either a direct blow or indirect transmission of force to the head can be associated with serious and potentially fatal consequences. If there are significant concerns, which may include any of the Red Flags listed in Box 1, the athlete requires urgent medical attention, and if a qualified medical practitioner is not available for immediate assessment, then activation of emergency procedures and urgent transport to the nearest hospital or medical facility should be arranged.',
  keyPoints: [
    'Any athlete with suspected concussion should be REMOVED FROM PLAY, medically assessed, and monitored for injury-related signs and symptoms, including deterioration of their clinical condition.',
    'No athlete diagnosed with concussion should return to play on the day of injury.',
    'If an athlete is suspected of having a concussion and medical personnel are not immediately available, the athlete should be referred (or transported if needed) to a medical facility for assessment.',
    'Athletes with suspected or diagnosed concussion should not take medications such as aspirin or other anti-inflammatories, sedatives or opiates, drink alcohol or use recreational drugs and should not drive a motor vehicle until cleared to do so by a medical professional.',
    'Concussion signs and symptoms may evolve over time; it is important to monitor the athlete for ongoing, worsening, or the development of additional concussion-related symptoms.',
    'The diagnosis of concussion is a clinical determination made by an HCP.',
    'The SCAT6 should NOT be used by itself to make, or exclude, the diagnosis of concussion. It is important to note that an athlete may have a concussion even if their SCAT6 assessment is within normal limits.',
  ],
  remember: [
    'The basic principles of first aid should be followed: assess danger at the scene, athlete responsiveness, airway, breathing, and circulation.',
    'Do not attempt to move an unconscious/unresponsive athlete (other than what is required for airway management) unless trained to do so.',
    'Assessment for a spinal and/or spinal cord injury is a critical part of the initial on-field evaluation. Do not attempt to assess the spine unless trained to do so.',
    'Do not remove a helmet or any other equipment unless trained to do so safely.',
  ],
  history: {
    head: 'Concussion History',
    items: [['hxN', 'How many diagnosed concussions has the athlete had in the past?:', 'num'], ['hxDays', 'How long was the recovery (time to being cleared to play) from the most recent concussion?:', 'num', '(Days)']],
  },
  immediate: {
    head: 'Immediate Assessment/Neuro Screen (Not Required at Baseline)',
    intro: [
      'The following elements should be used in the evaluation of all athletes who are suspected of having a concussion prior to proceeding to the cognitive assessment, and ideally should be completed “on-field” after the first aid/emergency care priorities are completed.',
      'If any of the observable signs of concussion are noted after a direct or indirect blow to the head, the athlete should be immediately and safely removed from participation and evaluated by an HCP.',
      'The Glasgow Coma Scale is important as a standard measure for all patients and can be repeated over time to monitor deterioration of consciousness. The Maddocks questions and cervical spine exam are also critical steps of the immediate assessment.',
    ],
    signsHead: 'Step 1: Observable Signs',
    signsSrc: ['Witnessed', 'Observed on Video'],
    signs: ['Lying motionless on playing surface', 'Falling unprotected to the surface', 'Balance/gait difficulties, motor incoordination, ataxia: stumbling, slow/laboured movements', 'Disorientation or confusion, staring or limited responsiveness, or an inability to respond appropriately to questions', 'Blank or vacant look', 'Facial injury after head trauma', 'Impact seizure', 'High-risk mechanism of injury (sport-dependent)'],
    redHead: 'Box 1: Red Flags',
    red: ['Neck pain or tenderness', 'Seizure or convulsion', 'Double vision', 'Loss of consciousness', 'Weakness or tingling/burning in more than 1 arm or in the legs', 'Deteriorating conscious state', 'Vomiting', 'Severe or increasing headache', 'Increasingly restless, agitated or combative', 'GCS <15', 'Visible deformity of the skull'],
    gcsHead: 'Step 2: Glasgow Coma Scale',
    gcsNote: 'Typically, GCS is assessed once. Additional scoring columns are provided for monitoring over time, if needed.',
    gcs: [
      ['E', 'Best Eye Response (E)', ['No eye opening', 'Eye opening to pain', 'Eye opening to speech', 'Eyes opening spontaneously']],
      ['V', 'Best Verbal Response (V)', ['No verbal response', 'Incomprehensible sounds', 'Inappropriate words', 'Confused', 'Oriented']],
      ['M', 'Best Motor Response (V)', ['No motor response', 'Extension to pain', 'Abnormal flexion to pain', 'Flexion/withdrawal to pain', 'Localized to pain', 'Obeys commands']],
    ],
    gcsTotal: 'Glasgow Coma Score (E + V + M)',
    cspineHead: 'Step 3: Cervical Spine Assessment',
    cspineNote: 'In a patient who is not lucid or fully conscious, a cervical spine injury should be assumed and spinal precautions taken.',
    cspine: ['Does the athlete report neck pain at rest?', 'Is there tenderness to palpation?', 'If NO neck pain and NO tenderness, does the athlete have a full range of ACTIVE pain free movement?', 'Are limb strength and sensation normal?'],
    coordHead: 'Step 4: Coordination & Ocular/Motor Screen',
    coord: ['Coordination: Is finger-to-nose normal for both hands with eyes open and closed?', 'Ocular/Motor: Without moving their head or neck, can the patient look side-to-side and up-and-down without double vision?', 'Are observed extraocular eye movements normal? If not, describe:'],
    madHead: 'Step 5: Memory Assessment Maddocks Questions',
    madSay: 'Say “I am going to ask you a few questions, please listen carefully and give your best effort. First, tell me what happened?”',
    madIntro: 'Modified Maddocks questions (Modified appropriately for each sport; 1 point for each correct answer)',
    mad: ['What venue are we at today?', 'Which half is it now?', 'Who scored last in this match?', 'What team did you play last week / game?', 'Did your team win the last game?'],
    madScore: 'Maddocks Score',
    madNote: 'Note: Appropriate sport-specific questions may be substituted',
  },
  off: {
    head: 'Off-Field Assessment',
    intro: 'Please note that the cognitive assessment should be done in a distraction-free environment with the athlete in a resting state after completion of the Immediate Assessment/Neuro Screen.',
    bgHead: 'Step 1: Athlete Background',
    bgQ: 'Has the athlete ever been:',
    bg: ['Hospitalised for head injury? (If yes, describe below)', 'Diagnosed/treated for headache disorder or migraine?', 'Diagnosed with a learning disability/dyslexia?', 'Diagnosed with attention deficit hyperactivity disorder (ADHD)?', 'Diagnosed with depression, anxiety, or other psychological disorder?'],
    symHead: 'Step 2: Symptom Evaluation',
    symMode: ['Baseline', 'Suspected/Post-injury'],
    symIntro: 'The athlete will complete the symptom scale (below) after you provide instructions. Please note that the instructions are different for baseline versus suspected/post-injury evaluations.',
    symSay: ['Baseline: Say “Please rate your symptoms below based on how you typically feel with “1” representing a very mild symptom and “6” representing a severe symptom.”', 'Suspected/Post-injury: Say “Please rate your symptoms below based on how you feel now with “1” representing a very mild symptom and “6” representing a severe symptom.”'],
    symHand: 'PLEASE HAND THE FORM TO THE ATHLETE',
    symBack: 'PLEASE HAND THE FORM BACK TO THE EXAMINER',
    sym: ['Headaches', 'Pressure in head', 'Neck pain', 'Nausea or vomiting', 'Dizziness', 'Blurred vision', 'Balance problems', 'Sensitivity to light', 'Sensitivity to noise', 'Feeling slowed down', 'Feeling like “in a fog”', '“Don’t feel right”', 'Difficulty concentrating', 'Difficulty remembering', 'Fatigue or low energy', 'Confusion', 'Drowsiness', 'More emotional', 'Irritability', 'Sadness', 'Nervous or anxious', 'Trouble falling asleep (if applicable)'],
    symX: ['Do your symptoms get worse with physical activity?', 'Do your symptoms get worse with mental activity?'],
    symPct: 'If 100% is feeling perfectly normal, what percent of normal do you feel?',
    symAfter: 'Once the athlete has completed answering all symptom items, it may be useful for the clinician to revisit items that were endorsed positively to gather more detail about each symptom.',
    symN: 'Total number of symptoms:', symS: 'Symptom severity score:',
    cogHead: 'Step 3: Cognitive Screening (Based on Standardized Assessment of Concussion; SAC)',
    oriHead: 'Orientation',
    ori: ['What month is it?', 'What is the date today?', 'What is the day of the week?', 'What year is it?', 'What time is it right now? (within 1 hour)'],
    oriScore: 'Orientation Score',
    imHead: 'Immediate Memory',
    imIntro: 'All 3 trials must be administered irrespective of the number correct on Trial 1. Administer at the rate of one word per second.',
    imSay: ['Trial 1: Say “I am going to test your memory. I will read you a list of words and when I am done, repeat back as many words as you can remember, in any order.”', 'Trials 2 and 3: Say “I am going to repeat the same list. Repeat back as many words as you can remember in any order, even if you said the word before in a previous trial.”'],
    lists: {
      A: ['Jacket', 'Arrow', 'Pepper', 'Cotton', 'Movie', 'Dollar', 'Honey', 'Mirror', 'Saddle', 'Anchor'],
      B: ['Finger', 'Penny', 'Blanket', 'Lemon', 'Insect', 'Candle', 'Paper', 'Sugar', 'Sandwich', 'Wagon'],
      C: ['Baby', 'Monkey', 'Perfume', 'Sunset', 'Iron', 'Elbow', 'Apple', 'Carpet', 'Saddle', 'Bubble'],
    },
    listUsed: 'Word list used:',
    imScore: 'Immediate Memory Score',
    conHead: 'Concentration',
    dbHead: 'Digits Backward:',
    dbIntro: 'Administer at the rate of one digit per second reading DOWN the selected column. If a string is completed correctly, move on to the string with next higher number of digits; if the string is completed incorrectly, use the alternate string with the same number of digits; if this is failed again, end the test.',
    dbSay: 'Say “I’m going to read a string of numbers and when I am done, you repeat them back to me in reverse order of how I read them to you. For example, if I say 7-1-9, you would say 9-1-7. So, if I said 9-6-8 you would say? (8-6-9)”',
    digits: {
      A: [['4-9-3', '6-2-9'], ['3-8-1-4', '3-2-7-9'], ['6-2-9-7-1', '1-5-2-8-6'], ['7-1-8-4-6-2', '5-3-9-1-4-8']],
      B: [['5-2-6', '4-1-5'], ['1-7-9-5', '4-9-6-8'], ['4-8-5-2-7', '6-1-8-4-3'], ['8-3-1-9-6-4', '7-2-4-8-5-6']],
      C: [['1-4-2', '6-5-8'], ['6-8-3-1', '3-4-8-1'], ['4-9-1-5-3', '6-8-2-5-1'], ['3-7-6-5-1-9', '9-2-6-5-1-4']],
    },
    digitListUsed: 'Digit list used:',
    dbScore: 'Digits Score',
    moHead: 'Months in Reverse Order:',
    moSay: 'Say “Now tell me the months of the year in reverse order as QUICKLY and as accurately as possible. Start with the last month and go backward. So, you’ll say December, November… go ahead”',
    moStart: 'Start stopwatch and CIRCLE each correct response:',
    months: ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'],
    moTime: 'Time Taken to Complete (secs):', moErr: 'Number of Errors:',
    moRule: '1 point if no errors and completion under 30 seconds',
    moScore: 'Months Score:', conScore: 'Concentration Score (Digits + Months)',
    balHead: 'Step 4: Coordination and Balance Examination',
    mbHead: 'Modified Balance Error Scoring System (mBESS) testing',
    mbSee: '(see detailed administration instructions)',
    mbFoot: 'Foot Tested:', mbFootOpt: ['Left', 'Right'], mbFootNote: '(i.e. test the non-dominant foot)',
    mbOpt: 'OPTIONAL (depending on clinical presentation and setting resources): For further assessment, the same 3 stances can be performed on a surface of medium density foam (e.g., approximately 50cm x 40cm x 6cm) with the same instructions and scoring.',
    mbSub: 'Modified BESS (20 seconds each)', mbFoam: 'On Foam (Optional)',
    stances: ['Double Leg Stance:', 'Tandem Stance:', 'Single Leg Stance:'], mbTotal: 'Total Errors:',
    mbNote: ['Note: If the mBESS yields normal findings then proceed to the Tandem Gait/Dual Task Tandem Gait.', 'If the mBESS reveals abnormal findings or clinically significant difficulties, Tandem Gait is not necessary at this time.', 'Both the Tandem Gait and optional Dual Task component may be administered later in the office setting as needed (see SCOAT6).'],
    tgHead: 'Timed Tandem Gait',
    tgIntro: 'Place a 3-metre-long line on the floor/firm surface with athletic tape. The task should be timed. Please complete all 3 trials.',
    tgSay: 'Say “Please walk heel-to-toe quickly to the end of the tape, turn around and come back as fast as you can without separating your feet or stepping off the line.”',
    tgSingle: 'Single Task:', tgTime: 'Time to Complete Tandem Gait Walking (seconds)', tgAvg: 'Average 3 Trials', tgFast: 'Fastest Trial',
    dtHead: 'Dual Task Gait (Optional. Timed Tandem Gait must be completed first)',
    dtIntro: 'Place a 3-metre-long line on the floor/firm surface with athletic tape. The task should be timed.',
    dtSay1: 'Say “Now, while you are walking heel-to-toe, I will ask you to count backwards out loud by 7s. For example, if we started at 100, you would say 100, 93, 86, 79. Let’s practise counting. Starting with 93, count backward by sevens until I say “stop”.” Note that this practice only involves counting backwards.',
    dtPractice: 'Dual Task Practice: Circle correct responses; record number of subtraction counting errors.',
    dtPracticeSeq: [93, 86, 79, 72, 65, 58, 51, 44],
    dtSay2: 'Say “Good. Now I will ask you to walk heel-to-toe and count backwards out loud at the same time. Are you ready? The number to start with is 88. Go!”',
    dtPerf: 'Dual Task Cognitive Performance: Circle correct responses; record number of subtraction counting errors.',
    dtTrials: [[88, 81, 74, 67, 60, 53, 46, 39, 32, 25, 18, 11, 4], [90, 83, 76, 69, 62, 55, 48, 41, 34, 27, 20, 13, 6], [98, 91, 84, 77, 70, 63, 56, 49, 42, 35, 28, 21, 14]],
    dtAlt: 'Alternate double number starting integers may be used and recorded below.',
    dtNotDone: 'Were any single- or dual-task, timed tandem gait trials not completed due to walking errors or other reasons?',
    drHead: 'Step 5: Delayed Recall',
    drIntro: 'The Delayed Recall should be performed after at least 5 minutes have elapsed since the end of the Immediate Memory section: Score 1 point for each correct response.',
    drSay: 'Say “Do you remember that list of words I read a few times earlier? Tell me as many words from the list as you can remember in any order.”',
    drScore: 'Delayed Recall Score',
    totHead: 'Total Cognitive Score',
    usual: 'If the athlete was known to you prior to their injury, are they different from their usual self?',
    usualOpt: ['Yes', 'No', 'Not applicable'],
    decHead: 'Step 6: Decision',
    neuro: 'Neurological Exam (Acute Injury evaluation only)', neuroOpt: ['Normal', 'Abnormal'],
    dx: 'Concussion diagnosed?', dxOpt: ['Yes', 'No', 'Deferred'],
    final: 'Note: Scoring on the SCAT6 should not be used as a stand-alone method to diagnose concussion, measure recovery, or make decisions about an athlete’s readiness to return to sport after concussion. Remember: An athlete can score within normal limits on the SCAT6 and still have a concussion.',
  },
};

// Skor — fungsi murni agar dapat diuji
export function scat6Scores(v, list = 'A') {
  const n = k => (v[k] === undefined || v[k] === '' ? null : Number(v[k]));
  const sum = (keys) => keys.reduce((a, k) => a + (n(k) || 0), 0);
  const filled = keys => keys.some(k => n(k) !== null);
  const gcsK = ['gE', 'gV', 'gM'];
  const gcs = gcsK.every(k => n(k) !== null) ? sum(gcsK) : null;
  const madK = [0, 1, 2, 3, 4].map(i => `md${i}`);
  const mad = filled(madK) ? sum(madK) : null;
  const symK = [...Array(22).keys()].map(i => `sy${i}`);
  const symN = filled(symK) ? symK.filter(k => (n(k) || 0) > 0).length : null;
  const symS = filled(symK) ? sum(symK) : null;
  const oriK = [0, 1, 2, 3, 4].map(i => `or${i}`);
  const ori = filled(oriK) ? sum(oriK) : null;
  const imK = t => [...Array(10).keys()].map(i => `im${t}_${i}`);
  const imAll = [...imK(1), ...imK(2), ...imK(3)];
  const im = filled(imAll) ? sum(imAll) : null;
  const imTrial = t => (filled(imK(t)) ? sum(imK(t)) : null);
  // Digits backward: tingkat lulus bila salah satu string benar; berhenti pada tingkat pertama yang kedua stringnya salah
  let dig = null;
  if ([0, 1, 2, 3].some(l => v[`dg${l}_0`] || v[`dg${l}_1`])) {
    dig = 0;
    for (let l = 0; l < 4; l++) {
      const a = v[`dg${l}_0`], b = v[`dg${l}_1`];
      if (a === 'Y' || b === 'Y') dig++;
      else break;
    }
  }
  const moT = n('moT'), moE = n('moE');
  const mo = moT !== null && moE !== null ? (moE === 0 && moT < 30 ? 1 : 0) : null;
  const con = dig !== null && mo !== null ? dig + mo : null;
  const drK = [...Array(10).keys()].map(i => `dr${i}`);
  const dr = filled(drK) ? sum(drK) : null;
  const cog = [ori, im, con, dr].every(x => x !== null) ? ori + im + con + dr : null;
  const mbK = [0, 1, 2].map(i => `mb${i}`), mfK = [0, 1, 2].map(i => `mf${i}`);
  const mb = mbK.every(k => n(k) !== null) ? sum(mbK) : null;
  const mf = mfK.every(k => n(k) !== null) ? sum(mfK) : null;
  const tg = [0, 1, 2].map(i => n(`tg${i}`)).filter(x => x !== null && x > 0);
  const tgAvg = tg.length === 3 ? (tg[0] + tg[1] + tg[2]) / 3 : null;
  const tgFast = tg.length ? Math.min(...tg) : null;
  const dt = [0, 1, 2].map(i => n(`dtT${i}`)).filter(x => x !== null && x > 0);
  const dtFast = dt.length ? Math.min(...dt) : null;
  return { gcs, mad, symN, symS, ori, im, imTrial: [1, 2, 3].map(imTrial), dig, mo, con, dr, cog, mb, mf, tgAvg, tgFast, dtFast, list };
}

// Child SCAT6 (8–12 tahun) — teks kata per kata dari PDF resmi BJSM 2023;57(11):636-45 (Davis GA, dkk.).
// PDF berupa gambar; teks diambil dengan OCR 300 dpi lalu dicocokkan visual baris per baris dengan gambar halaman.
// Isian identitas, tanda tangan, catatan teks bebas, dan atestasi HCP sengaja tidak disertakan.
const SAME = SCAT6.immediate;
export const SCAT6C = {
  title: 'Child Sport Concussion Assessment Tool 6 - Child SCAT6',
  sub: 'For Children Ages 8 to 12 Years',
  hcp: 'For use by Health Care Professionals Only',
  what: [
    'The Child SCAT6 is a standardised tool for evaluating concussions in children ages 8-12 years, and designed for use by Health Care Professionals (HCP). The Child SCAT6 cannot be performed correctly in less than 10-15 minutes. The Child SCAT6 is intended to be used in the acute phase, ideally within 72 hours (3 days), and up to 7 days, following injury. If greater than 7 days post-injury consider using the Child Sport Concussion Office Assessment Tool 6 (Child SCOAT6).',
    'The Child SCAT6 is used for evaluating children aged 8-12 years. For athletes aged 13 years or older, please use the SCAT6.',
    'If you are not an HCP, please use the Concussion Recognition Tool 6 (CRT6).',
    'Detailed instructions for use of the Child SCAT6 are provided as a supplement. Please read through these instructions carefully before using the Child SCAT6. Brief verbal instructions for each test are given in blue italics. The only equipment required for the examiner is athletic tape and a watch or timer.',
  ],
  copyright: SCAT6.copyright,
  recognise: 'A head impact by either a direct blow or indirect transmission of force to the head can be associated with serious and potentially fatal consequences. If there are significant concerns, including any of the RED FLAGS listed in Box 1 indicating signs that require urgent medical attention, and if a qualified medical practitioner is not present for immediate sideline assessment, then activation of emergency procedures and urgent transport to the nearest hospital should be arranged.',
  keyPoints: [
    'Any child with suspected concussion should be IMMEDIATELY REMOVED FROM PLAY, medically assessed, and monitored for injury-related signs, including deterioration of clinical condition.',
    'No child with a suspected concussion should be returned to play on the day of injury.',
    'If a child is suspected of having a concussion, and medical personnel are not immediately available, the child should be referred (or transported if needed) to a medical facility for assessment.',
    'Children with suspected or diagnosed concussion should not be given medications such as aspirin, anti-inflammatories, sedatives or opiates.',
    'Concussion signs and symptoms may evolve over time and it is important to monitor the child for ongoing, worsening, or development of concussion-related symptoms.',
    'The Child SCAT6 should not be used in isolation in making post-acute return to play decisions.',
    'The diagnosis of a concussion is a clinical determination made by a HCP. The Child SCAT6 should NOT be used by itself to make, or exclude, the diagnosis of concussion. It is important to note that a child may have a concussion even if their Child SCAT6 assessment is within normal limits.',
  ],
  remember: [
    'The basic principles of first aid should be followed: assess danger at the scene, child responsiveness, airway, breathing, and circulation.',
    'Do not attempt to move an unconscious/unresponsive child (other than that required for airway management) unless trained to do so.',
    'Assessment for a spinal and/or spinal cord injury is a critical part of the initial on-field assessment. Do not attempt to assess the spine unless trained to do so.',
    'Do not remove a helmet or any other equipment unless trained to do so safely.',
  ],
  history: {
    head: 'Concussion History',
    items: [['hxN', 'How many diagnosed concussions has the child had in the past?:', 'num'], ['hxDays', 'How long was the recovery (time to being cleared to play) from the most recent concussion?:', 'num', '(Days)']],
  },
  immediate: {
    head: SAME.head,
    intro: [
      'The following elements should be used in the evaluation of all children who are suspected of having a concussion prior to proceeding to the cognitive assessment, and ideally should be completed “on-field” after the first aid/emergency care priorities are completed.',
      'If any of the observable signs of concussion are noted after a direct or indirect blow to the head, the child should be immediately and safely removed from participation and evaluated by a HCP.',
      'Consideration of transportation to a medical facility should be at the discretion of the physician or HCP.',
      'The Glasgow Coma Scale is important as a standard measure for all patients and can be repeated over time to monitor deterioration of consciousness. The cervical spine examination is also a critical step in the immediate assessment.',
    ],
    signsHead: SAME.signsHead, signsSrc: SAME.signsSrc, signs: SAME.signs,
    redHead: SAME.redHead, red: SAME.red,
    gcsHead: SAME.gcsHead, gcsNote: SAME.gcsNote, gcs: SAME.gcs, gcsTotal: SAME.gcsTotal,
    cspineHead: SAME.cspineHead,
    cspineNote: 'In a child who is not lucid or fully conscious, a cervical spine injury should be assumed and spinal precautions taken.',
    cspine: ['Does the child report neck pain at rest?', 'Is there tenderness to palpation?', 'If NO neck pain and NO tenderness, does the athlete have a full range of ACTIVE pain free movement?', 'Are limb strength and sensation normal?'],
    coordHead: 'Step 4: Coordination & Oculomotor Screen',
    coord: SAME.coord,
  },
  off: {
    head: 'Off-Field Assessment',
    intro: 'Please note that the cognitive assessment should be done in a distraction-free environment with the child in a resting state after completion of the Immediate Assessment/Neuro Screen.',
    bgHead: 'Step 1: Child Background', bgQ: 'Has the child ever been:', bg: SCAT6.off.bg,
    symHead: 'Step 2: Symptom Evaluation - Child Report',
    symMode: SCAT6.off.symMode,
    symIntro: 'The child will complete the symptom scale (below) after you provide instructions. Please note that the instructions are different for baseline versus suspected/post-injury evaluations.',
    symSay: ['Baseline: Say “Please rate your symptoms below based on how you typically feel with “1” representing the symptom is a little and “3” representing the symptom is a lot.”', 'Suspected/Post-injury: Say “Please rate your symptoms below based on how you feel now with “1” representing the symptom is a little and “3” representing the symptom is a lot.”'],
    symHand: 'PLEASE HAND THE FORM TO THE CHILD',
    symBack: 'PLEASE HAND THE FORM BACK TO THE EXAMINER',
    scale: ['Not at all/never', 'A little/rarely', 'Somewhat/sometimes', 'A lot/often'],
    symCol: 'Symptom',
    sym: ['I have headaches', 'I feel dizzy', 'I feel like the room is spinning', 'I feel like I’m going to faint', 'Things are blurry when I look at them', 'I see double', 'I feel sick to my stomach', 'I get tired a lot', 'I get tired easily', 'I have trouble paying attention', 'I get distracted easily', 'I have a hard time concentrating', 'I have problems remembering what people tell me', 'I have problems following directions', 'I daydream too much', 'I get confused', 'I forget things', 'I have problems finishing things', 'I have trouble figuring things out', 'It’s hard for me to learn new things', 'My neck hurts'],
    symX: ['Do the symptoms get worse with physical activity?', 'Do the symptoms get worse with trying to think?'],
    rateHead: 'Overall rating for child to answer:',
    rateQ: 'On a scale of 0 to 10 (where 10 is normal), how do you feel now?', rateLo: 'Very Bad', rateHi: 'Very Good',
    symN: 'Child Report: Total number of symptoms:', symS: 'Symptom severity score:',
    parHead: 'Step 2: Symptom Evaluation - Parent Report',
    parHand: 'PLEASE HAND THE FORM TO THE PARENT/GUARDIAN/CARER',
    parCol: 'The Child...',
    par: ['has headaches', 'feels dizzy', 'has a feeling that the room is spinning', 'feels faint', 'has blurred vision', 'has double vision', 'experiences nausea', 'gets tired a lot', 'gets tired easily', 'has trouble sustaining attention', 'is distracted easily', 'has difficulty concentrating', 'has problems remembering what he/she is told', 'has difficulty following directions', 'tends to daydream', 'gets confused', 'is forgetful', 'has difficulty completing tasks', 'has poor problem-solving skills', 'has problems learning', 'has a sore neck'],
    parRateHead: 'Overall rating for parent/teacher/coach/carer to answer:',
    parRateQ: 'On a scale of 0 to 100% (where 100% is normal), how would you rate the child now?',
    parN: 'Parent Report: Total number of symptoms:',
    cogHead: SCAT6.off.cogHead,
    imHead: 'Immediate Memory',
    imIntro: 'All 3 trials must be administered irrespective of the number correct on Trial 1. Administer at the rate of one word per second in a monotone voice.',
    imSay: SCAT6.off.imSay,
    lists: {
      A: ['Finger', 'Penny', 'Blanket', 'Lemon', 'Insect', 'Candle', 'Paper', 'Sugar', 'Sandwich', 'Wagon'],
      B: ['Baby', 'Monkey', 'Perfume', 'Sunset', 'Iron', 'Elbow', 'Apple', 'Carpet', 'Saddle', 'Bubble'],
      C: ['Jacket', 'Arrow', 'Pepper', 'Cotton', 'Movie', 'Dollar', 'Honey', 'Mirror', 'Saddle', 'Anchor'],
    },
    listUsed: 'Word list used:', imScore: 'Immediate Memory Score',
    conHead: 'Concentration', dbHead: 'Digits Backward:',
    dbIntro: 'Administer at the rate of one digit per second in a monotone voice reading DOWN the selected column.',
    dbSay: SCAT6.off.dbSay,
    digits: {
      A: [['5-2', '4-1'], ['4-9-3', '6-2-9'], ['3-8-1-4', '3-2-7-9'], ['6-2-9-7-1', '1-5-2-8-6'], ['7-1-8-4-6-2', '5-3-9-1-4-8']],
      B: [['4-1', '9-4'], ['5-2-6', '4-1-5'], ['1-7-9-5', '4-9-6-8'], ['4-8-5-2-7', '6-1-8-4-3'], ['8-3-1-9-6-4', '7-2-4-8-5-6']],
      C: [['4-9', '6-2'], ['1-4-2', '6-5-8'], ['6-8-3-1', '3-4-8-1'], ['4-9-1-5-3', '6-8-2-5-1'], ['3-7-6-5-1-9', '9-2-6-5-1-4']],
    },
    digitListUsed: 'Digit list used:', dbScore: 'Digits Score',
    moHead: 'Days in Reverse Order:',
    moSay: 'Say “Now tell me the days of the week in reverse order as QUICKLY and as accurately as possible. Start with the last day and go backward. So, you’ll say Sunday, Saturday... go ahead”',
    moStart: 'Start stopwatch and CIRCLE each correct response:',
    months: ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'],
    moTime: 'Time Taken to Complete (secs):', moErr: 'Number of Errors:',
    moRule: '1 point if no errors and completion under 30 seconds',
    moScore: 'Days Score:', conScore: 'Concentration Score (Digits + Days)',
    balHead: SCAT6.off.balHead, mbHead: SCAT6.off.mbHead, mbSee: SCAT6.off.mbSee,
    mbFoot: SCAT6.off.mbFoot, mbFootOpt: SCAT6.off.mbFootOpt, mbFootNote: SCAT6.off.mbFootNote,
    mbOpt: SCAT6.off.mbOpt, mbSub: SCAT6.off.mbSub, mbFoam: SCAT6.off.mbFoam, stances: SCAT6.off.stances, mbTotal: SCAT6.off.mbTotal,
    mbNote: ['Note: If the mBESS yields negative or questionable findings then proceed to the Tandem Gait/Complex/Dual-Task Tandem Gait. If the mBESS reveals clinically significant difficulties, Tandem Gait is not necessary at this time. The Tandem Gait, Complex Tandem Gait and optional Dual-Task component may be administered later in the office setting as needed.'],
    tgHead: 'Timed Tandem Gait',
    tgIntro: 'Place a 3-metre-long line on the floor/firm surface with athletic tape. The task should be timed.',
    tgSay: SCAT6.off.tgSay, tgSingle: 'Single Task:', tgTime: SCAT6.off.tgTime, tgAvg: SCAT6.off.tgAvg, tgFast: SCAT6.off.tgFast,
    ctHead: 'Complex Tandem Gait',
    ctFwd: ['Forward', 'Say “Please walk heel-to-toe quickly five steps forward, then continue forward with eyes closed for five steps”', '1 point for each step off the line, 1 point for truncal sway.'],
    ctBwd: ['Backward', 'Say “Please walk heel-to-toe again, backwards five steps eyes open, then continue backwards five steps with eyes closed.”', '1 point for each step off the line, 1 point for truncal sway.'],
    ctItems: [['ctFO', 'Forward Eyes Open'], ['ctFC', 'Forward Eyes Closed'], ['ctBO', 'Backward Eyes Open'], ['ctBC', 'Backward Eyes Closed']],
    ctPts: 'Points:', ctFT: 'Forward Total Points:', ctBT: 'Backward Total Points:', ctTot: 'Total Points (Forward + Backward):',
    dtHead: 'Dual Task Gait (Optional)',
    dtOnly: 'Only perform if the child successfully completes complex tandem gait.',
    dtIntro: SCAT6.off.dtIntro,
    dtSay1: 'Say “Now, while you are walking heel-to-toe, I will ask you to count backwards out loud by 3s. For example, if we started at 100, you would say 100, 97, 94, 91. Let’s practise counting. Starting with 95, count backward by threes until I say “stop”.” Note that this practice only involves counting backwards.',
    dtPractice: SCAT6.off.dtPractice,
    dtPracticeSeq: [95, 92, 89, 86, 83, 80, 77, 74],
    dtSay2: SCAT6.off.dtSay2, dtPerf: SCAT6.off.dtPerf,
    dtTrials: [[88, 85, 82, 79, 76, 73, 70, 67], [76, 73, 70, 67, 64, 61, 58, 55], [93, 90, 87, 84, 81, 78, 75, 72]],
    dtAlt: SCAT6.off.dtAlt, dtNotDone: SCAT6.off.dtNotDone,
    drHead: SCAT6.off.drHead, drIntro: SCAT6.off.drIntro, drSay: SCAT6.off.drSay, drScore: SCAT6.off.drScore,
    usual: SCAT6.off.usual, usualOpt: SCAT6.off.usualOpt,
    decHead: 'Step 6: Decision',
    neuro: 'Immediate Assessent/Neuro Screen', neuroOpt: ['Normal', 'Abnormal'],
    dispHead: 'Disposition',
    dx: 'Concussion diagnosed?', dxOpt: ['Yes', 'No', 'Deferred'],
    improved: 'If re-testing, has the child improved?', improvedOpt: ['Yes', 'No'],
    final: 'Note: Scoring on the Child SCAT6 should not be used as a stand-alone method to diagnose concussion, measure recovery, or make decisions about a child’s readiness to return to sport after concussion. Remember, a child can score within normal limits on the Child SCAT6 and still have a concussion. Wherever possible, the results of the Child SCAT6 should accompany the child to any later reassessments by an HCP.',
  },
};

// Skor Child SCAT6 — gejala 21 butir skala 0–3 (anak & orang tua), digits 5 tingkat, hari mundur, kompleks tandem gait
export function childScat6Scores(v) {
  const n = k => (v[k] === undefined || v[k] === '' ? null : Number(v[k]));
  const sum = keys => keys.reduce((a, k) => a + (n(k) || 0), 0);
  const filled = keys => keys.some(k => n(k) !== null);
  const gcsK = ['gE', 'gV', 'gM'];
  const gcs = gcsK.every(k => n(k) !== null) ? sum(gcsK) : null;
  const rep = p => { const K = [...Array(21).keys()].map(i => `${p}${i}`); return filled(K) ? [K.filter(k => (n(k) || 0) > 0).length, sum(K)] : [null, null]; };
  const [symN, symS] = rep('sy'), [parN, parS] = rep('pa');
  const imK = t => [...Array(10).keys()].map(i => `im${t}_${i}`);
  const imAll = [...imK(1), ...imK(2), ...imK(3)];
  const im = filled(imAll) ? sum(imAll) : null;
  const imTrial = t => (filled(imK(t)) ? sum(imK(t)) : null);
  let dig = null;
  if ([0, 1, 2, 3, 4].some(l => v[`dg${l}_0`] || v[`dg${l}_1`])) {
    dig = 0;
    for (let l = 0; l < 5; l++) { if (v[`dg${l}_0`] === 'Y' || v[`dg${l}_1`] === 'Y') dig++; else break; }
  }
  const moT = n('moT'), moE = n('moE');
  const mo = moT !== null && moE !== null ? (moE === 0 && moT < 30 ? 1 : 0) : null;
  const con = dig !== null && mo !== null ? dig + mo : null;
  const drK = [...Array(10).keys()].map(i => `dr${i}`);
  const dr = filled(drK) ? sum(drK) : null;
  const cog = [im, con, dr].every(x => x !== null) ? im + con + dr : null;
  const mbK = [0, 1, 2].map(i => `mb${i}`), mfK = [0, 1, 2].map(i => `mf${i}`);
  const mb = mbK.every(k => n(k) !== null) ? sum(mbK) : null;
  const mf = mfK.every(k => n(k) !== null) ? sum(mfK) : null;
  const tg = [0, 1, 2].map(i => n(`tg${i}`)).filter(x => x !== null && x > 0);
  const tgAvg = tg.length === 3 ? (tg[0] + tg[1] + tg[2]) / 3 : null;
  const tgFast = tg.length ? Math.min(...tg) : null;
  const ctF = n('ctFO') !== null && n('ctFC') !== null ? n('ctFO') + n('ctFC') : null;
  const ctB = n('ctBO') !== null && n('ctBC') !== null ? n('ctBO') + n('ctBC') : null;
  const ct = ctF !== null && ctB !== null ? ctF + ctB : null;
  const dt = [0, 1, 2].map(i => n(`dtT${i}`)).filter(x => x !== null && x > 0);
  const dtFast = dt.length ? Math.min(...dt) : null;
  return { gcs, symN, symS, parN, parS, im, imTrial: [1, 2, 3].map(imTrial), dig, mo, con, dr, cog, mb, mf, tgAvg, tgFast, ctF, ctB, ct, dtFast };
}
