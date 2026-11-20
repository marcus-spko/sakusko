// SakuSKO — PAR-Q+ digital.
// Teks disalin KATA PER KATA dari formulir resmi, tanpa perubahan (termasuk salah ketik pada versi Indonesia):
//   EN: PAR-Q+ 2025 (Copyright © 2025 PAR-Q+ Collaboration, versi 01-11-2024), halaman 1–4.
//   ID: PAR-Q+ 2020 versi Indonesia, Supplement 1 Turu' Allo dkk. Korean J Fam Med 2026 (CC BY-NC 4.0).
// Logika hanya mengikuti petunjuk di formulir ("If NO go to question …", "COMPLETE PAGES 2 AND 3", "GO to Page 4").
// Nama, tanda tangan, dan saksi tidak diisi di aplikasi (aplikasi tidak menyimpan identitas).

const EN = {
  version: 'PAR-Q+ 2025 · Copyright © 2025 PAR-Q+ Collaboration · 01-11-2024',
  title: 'PAR-Q+',
  subtitle: 'The Physical Activity Readiness Questionnaire for Everyone',
  intro: 'The health benefits of regular physical activity are clear; more people should engage in physical activity every day of the week. Participating in physical activity is very safe for MOST people. This questionnaire will tell you whether it is necessary for you to seek further advice from your doctor OR a qualified exercise professional before becoming more physically active.',
  genHead: 'GENERAL HEALTH QUESTIONS',
  genInstr: 'Please read the 7 questions below carefully and answer each one honestly: check YES or NO.',
  yes: 'YES', no: 'NO',
  q1parts: ['heart condition', 'high blood pressure'],
  gen: [
    { n: '1', t: 'Has your doctor ever said that you have a heart condition ☐ OR high blood pressure ☐?' },
    { n: '2', t: 'Do you feel pain in your chest at rest, during your daily activities of living, OR when you do physical activity?' },
    { n: '3', t: 'Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months?', note: 'Please answer NO if your dizziness was associated with over-breathing (including during vigorous exercise).' },
    { n: '4', t: 'Have you ever been diagnosed with another chronic medical condition (other than heart disease or high blood pressure)?', list: 'PLEASE LIST CONDITION(S) HERE:' },
    { n: '5', t: 'Are you currently taking prescribed medications for a chronic medical condition?', list: 'PLEASE LIST CONDITION(S) AND MEDICATIONS HERE:' },
    { n: '6', t: 'Do you currently have (or have had within the past 12 months) a bone, joint, or soft tissue (muscle, ligament, or tendon) problem that could be made worse by becoming more physically active?', note: 'Please answer NO if you had a problem in the past, but it does not limit your current ability to be physically active.', list: 'PLEASE LIST CONDITION(S) HERE:' },
    { n: '7', t: 'Has your doctor ever said that you should only do medically supervised physical activity?' },
  ],
  p1Clear: {
    head: ['If you answered NO to all of the questions above, you are cleared for physical activity.', 'Please sign the PARTICIPANT DECLARATION. You do not need to complete Pages 2 and 3.'],
    items: [
      'Start becoming much more physically active – start slowly and build up gradually.',
      'Follow Global Physical Activity Guidelines for your age (https://www.who.int/publications/i/item/9789240015128).',
      'You may take part in a health and fitness appraisal.',
      'If you are over the age of 45 yr and NOT accustomed to regular vigorous to maximal effort exercise, consult a qualified exercise professional before engaging in this intensity of exercise.',
      'If you have any further questions, contact a qualified exercise professional.',
    ],
  },
  decl1: {
    head: 'PARTICIPANT DECLARATION',
    bullets: ['If you are less than the legal age required for consent or require the assent of a care provider, your parent, guardian or care provider must also sign this form.'],
    text: 'I, the undersigned, have read, understood to my full satisfaction and completed this questionnaire. I acknowledge that this physical activity clearance is valid for a maximum of 12 months from the date it is completed and becomes invalid if my condition changes. I also acknowledge that the community/fitness center may retain a copy of this form for its records. In these instances, it will maintain the confidentiality of the same, complying with applicable law.',
    fields: 'NAME · DATE · SIGNATURE · WITNESS · SIGNATURE OF PARENT/GUARDIAN/CARE PROVIDER',
  },
  p1Yes: 'If you answered YES to one or more of the questions above, COMPLETE PAGES 2 AND 3.',
  delay1: {
    head: 'Delay becoming more active if:',
    items: [
      'You are currently experiencing a temporary illness, such as a cold or fever. It is best to wait until you feel better.',
      'You are pregnant. In this case, talk with your health care practitioner, physician, qualified exercise professional, and/or complete the ePARmed-X+ at www.eparmedx.com before becoming more physically active.',
      'Your health changes. Answer the questions on Pages 2 and 3 of this document and/or talk to your health care practitioner, physician, or qualified exercise professional before proceeding with any physical activity program.',
    ],
  },
  fuHead: 'FOLLOW-UP QUESTIONS ABOUT YOUR MEDICAL CONDITION(S)',
  fu: [
    { n: '1', t: 'Do you have Arthritis, Osteoporosis, or Back Problems?', ifYes: 'If the above condition(s) is/are present, answer questions 1a-1c', ifNo: 'If NO ☐ go to question 2', subs: [
      { n: '1a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '1b', t: 'Do you have joint problems causing pain, a recent fracture or fracture caused by osteoporosis or cancer, displaced vertebra (e.g., spondylolisthesis), and/or spondylolysis/pars defect (a crack in the bony ring on the back of the spinal column)?' },
      { n: '1c', t: 'Have you had steroid injections or taken steroid tablets regularly for more than 3 months?' }] },
    { n: '2', t: 'Do you currently have Cancer of any kind?', ifYes: 'If the above condition(s) is/are present, answer questions 2a-2b', ifNo: 'If NO ☐ go to question 3', subs: [
      { n: '2a', t: 'Does your cancer diagnosis include any of the following types: lung/bronchogenic, multiple myeloma (cancer of plasma cells), head, and/or neck?' },
      { n: '2b', t: 'Are you currently receiving cancer therapy (such as chemotheraphy or radiotherapy)?' }] },
    { n: '3', t: 'Do you have a Heart or Cardiovascular Condition? This includes Coronary Artery Disease, Heart Failure, Diagnosed Abnormality of Heart Rhythm', ifYes: 'If the above condition(s) is/are present, answer questions 3a-3d', ifNo: 'If NO ☐ go to question 4', subs: [
      { n: '3a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '3b', t: 'Do you have an irregular heart beat that requires medical management? (e.g., atrial fibrillation, premature ventricular contraction)' },
      { n: '3c', t: 'Do you have chronic heart failure?' },
      { n: '3d', t: 'Do you have diagnosed coronary artery (cardiovascular) disease and have not participated in regular physical activity in the last 2 months?' }] },
    { n: '4', t: 'Do you currently have High Blood Pressure?', ifYes: 'If the above condition(s) is/are present, answer questions 4a-4b', ifNo: 'If NO ☐ go to question 5', subs: [
      { n: '4a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '4b', t: 'Do you have a resting blood pressure equal to or greater than 160/90 mmHg with or without medication? (Answer YES if you do not know your resting blood pressure)' }] },
    { n: '5', t: 'Do you have any Metabolic Conditions? This includes Type 1 Diabetes, Type 2 Diabetes, Pre-Diabetes', ifYes: 'If the above condition(s) is/are present, answer questions 5a-5e', ifNo: 'If NO ☐ go to question 6', subs: [
      { n: '5a', t: 'Do you often have difficulty controlling your blood sugar levels with foods, medications, or other physician-prescribed therapies?' },
      { n: '5b', t: 'Do you often suffer from signs and symptoms of low blood sugar (hypoglycemia) following exercise and/or during activities of daily living? Signs of hypoglycemia may include shakiness, nervousness, unusual irritability, abnormal sweating, dizziness or light-headedness, mental confusion, difficulty speaking, weakness, or sleepiness.' },
      { n: '5c', t: 'Do you have any signs or symptoms of diabetes complications such as heart or vascular disease and/or complications affecting your eyes, kidneys, OR the sensation in your toes and feet?' },
      { n: '5d', t: 'Do you have other metabolic conditions (such as current pregnancy-related diabetes, chronic kidney disease, or liver problems)?' },
      { n: '5e', t: 'Are you planning to engage in what for you is unusually high (or vigorous) intensity exercise in the near future?' }] },
    { n: '6', t: 'Do you have any Mental Health Problems or Learning Difficulties? This includes Alzheimer’s, Dementia, Depression, Anxiety Disorder, Eating Disorder, Psychotic Disorder, Intellectual Disability, Down Syndrome', ifYes: 'If the above condition(s) is/are present, answer questions 6a-6b', ifNo: 'If NO ☐ go to question 7', subs: [
      { n: '6a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '6b', t: 'Do you have Down Syndrome AND back problems affecting nerves or muscles?' }] },
    { n: '7', t: 'Do you have a Respiratory Disease? This includes Chronic Obstructive Pulmonary Disease, Asthma, Pulmonary High Blood Pressure', ifYes: 'If the above condition(s) is/are present, answer questions 7a-7d', ifNo: 'If NO ☐ go to question 8', subs: [
      { n: '7a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '7b', t: 'Has your doctor ever said your blood oxygen level is low at rest or during exercise and/or that you require supplemental oxygen therapy?' },
      { n: '7c', t: 'If asthmatic, do you currently have symptoms of chest tightness, wheezing, laboured breathing, consistent cough (more than 2 days/week), or have you used your rescue medication more than twice in the last week?' },
      { n: '7d', t: 'Has your doctor ever said you have high blood pressure in the blood vessels of your lungs?' }] },
    { n: '8', t: 'Do you have a Spinal Cord Injury? This includes Tetraplegia and Paraplegia', ifYes: 'If the above condition(s) is/are present, answer questions 8a-8c', ifNo: 'If NO ☐ go to question 9', subs: [
      { n: '8a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '8b', t: 'Do you commonly exhibit low resting blood pressure significant enough to cause dizziness, light-headedness, and/or fainting?' },
      { n: '8c', t: 'Has your physician indicated that you exhibit sudden bouts of high blood pressure (known as Autonomic Dysreflexia)?' }] },
    { n: '9', t: 'Have you had a Stroke? This includes Transient Ischemic Attack (TIA) or Cerebrovascular Event', ifYes: 'If the above condition(s) is/are present, answer questions 9a-9c', ifNo: 'If NO ☐ go to question 10', subs: [
      { n: '9a', t: 'Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)' },
      { n: '9b', t: 'Do you have any impairment in walking or mobility?' },
      { n: '9c', t: 'Have you experienced a stroke or impairment in nerves or muscles in the past 6 months?' }] },
    { n: '10', t: 'Do you have any other medical condition not listed above or do you have two or more medical conditions?', ifYes: 'If you have other medical conditions, answer questions 10a-10c', ifNo: 'If NO ☐ read the Page 4 recommendations', subs: [
      { n: '10a', t: 'Have you experienced a blackout, fainted, or lost consciousness as a result of a head injury within the last 12 months OR have you had a diagnosed concussion within the last 12 months?' },
      { n: '10b', t: 'Do you have a medical condition that is not listed (such as epilepsy, neurological conditions, kidney problems)?' },
      { n: '10c', t: 'Do you currently live with two or more medical conditions?' }],
      list: 'PLEASE LIST YOUR MEDICAL CONDITION(S) AND ANY RELATED MEDICATIONS HERE:' },
  ],
  goP4: 'GO to Page 4 for recommendations about your current medical condition(s) and sign the PARTICIPANT DECLARATION.',
  p4Clear: {
    head: 'If you answered NO to all of the FOLLOW-UP questions (pgs. 2-3) about your medical condition, you are ready to become more physically active - sign the PARTICIPANT DECLARATION below:',
    items: [
      'It is advised that you consult a qualified exercise professional to help you develop a safe and effective physical activity plan to meet your health needs.',
      'You are encouraged to start slowly and build up gradually - 20 to 60 minutes of low to moderate intensity exercise, 3-5 days per week including aerobic and muscle strengthening exercises.',
      'As you progress, you should aim to accumulate 150 minutes or more of moderate intensity physical activity per week.',
      'If you are over the age of 45 yr and NOT accustomed to regular vigorous to maximal effort exercise, consult a qualified exercise professional before engaging in this intensity of exercise.',
    ],
  },
  p4Yes: {
    head: 'If you answered YES to one or more of the follow-up questions about your medical condition:',
    text: 'You should seek further information before becoming more physically active or engaging in a fitness appraisal. You should complete the specially designed online screening and exercise recommendations program - the ePARmed-X+ at www.eparmedx.com and/or visit a qualified exercise professional to work through the ePARmed-X+ and for further information.',
  },
  delay4: {
    head: 'Delay becoming more active if:',
    items: [
      'You are currently experiencing a temporary illness, such as a cold or fever. It is best to wait until you feel better.',
      'You are pregnant. In this case, talk to your health care practitioner, physician, qualified exercise professional, and/or complete the ePARmed-X+ at www.eparmedx.com before becoming more physically active.',
      'Your health changes. Talk to your health care practitioner, physician, or qualified exercise professional before continuing with any physical activity program.',
    ],
  },
  notes: [
    'You are encouraged to photocopy the PAR-Q+. You must use the entire questionnaire and NO changes are permitted.',
    'The authors, the PAR-Q+ Collaboration, partner organizations, and their agents assume no liability for persons who undertake physical activity and/or make use of the PAR-Q+ or ePARmed-X+. If in doubt after completing the questionnaire, consult your doctor prior to physical activity.',
  ],
  decl4: {
    head: 'PARTICIPANT DECLARATION',
    bullets: ['All persons who have completed the PAR-Q+ please read and sign the declaration below.', 'If you are less than the legal age required for consent or require the assent of a care provider, your parent, guardian or care provider must also sign this form.'],
    text: 'I, the undersigned, have read, understood to my full satisfaction and completed this questionnaire. I acknowledge that this physical activity clearance is valid for a maximum of 12 months from the date it is completed and becomes invalid if my condition changes. I also acknowledge that the community/fitness center may retain a copy of this form for records. In these instances, it will maintain the confidentiality of the same, complying with applicable law.',
    fields: 'NAME · DATE · SIGNATURE · WITNESS · SIGNATURE OF PARENT/GUARDIAN/CARE PROVIDER',
  },
  info: [
    { h: 'For more information, please contact', t: 'www.eparmedx.com · Email: eparmedx@gmail.com' },
    { h: 'Citation for PAR-Q+', t: 'Warburton DER, Jamnik VK, Bredin SSD, and Gledhill N on behalf of the PAR-Q+ Collaboration. The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and Electronic Physical Activity Readiness Medical Examination (ePARmed-X+). Health & Fitness Journal of Canada 4(2):3-23, 2011.' },
    { h: '', t: 'The PAR-Q+ was created using the evidence-based AGREE process (1) by the PAR-Q+ Collaboration chaired by Dr. Darren E. R. Warburton with Dr. Norman Gledhill, Dr. Veronica Jamnik, and Dr. Donald C. McKenzie (2). Production of this document has been made possible through financial contributions from the Public Health Agency of Canada and the BC Ministry of Health Services. The views expressed herein do not necessarily represent the views of the Public Health Agency of Canada or the BC Ministry of Health Services.' },
  ],
  refsHead: 'Key References',
  refs: [
    '1. Jamnik VK, Warburton DER, Makarski J, McKenzie DC, Shephard RJ, Stone J, and Gledhill N. Enhancing the effectiveness of clearance for physical activity participation; background and overall process. APNM 36(S1):S3-S13, 2011.',
    '2. Warburton DER, Gledhill N, Jamnik VK, Bredin SSD, McKenzie DC, Stone J, Charlesworth S, and Shephard RJ. Evidence-based risk assessment and recommendations for physical activity clearance; Consensus Document. APNM 36(S1):S266-s298, 2011.',
    '3. Chisholm DM, Collis ML, Kulak LL, Davenport W, and Gruber N. Physical activity readiness. British Columbia Medical Journal. 1975;17:375-378.',
    '4. Thomas S, Reading J, and Shephard RJ. Revision of the Physical Activity Readiness Questionnaire (PAR-Q). Canadian Journal of Sport Science 1992;17:4 338-345.',
  ],
};

const ID = {
  version: "PAR-Q+ 2020 versi Indonesia · Supplement 1, Turu' Allo dkk. 2026 (CC BY-NC 4.0)",
  title: 'PAR-Q+',
  subtitle: 'Kuisioner Kesiapan Olahraga',
  intro: 'Manfaat olahraga yang teratur bagi kesehatan sangat jelas. Lebih banyak orang seharusnya melakukan olahraga setiap hari. Berolahraga sangat aman untuk KEBANYAKAN orang. Kuisioner ini akan memberitahu Anda, apakah Anda perlu berkonsultasi lebih lanjut dengan dokter Anda ATAU instruktur olahraga profesional sebelum menjadi lebih aktif secara fisik.',
  genHead: 'PERTANYAAN TERKAIT KONDISI UMUM KESEHATAN ANDA',
  genInstr: 'Silahkan baca tujuh pertanyaan di bawah dengan baik dan jawablah dengan jujur; tandai YA atau TIDAK',
  yes: 'YA', no: 'TIDAK',
  q1parts: ['sakit jantung', 'tekanan darah tinggi'],
  gen: [
    { n: '1', t: 'Apakah dokter Anda pernah mengatakan Anda menderita sakit jantung ☐ ATAU tekanan darah tinggi ☐?' },
    { n: '2', t: 'Apakah Anda merasakan nyeri dada saat istirahat, saat melakukan aktivitas rutin, ATAU saat berolahraga?' },
    { n: '3', t: 'Apakah Anda pernah kehilangan keseimbangan karena pusing ATAU apakah Anda pernah kehilangan kesadaran (pingsan) dalam 12 bulan terakhir?', note: 'Mohon jawab TIDAK bila rasa pusing yang Anda alami terjadi saat Anda bernapas sangat cepat (termasuk saat berolahraga berat)' },
    { n: '4', t: 'Apakah Anda pernah didiagnosis memiliki penyakit kronis lain (selain penyakit jantung atau tekanan darah tinggi)?', list: 'BILA ADA, MOHON CANTUMKAN PENYAKIT TERSEBUT DI SINI:' },
    { n: '5', t: 'Apakah Anda sedang rutin mengonsumsi obat untuk penyakit kronis lainnya?', list: 'BILA ADA, MOHON CANTUMKAN PENYAKIT DAN OBAT-OBATAN TERSEBUT DI SINI:' },
    { n: '6', t: 'Apakah Anda saat ini mengalami (atau pernah mengalami dalam 12 bulan terakhir) masalah tulang, sendi, atau jaringan lunak (otot, ligamen, atau tendon/urat) yang dapat menjadi lebih berat jika Anda menjadi lebih aktif dari biasanya?', note: 'Mohon jawab TIDAK jika Anda memiliki riwayat penyakit tersebut tetapi tidak membatasi kemampuan Anda saat ini untuk aktif secara fisik.', list: 'BILA ADA, MOHON CANTUMKAN DI SINI:' },
    { n: '7', t: 'Apakah dokter Anda pernah mengatakan bahwa Anda hanya boleh melakukan aktivitas fisik (olahraga) jika diawasi oleh tenaga medis?' },
  ],
  p1Clear: {
    head: ['Jika Anda menjawab TIDAK untuk semua pertanyaan di atas, maka Anda diizinkan untuk melakukan olahraga.', 'Harap tanda tangani PERTANYAAN PESERTA. Anda tidak perlu menyelesaikan Halaman 2 dan 3.'],
    items: [
      'Mulailah menjadi jauh lebih aktif secara fisik – mulai perlahan dan tingkatkan secara bertahap.',
      'Ikuti Panduan Aktivitas Fisik Global sesuai usia Anda (https://www.who.int/publications/i/item/9789240015128).',
      'Anda dapat ikut serta dalam penilaian kesehatan dan kebugaran.',
      'Jika Anda berusia di atas 45 tahun dan TIDAK terbiasa melakukan olahraga berat (hingga batas kemampuan maksimal) secara teratur, berkonsultasilah dengan instruktur olahraga profesional sebelum melakukan olahraga dengan intensitas tersebut.',
      'Jika Anda memiliki pertanyaan lebih lanjut, hubungi instruktur olahraga profesional.',
    ],
  },
  decl1: {
    head: 'DEKLARASI PARTISIPAN',
    bullets: ['Jika Anda masih di bawah umur untuk memberikan izin secara pribadi atau masih membutuhkan persetujuan orang tua/wali, maka orang tua atau wali Anda juga harus menandatangani formulir ini.'],
    text: 'Saya, yang bertanda tangan di bawah ini, telah membaca, mengerti sepenuhnya, dan melengkapi kuisioner ini. Saya mengetahui bahwa izin untuk melaksanakan olahraga ini hanya berlaku selama 12 bulan dari tanggal pengisiannya dan menjadi tidak berlaku jika kondisi saya berubah. Saya juga mengetahui bahwa komunitas/pusat kebugaran dapat memiliki salinan formulir ini sebagai catatan. Dalam hal ini, mereka akan menjaga kerahasiaan informasi tersebut, sesuai hukum yang berlaku.',
    fields: 'NAMA · TANGGAL · TANDA TANGAN · SAKSI · TANDA TANGAN ORANG TUA/WALI',
  },
  p1Yes: 'Jika Anda menjawab YA pada satu atau lebih pertanyaan di atas, LENGKAPI HALAMAN 2 DAN 3.',
  delay1: {
    head: 'Tunda menjadi lebih aktif jika:',
    items: [
      'Anda sedang mengalami pilek atau demam; lebih baik menunggu sampai Anda merasa lebih baik.',
      'Anda sedang hamil – diskusikan dengan seorang praktisi kesehatan, dokter Anda, instruktur olahraga profesional, dan/atau lengkapi ePARmed-X+ di www.eparmedx.com sebelum menjadi lebih aktif secara fisik.',
      'Kondisi kesehatan Anda berubah – jawablah pertanyaan-pertanyaan pada Halaman 2 dan 3 dokumen ini dan/atau berkonsultasilah dengan dokter Anda atau instruktur olahraga profesional sebelum melanjutkan program olahraga apapun.',
    ],
  },
  fuHead: 'PERTANYAAN LANJUTAN TERKAIT KONDISI MEDIS ANDA',
  fu: [
    { n: '1', t: 'Apakah Anda pernah didiagnosis oleh dokter mengalami Artritis (radang sendi), Osteoporosis (pengeroposan tulang), atau Masalah pada Punggung?', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 1a-1c', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 2', subs: [
      { n: '1a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '1b', t: 'Apakah Anda didiagnosis oleh dokter mengidap masalah sendi yang menyebabkan nyeri, patah tulang baru-baru ini, atau patah tulang yang disebabkan oleh osteoporosis atau kanker, pergeseran struktur tulang belakang (misalnya, spondilolistesis), dan/atau spondiolisis/defek pars (retak pada cincin tulang belakang)?' },
      { n: '1c', t: 'Apakah Anda pernah menerima suntikan steroid atau mengonsumsi tablet steroid secara rutin selama lebih dari 3 bulan?' }] },
    { n: '2', t: 'Apakah Anda didiagnosis oleh dokter mengidap Kanker?', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 2a-2b', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 3', subs: [
      { n: '2a', t: 'Apakah diagnosis kanker Anda termasuk salah satu dari jenis berikut: kanker paru-paru/bronkogenik, mieloma multipel (kanker sel plasma), kanker pada kepala dan/atau leher?' },
      { n: '2b', t: 'Apakah saat ini Anda menjalani terapi kanker (seperti kemoterapi atau radioterapi)?' }] },
    { n: '3', t: 'Apakah Anda didiagnosis oleh dokter mengidap Penyakit Jantung atau Kardiovaskular? Hal ini meliputi Penyakit Jantung Koroner, Gagal Jantung, Gangguan Irama Jantung', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 3a-3d', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 4', subs: [
      { n: '3a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '3b', t: 'Apakah Anda didiagnosis oleh dokter memiliki irama jantung tidak teratur sehingga memerlukan penanganan medis? (misalnya, fibrilasi atrium, kontraksi ventrikel prematur)' },
      { n: '3c', t: 'Apakah Anda didiagnosis oleh dokter mengidap gagal jantung kronis?' },
      { n: '3d', t: 'Apakah Anda didiagnosis mengidap penyakit jantung koroner (kardiovaskular) dan belum melakukan olahraga rutin dalam dua bulan terakhir?' }] },
    { n: '4', t: 'Apakah Anda didiagnosis oleh dokter mengidap Tekanan Darah Tinggi?', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 4a-4b', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 5', subs: [
      { n: '4a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '4b', t: 'Apakah tekanan darah Anda sama dengan atau lebih dari 160/90 mmHg saat istirahat dengan atau tanpa pengobatan? (Jawab YA jika Anda tidak mengetahui tekanan darah istirahat Anda)' }] },
    { n: '5', t: 'Apakah Anda didiagnosis oleh dokter mengidap Penyakit Metabolik? Hal ini mencakup Diabetes Tipe 1, Diabetes Tipe 2, Pre-diabetes', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 5a-5e', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 6', subs: [
      { n: '5a', t: 'Apakah Anda mengalami kesulitan mengontrol kadar gula darah Anda dengan makanan, obat-obatan atau terapi lain yang diresepkan oleh dokter?' },
      { n: '5b', t: 'Apakah Anda mengalami gejala dan tanda kadar gula darah rendah (hipoglikemia) setelah berolahraga dan/atau selama melakukan aktivitas sehari-hari? Gejala hipoglikemia meliputi gemetar, gelisah, lekas marah, keringat berlebih, pusing atau kepala terasa ringan/melayang, kebingungan/mumet, kesulitan bicara, lemah badan, atau mengantuk.' },
      { n: '5c', t: 'Apakah Anda mengalami gejala dan tanda komplikasi diabetes seperti penyakit jantung atau pembuluh darah dan/atau komplikasi yang memengaruhi mata, ginjal, ATAU sensasi pada jari-jari kaki dan kaki Anda?' },
      { n: '5d', t: 'Apakah Anda didiagnosis oleh dokter mengalami penyakit metabolik lain (seperti diabetes terkait kehamilan, penyakit ginjal kronis, atau gangguan organ hati?' },
      { n: '5e', t: 'Apakah Anda berencana untuk melakukan olahraga berintensitas tinggi (atau berat) yang tidak biasa Anda lakukan dalam waktu dekat?' }] },
    { n: '6', t: 'Apakah Anda didiagnosis oleh dokter mengidap Masalah Kesehatan Mental atau Kesulitan Belajar? Hal ini mencakup Alzheimer, Demensia, Depresi, Gangguan Cemas, Gangguan Makan, Gangguan Psikotik, Disabilitas/Keterbatasan Intelektual, Sindroma Down', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 6a-6b', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 7', subs: [
      { n: '6a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '6b', t: 'Apakah Anda didiagnosis oleh dokter mengidap Sindroma Down DAN masalah punggung yang memengaruhi saraf atau otot?' }] },
    { n: '7', t: 'Apakah Anda didiagnosis oleh dokter mengidap Penyakit Pernapasan? Hal ini mencakup Penyakit Paru Obstruktif Kronis, Asma, Tekanan Darah Tinggi pada Pembuluh Darah Paru', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 7a-7d', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 8', subs: [
      { n: '7a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '7b', t: 'Apakah Dokter Anda pernah mengatakan bahwa kadar oksigen dalam darah Anda rendah saat istirahat atau saat olahraga dan/atau bahwa Anda membutuhkan terapi oksigen tambahan?' },
      { n: '7c', t: 'Jika Anda penderita asma, apakah belakangan waktu ini Anda memiliki gejala sesak di dada, mengi, kesulitan bernapas, batuk terus-menerus (lebih dari dua hari/minggu), atau apakah Anda pernah menggunakan obat darurat lebih dari dua kali dalam seminggu terakhir?' },
      { n: '7d', t: 'Apakah dokter Anda pernah mengatakan bahwa Anda memiliki tekanan darah tinggi pada pembuluh darah paru-paru Anda?' }] },
    { n: '8', t: 'Apakah Anda didiagnosis oleh dokter mengidap Cidera Tulang Belakang? Hal ini mencakup tetraplegia (kelumpuhan kedua lengan dan tungkai) dan paraplegia (kelumpuhan tungkai)', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 8a-8c', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 9', subs: [
      { n: '8a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '8b', t: 'Apakah Anda sering mengalami tekanan darah rendah saat istirahat sehingga menyebabkan pusing, kepala terasa ringan/melayang, dan/atau pingsan?' },
      { n: '8c', t: 'Apakah dokter Anda pernah mengatakan bahwa Anda mengalami peningkatan tekanan darah mendadak (dikenal sebagai disrefleksia otonom)?' }] },
    { n: '9', t: 'Apakah Anda didiagnosis oleh dokter mengidap penyakit Stroke? Hal ini mencakup Stroke Ringan/Transient Ischemic Attack (TIA) atau Serangan Penyakit Serebrovaskular', ifYes: 'Jika Anda mengindap kondisi di atas, jawablah pertanyaan 9a-9c', ifNo: 'Jika TIDAK ☐ lanjutkan ke pertanyaan 10', subs: [
      { n: '9a', t: 'Apakah Anda kesulitan mengontrol kondisi Anda dengan obat-obatan atau terapi lain yang diresepkan oleh dokter? (Jawablah TIDAK jika saat ini Anda tidak sedang mengonsumsi obat-obatan atau menjalani terapi lain)' },
      { n: '9b', t: 'Apakah Anda memiliki gangguan saat berjalan atau berpindah tempat?' },
      { n: '9c', t: 'Apakah Anda didiagnosis oleh dokter pernah mengalami stroke atau gangguan pada saraf atau otot dalam 6 bulan terakhir?' }] },
    { n: '10', t: 'Apakah Anda didiagnosis oleh dokter mengidap penyakit lain yang belum disebutkan di atas atau memiliki dua masalah kesehatan atau lebih?', ifYes: 'Jika Anda mengindap masalah kesehatan lain, jawablah pertanyaan 10a-10c', ifNo: 'Jika TIDAK ☐ bacalah rekomendasi di Halaman selanjutnya', subs: [
      { n: '10a', t: 'Apakah Anda pernah mengalami pandangan gelap, kehilangan kesadaran atau pingsan akibat cidera kepala dalam 12 bulan terakhir ATAU pernahkah Anda mengalami gegar otak dalam 12 bulan terakhir?' },
      { n: '10b', t: 'Apakah anda didiagnosis oleh dokter mengidap masalah kesehatan yang belum disebutkan sebelumnya (seperti epilepsi, penyakit saraf lainnya, penyakit ginjal)?' },
      { n: '10c', t: 'Apakah Anda saat ini mengidap dua masalah kesehatan atau lebih?' }],
      list: 'MOHON TULISKAN MASALAH KESHATAN ANDA DI SINI DAN OBAT-OBATAN TERKAIT DI SINI:' },
  ],
  goP4: 'LANJUTKAN ke Halaman 4 untuk rekomendasi terkait kondisi kesehatan Anda saat ini dan tandatangani DEKLARASI PARTISIPAN',
  p4Clear: {
    head: 'Jika Anda menjawab TIDAK untuk semua pertanyaan LANJUTAN (hal 2-3) tentang kondisi medis Anda, Anda telah siap untuk lebih aktif berolahraga – tanda tanganilah DEKLARASI PESERTA di bawah ini:',
    items: [
      'Anda disarankan berkonsultasi dengan instruktur olahraga profesional untuk membantu Anda menyusun rencana olahraga yang aman dan efektif untuk memenuhi kebutuhan kesehatan Anda.',
      'Anda diharapkan memulai secara perlahan dan meningkatkan olahraga Anda secara bertahap – 20 hingga 60 menit latihan intensitas rendah hingga sedang, 3-5 hari per minggu, termasuk latihan aerobik dan penguatan otot.',
      'Seiring dengan kemajuan Anda, Anda harus menargetkan untuk mengakumulasi 150 menit atau lebih olahraga berintensitas sedang per minggu.',
      'Jika Anda berusia di atas 45 tahun dan TIDAK terbiasa melakukan olahraga berat (hingga batas kemampuan maksimal) secara rutin, berkonsultasilah dengan instruktur olahraga profesional sebelum melakukan latihan dengan intensitas ini.',
    ],
  },
  p4Yes: {
    head: 'Jika Anda menjawab YA untuk satu atau lebih pertanyaan lanjutan terkait kondisi medis Anda:',
    text: 'Anda harus mencari informasi lebih lanjut sebelum menjadi lebih aktif berolahraga atau melakukan penilaian kebugaran. Anda harus melengkapi skrining daring dan program rekomendasi latihan yang telah didesain secara spesifik – ePARmed-X+ di www.eparmedx.com dan/atau mengunjungi instruktur olahraga profesional untuk membantu Anda mengisi ePARmed-X+ dan mendapatkan informasi lebih lanjut.',
  },
  delay4: {
    head: 'Tunda untuk menjadi lebih aktif berolahraga jika:',
    items: [
      'Anda sedang menderita pilek atau demam; lebih baik Anda menunggu hingga merasa lebih baik.',
      'Anda sedang hamil – diskusikan dengan seorang praktisi kesehatan, dokter Anda, atau instruktur olahraga profesional, dan/atau lengkapi ePARmed-X+ di www.eparmedx.com sebelum lebih aktif berolahraga.',
      'Kondisi kesehatan Anda berubah – konsultasikan dengan dokter Anda atau instruktur olahraga profesional sebelum melanjutkan program aktivitas fisik apapun.',
    ],
  },
  notes: [
    'Anda disarankan untuk menyalin PAR-Q+ secara lengkap. Anda harus menggunakan seluruh bagian bagian kuisioner dan TIDAK diizinkan untuk mengubah apapun.',
    'Penyusun kuisioner, PAR-Q+ Collaboration, organisasi mitra, dan para agennya tidak bertanggung jawab atas setiap individu yang melakukan aktivitas fisik dan/atau menggunakan PAR-Q+ atau ePARmed-X+. Jika Anda merasa ragu setelah menyelesaikan kusioner ini, konsultasikan dengan dokter Anda sebelum mulai berolahraga.',
  ],
  decl4: {
    head: 'DEKLARASI PARTISIPAN',
    bullets: ['Seluruh individu yang telah menyelesaikan PAR-Q+ harap membaca dan menandatangani deklarasi di bawah.', 'Jika Anda masih di bawah batas umur untuk memberikan persetujuan secara pribadi atau membutuhkan persetujuan dari orang tua/wali Anda maka orang tua/wali Anda juga harus menandatangani formulir ini.'],
    text: 'Saya, yang bertanda tangan di bawah ini, telah membaca, mengerti sepenuhnya, dan melengkapi kuisioner ini. Saya mengetahui bahwa izin untuk aktivitas fisik (olahraga) ini hanya berlaku selama 12 bulan dari tanggal pengisiannya dan menjadi tidak berlaku jika kondisi saya berubah. Saya juga mengetahui bahwa komunitas/pusat kebugaran dapat memiliki salinan formulir ini sebagai catatan. Dalam hal ini, mereka akan menjaga kerahasiaan informasi tersebut, sesuai hukum yang berlaku.',
    fields: 'NAMA · TANGGAL · TANDA TANGAN · SAKSI · TANDA TANGAN ORANG TUA/WALI',
  },
  info: [
    { h: 'Untuk informasi lebih lanjut, silahkan kontak', t: 'www.eparmedx.com · Email: eparmedx@gmail.com' },
    { h: 'Sitasi PAR-Q+', t: 'Warburton DER, Jamnik VK, Bredin SSD, and Gledhill N on behalf of the PAR-Q+ Collaboration. The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and Electronic Physical Activity Readiness Medical Examination (ePARmed-X+), Health & Fitness Journal of Canada 4(2):3-23, 2011.' },
    { h: '', t: 'PAR-Q+ dibuat berdasarkan proses AGREE(1) yang dibuktikan secara ilmiah oleh PAR-Q+ Collaboration yang dipimpin Dr. Darren E. R. Warburton bersama Dr. Normal Gledhill, Dr. Veronica Jamnik, dan Dr. Donald C. McKenzie (2). Pembuatan dokumen ini disponsori oleh Public Health Agency Kanada dan BC Ministry of Health Services. Pandangan yang disampaikan di sini tidak sepenuhnya merepresentasikan pandangan Public Health Agency Kanada atau BC Ministry of Health Services.' },
  ],
  refsHead: 'Referensi Utama:',
  refs: [
    '1. Jamnik VK, Warburton DER, Makarski J, McKenzie DC, Shephard RJ, Stone J, and Gledhill N. Enhancing the effectiveness of clearance for physical activity participation; background and overall process. APNM 36(S1):S3-S13, 2011.',
    '2. Warburton DER, Gledhill N, Jamnik VK, Bredin SSD, McKenzie DC, Stone J, Charlesworth S, and Shephard RJ. Evidence-based risk assessment and recommendation for physical activity clearance; Consensus Document. APNM 36(S1):S266-S298, 2011.',
    '3. Chrisholm DM, Collis ML, Kulak LL, Davenport W, and Gruber N. Physical activity readiness. British Columbia Medical Journal. 1975;17:375-378.',
    '4. Thomas S, Reading J, and Shephard RJ. Revision of the Physical Activity Readiness Questionnaire (PAR-Q), Canadian Journal of Sport Science 1992;17:4 338-345.',
  ],
};

export const PARQ_FORM = { en: EN, id: ID };

// Status pengisian. a = { g: {1:'y'|'n'...}, f: {'1':'y'|'n', '1a':'y'|'n', ...} }
export function parqStatus(form, a) {
  const g = a.g || {}, f = a.f || {};
  const genDone = form.gen.every(q => g[q.n] === 'y' || g[q.n] === 'n');
  const anyGenYes = form.gen.some(q => g[q.n] === 'y');
  if (!genDone) return { stage: 'gen', genDone, anyGenYes };
  if (!anyGenYes) return { stage: 'p1clear', genDone, anyGenYes };
  // Halaman 2–3
  let fuDone = true, anyFuYes = false;
  const fuYes = [];
  for (const sec of form.fu) {
    if (f[sec.n] !== 'y' && f[sec.n] !== 'n') { fuDone = false; continue; }
    if (f[sec.n] === 'y') for (const s of sec.subs) {
      if (f[s.n] === 'y') { anyFuYes = true; fuYes.push(s.n); } else if (f[s.n] !== 'n') fuDone = false;
    }
  }
  if (!fuDone) return { stage: 'fu', genDone, anyGenYes, fuYes };
  return { stage: anyFuYes ? 'p4yes' : 'p4clear', genDone, anyGenYes, fuYes };
}
