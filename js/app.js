'use strict';
/* ═══════════════════════════════════════════════════════════════
   ቂራአት አስተዳደር • إدارة القراءات — app.js
   الأجزاء: أدوات → ترجمات → حالة → مزامنة → دخول → تهيئة
            → دروس → طلاب → حضور → متن/مطالعة (نظام الدين)
            → اختبارات PDF → تقارير PDF → تقرير الوالد → PWA
   ═══════════════════════════════════════════════════════════════ */

/* ───────────── (1) أدوات مساعدة ───────────── */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseD = s => { const [y,m,dd] = s.split('-').map(Number); return new Date(y, m-1, dd); };
const todayStr = () => dstr(new Date());
const fmtDM = s => { const d = parseD(s); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}`; };

const LS_KEY = 'qiraat_state_v1';
const SESS   = 'qiraat_session';
const CLOUD  = 'qiraat_cloud_mirror';

/* ───────────── (2) الترجمات الدقيقة (am افتراضية) ───────────── */
const I18N = {

/* ── الأمهرية (اللغة الأم) — بمصطلحات المستخدم الدقيقة ── */
am: {
'app.name':'ቂራአት አስተዳደር',
'common.back':'ተመለስ','common.next':'ቀጥል','common.cancel':'ሰርዝ','common.confirm':'ማረጋገጫ',
'common.yes':'አዎ','common.no':'አይ','common.close':'ዝጋ','common.save':'መመዝገብ','common.delete':'ማጥፋት',
'common.edit':'ማስተካከል','common.date':'ቀን','common.status':'ሁኔታ','common.install':'መትገብር',
'common.installed':'መተግበሪያው ተተክሏል ✓','common.unknown':'(ተሰወጠ)','common.today':'ዛሬ',
'login.subtitle':'ለመቀጠል ይግቡ','login.username':'የተጠቃሚ ስም','login.password':'የመግቢያ ቃል',
'login.enter':'ግባ','login.hint':'መሠረታዊ መለያ፦ kiar / 1111 — በማስተካከያ ይቀይሩት',
'login.error':'የተጠቃሚ ስም ወይም የመግቢያ ቃል ትክክል አይደለም!',
'setup.welcome':'እንኳን በደህና መጡ! ትምህርታችንን እናዘጋጅ',
'setup.step1desc':'የትምህርት ቀኖችን ይምረጡ','setup.teacher':'የመምህሩ ስም',
'setup.teacherPh':'ምሳሌ፦ አቡ ቢስሚል','setup.center':'የክታቢት / ማዕከል ስም (አማራጭ)',
'setup.centerPh':'ምሳሌ፦ አንዋር ክታቢት','setup.daysLabel':'የትምህርት ቀኖች',
'setup.daysRequired':'ቢያንስ አንድ ቀን ይምረጡ!','setup.readingTitle':'የመጀመሪያዎን ቂራአት ይጨምሩ',
'setup.step2desc':'እያንዳንዱ ቂራአት በተማሪዎቹና በመዝገቡ ሙሉ በሙሉ እንደተለየ ነው',
'setup.readingName':'የቂራአት / ትምህርት ስም','setup.readingNamePh':'ምሳሌ፦ ተፍሀት አጥራት',
'setup.nameRequired':'የቂራአት ስም ያስፈልጋል!','setup.bookName':'የኪታብ / መትን ስም',
'setup.bookNamePh':'ምሳሌ፦ ተፍሀት አጥራት','setup.mutalaCount':'በቀን የሚጠቀሙ ተማሪዎች ብዛት',
'setup.doneTitle':'ተጠናቀቋል! 🎉','setup.finish':'ጀምር!','setup.sumTeacher':'መምህር',
'setup.sumCenter':'ማዕከል','setup.sumDays':'የትምህርት ቀኖች','setup.sumReading':'ቂራአት',
'setup.sumBook':'ኪታብ','setup.sumMutala':'በቀን የሙጣለዐ ተማሪዎች',
'day.0':'እሁድ','day.1':'ሰኞ','day.2':'ማክሰኞ','day.3':'ረቡዕ','day.4':'ሐሙስ','day.5':'ዓርብ','day.6':'ቅዳሜ',
'sync.idle':'ተሳስሯል','sync.syncing':'በማስተሳሰር ላይ…','sync.offline':'ከመስመር ውጭ','sync.error':'የማስተሳሰር ስህተት',
'nav.students':'ተማሪዎች','nav.attendance':'መገኘት','nav.recitation':'መትንና ሙጣለዐ',
'nav.exams':'ፈተናዎች','nav.reports':'ሪፖርቶች','nav.settings':'ማስተካከያ',
'students.title':'የተማሪዎች አስተዳደር','students.count':'ተማሪ','students.addTitle':'አዲስ ተማሪ መፍጠር',
'students.name':'የተማሪው ስም','students.namePh':'ምሳሌ፦ መሐመድ አሕመድ','students.father':'የአባት ስም',
'students.fatherPh':'ምሳሌ፦ አሕመድ','students.phone':'የወላጅ ስልክ','students.phonePh':'+2519…',
'students.guardian':'የሚከታተለው','students.gFather':'አባት','students.gMother':'እናት','students.gGuardian':'ወኪል',
'students.seq':'ተከታይ ቁጥር (ራስ-ሰር)','students.save':'ተማሪ መጨመር','students.update':'ማስተካከል',
'students.search':'በስም መፈለግ…','students.empty':'እስካሁን ተማሪ የለም — የመጀመሪያውን ይጨምሩ 🌱',
'students.confirmDelete':'ይህ ተማሪ ሙሉ በሙሉ ይጠፋል። እርግጠኛ ነዎት?','students.call':'መደወል',
'pdf.namesOnly':'ስሞች ብቻ PDF','pdf.weekly':'ሳምንታዊ ዝርዝር PDF','pdf.monthly':'ወርሃዊ ዝርዝር PDF',
'pdf.noStudents':'መጀመሪያ ተማሪዎችን ይጨምሩ','pdf.done':'PDF ተዘጋጅቷል ✓','pdf.fail':'PDF መፍጠር አልተቻለም',
'pdf.printFallback':'የPDF መሣሪያ አልተገኘም — የህትመት መስኮት ይከፈታል',
'attendance.title':'ዕለታዊ መገኘት','attendance.saved':'ተመዝግቧል ✓',
'attendance.empty':'መጀመሪያ ከተማሪዎች ክፍል ተማሪዎችን ይጨምሩ',
'attendance.save':'የዛሬን መገኘት ማስቀመጥ','attendance.present':'መጥቷል','attendance.absent':'አልመጣም',
'attendance.lateQ':'አርፍዷል?','attendance.mins':'ደቂቃ','attendance.bookYes':'ኪታብ አለው',
'attendance.bookNo':'ባዶ እጅ','attendance.autoDebtNote':'ዛሬ የተራ ቀናቸው {n} ተማሪ ስለአልመጣ እዳ ተመዘገበላቸው።',
'recitation.title':'መትንና ሙጣለዐ','recitation.matn':'የዛሬ መትን አንባቢ',
'recitation.matnSlot':'የመትን ቂራአት — በቀን አንድ ተማሪ ብቻ',
'recitation.mutalaSlot':'ሙጣለዐ — በቀን አንድ ወይም ሁለት ተማሪዎች',
'recitation.mutalaPerDay':'በቀን የሙጣለዐ ተማሪዎች ቁጥር','recitation.debtTitle':'የተከማቹ እዳዎች',
'recitation.debtNote':'እዳ ያለበት ተማሪ እስኪያጠናቀቅ ድረስ ተራው በየቀኑ ይጠበቅለታል።',
'recitation.debtEmpty':'እዳ የለም — አሏህ ይባርክ! 🎉','recitation.queueTitle':'የሚቀጥሉ ተራዎች',
'recitation.historyTitle':'የቂራአት መዝገብ','recitation.type':'ዓይነት','recitation.matnType':'መትን',
'recitation.mutalaType':'ሙጣለዐ','recitation.readMatn':'መትኑን አንብቧል','recitation.readMutala':'ሙጣለዐውን ጨርሷል',
'recitation.missedBtn':'አልመጣም ⚖️','recitation.statusDone':'ተከናውኗል','recitation.statusDebt':'እዳ',
'recitation.notStudyDay':'ዛሬ የትምህርት ቀን አይደለም።','recitation.noStudents':'መጀመሪያ ተማሪዎችን ይጨምሩ',
'recitation.alreadyMarked':'ለዛሬ አስቀድሞ ተመዝግቧል።',
'exams.title':'ፈተናዎች','exams.create':'የፈተና PDF መሥራት',
'exams.createHint':'አንድ ወይም ሁለት ገጽ ብቻ — ከመረጣችሁት በፊት አይበልጥም፤ ትንሽ ከሆነ ወደ ገጹ ሙሉ እንዲሞላ ይስፋፋል',
'exams.builderTitle':'የፈተና ገንቢ','exams.pages':'የገጾች ብዛት (ከፍተኛ)','exams.number':'የፈተና ቁጥር (ራስ-ሰር)',
'exams.book':'የኪታብ ስም','exams.reading':'የቂራአት ስም','exams.secEssayHead':'ለሚከተሉት ጥያቄዎች ይመልሱ',
'exams.addEssay':'የጽሑፍ ጥያቄ','exams.secMcqHead':'ለሚከተሉት ጥያቄዎች ትክክለኛውን መልስ ይምረጡ',
'exams.addMcq':'የምርጫ ጥያቄ','exams.secTfHead':'ለሚከተሉት ጥያቄዎች በ ✓ ወይም ✗ ይመልሱ',
'exams.addTf':'እውነት / ስህተት ጥያቄ','exams.preview':'ቅድመ እይታ','exams.generate':'PDF ማውጣት',
'exams.questionPh':'ጥያቄውን እዚህ ይጻፉ…','exams.optionPh':'አማራጭ…','exams.addOption':'＋ አማራጭ',
'exams.noQuestions':'ቢያንስ አንድ ጥያቄ ይጨምሩ!','exams.emptyList':'እስካሁን ፈተና አልተሠራም',
'exams.qCount':'ጥያቄዎች','exams.results':'ውጤቶች','exams.resultScore':'የተመጣጠነው ነጥብ',
'exams.resultTotal':'ከሙሉ ነጥብ','exams.saveResults':'ውጤት ማስቀመጥ',
'exams.confirmDelete':'ይህ ፈተና ይጠፋል። እርግጠኛ ነዎት?',
'sheet.exam':'ፈተና ቁጥር','sheet.name':'ስም፦','sheet.date':'ቀን፦','sheet.bookLabel':'ኪታብ፦',
'sheet.readingLabel':'ቂራአት፦','sheet.essayHead':'ለሚከተሉት ጥያቄዎች ይመልሱ',
'sheet.mcqHead':'ለሚከተሉት ጥያቄዎች ትክክለኛውን መልስ ይምረጡ',
'sheet.tfHead':'ለሚከተሉት ጥያቄዎች በ ✓ ወይም ✗ ይመልሱ','sheet.footer':'መልካም ዕድል ይሁንላችሁ!',
'reports.title':'የወላጆች ሪፖርት — በአንድ ንክኪ','reports.student':'ተማሪ','reports.period':'ጊዜ',
'reports.thisWeek':'ይህ ሳምንት','reports.lastWeek':'ያለፈው ሳምንት','reports.thisMonth':'ይህ ወር',
'reports.generate':'ሪፖርቱን በአንድ ንክኪ ማዘጋጀት','reports.copy':'መቅዳት','reports.share':'ማጋራት',
'reports.copied':'ተቀድቷል ✓','reports.copyFail':'መቅዳት አልተቻለም','reports.shared':'ተጋርቷል ✓',
'reports.emptyPreview':'ሪፖርቱ እዚህ ይታያል…','reports.noData':'በዚህ ጊዜ መዝገብ አልተገኘም',
'reports.selectStudent':'— ተማሪ ይምረጡ —','reports.weekly':'ሳምንታዊ','reports.monthly':'ወርሃዊ',
'reports.weekN':'ሳምንት','reports.monthN':'ወር',
'reports.reportOf':'ይሄ የተማሪ {name} {p} የቂራአት ሪፖርት ነው።','reports.came':'መጥቷል',
'reports.notCome':'አልመጣም','reports.lateNone':'አንድም ደቂቃ አላረፈደም',
'reports.lateMin':'{n} ደቂቃ አርፍዷል','reports.bookYes':'ኪታብ ይዞ መጥቷል',
'reports.bookNo':'ኪታብ ሳይዝ ባዶ እጁን ነው የመጣው',
'reports.debtLine':'በዚህ {p} {d} ላይ {ty} መቅራት አምልጦታል።',
'reports.currentDebt':'አሁን ያለበት እዳ፦ መትን {m}፣ ሙጣለዐ {y}።',
'reports.examHeader':'ፈተና ከነበረ፦','reports.examResult':'ፈተና #{n}፦ {s} ከ{t} አምጥቷል።',
'reports.thanks':'ለትኩረታችሁና ለትብብራችሁ እናመሰግናለን።',
'settings.title':'ማስተካከያዎችና መለያዎች','settings.account':'መለያዬ',
'settings.signedInAs':'እንደ {u} ({r}) ገብተዋል','settings.curPass':'አሁን ያለው የመግቢያ ቃል',
'settings.newUser':'አዲስ የተጠቃሚ ስም','settings.newPass':'አዲስ የመግቢያ ቃል',
'settings.confirmPass':'የመግቢያ ቃል ማረጋገጫ','settings.updateAccount':'መረጃዬን ማዘመን',
'settings.wrongPass':'የመግቢያ ቃሉ ትክክል አይደለም!','settings.passMismatch':'የመግቢያ ቃሎቹ አይመሳሰሉም!',
'settings.shortPass':'የመግቢያ ቃሉ ቢያንስ 4 ፊደል መሆን አለበት።','settings.userNameTaken':'ይህ ስም አስቀድሞ ተወስዷል!',
'settings.updated':'መለያዎ ተዘምኗል ✓','settings.users':'ተጠቃሚዎችና ፈቃዶች','settings.role':'ፈቃድ',
'settings.roleAdmin':'አስተዳዳሪ — ሙሉ ፈቃድ','settings.roleTeacher':'መምህር — ያለ መለያ አስተዳደር',
'settings.addUser':'መለያ መጨመር','settings.userExists':'አስቀድሞ ያለ ስም ነው!',
'settings.userAdded':'መለያው ታክሏል ✓','settings.confirmDeleteUser':'ይህ መለያ ይጠፋል። ቀጥል?',
'settings.cantDeleteSelf':'ራስዎን መለያ ማጥፋት አይቻልም!','settings.userDeleted':'ተጠፍቷል',
'settings.sync':'የደመና ማስተሳሰር','settings.syncEndpoint':'የማስተሳሰሪያ አድራሻ (Backend API)',
'settings.syncKey':'የማስተሳሰር ቁልፍ','settings.autoSync':'በእያንዳንዱ ለውጥ ራስ-ሰር ማስተሳሰር',
'settings.syncNow':'አሁን አስተሳስር','settings.syncOk':'ተሳስሯል ✓','settings.syncFail':'ማስተሳሰር አልተቻለም!',
'settings.studyDays':'የትምህርት ቀኖች','settings.data':'መረጃዎች','settings.export':'ቅጂ ማውጣት (JSON)',
'settings.exported':'ቅጂው ተወርዷል ✓','settings.import':'ቅጂ ማስገባት','settings.imported':'ተገብቷል ✓ — ተጫን',
'settings.importFail':'ፋይሉ ትክክለኛ አይደለም!','settings.logout':'መውጣት',
'settings.reset':'መተግበሪያውን ማጥፋት','settings.confirmReset':'ሁሉም መረጃ ይጠፋል። በእውነት ቀጥል?',
'settings.lastSync':'የመጨረሻ ማስተሳሰር፦ {t}','settings.never':'አልተሳሰረም',
'lessons.add':'ቂራአት / ትምህርት መጨመር','lessons.title':'የቂራአት አስተዳደር',
'lessons.name':'የቂራአት ስም','lessons.namePh':'ምሳሌ፦ የጁዝርያ ቂራአት','lessons.book':'የኪታብ ስም',
'lessons.bookPh':'ምሳሌ፦ ጁዝርያ','lessons.create':'መጨመር','lessons.existing':'የነበሩ ቂራአቶች',
'lessons.confirmDelete':'ይህ ቂራአት በተማሪዎቹና በመዝገቡ ሙሉ በሙሉ ይጠፋል!',
'toast.saved':'ተመዝግቧል ✓','toast.deleted':'ተጠፍቷል','toast.error':'ስህተት ተከስቷል!'
},

/* ── العربية ── */
ar: {
'app.name':'إدارة القراءات',
'common.back':'رجوع','common.next':'التالي','common.cancel':'إلغاء','common.confirm':'تأكيد',
'common.yes':'نعم','common.no':'لا','common.close':'إغلاق','common.save':'حفظ','common.delete':'حذف',
'common.edit':'تعديل','common.date':'التاريخ','common.status':'الحالة','common.install':'تثبيت التطبيق',
'common.installed':'تم تثبيت التطبيق ✓','common.unknown':'(محذوف)','common.today':'اليوم',
'login.subtitle':'سجّل الدخول للمتابعة','login.username':'اسم المستخدم','login.password':'كلمة المرور',
'login.enter':'دخول','login.hint':'الحساب الافتراضي: kiar / 1111 — غيّره من الإعدادات',
'login.error':'اسم المستخدم أو كلمة المرور غير صحيحة!',
'setup.welcome':'مرحباً! لنجهّز درسك','setup.step1desc':'اختر أيام الدروس في الأسبوع',
'setup.teacher':'اسم المعلم','setup.teacherPh':'مثال: أبو بسميل','setup.center':'اسم الكتّاب / المركز (اختياري)',
'setup.centerPh':'مثال: مركز أنوار','setup.daysLabel':'أيام الدرس','setup.daysRequired':'اختر يوماً واحداً على الأقل!',
'setup.readingTitle':'أضف قراءتك / درسك الأول','setup.step2desc':'كل قراءة مستقلة تماماً بطلابها وسجلاتها',
'setup.readingName':'اسم القراءة / الدرس','setup.readingNamePh':'مثال: قراءة تحفة الأطفال',
'setup.nameRequired':'اسم القراءة مطلوب!','setup.bookName':'اسم الكتاب / المتن',
'setup.bookNamePh':'مثال: تحفة الأطفال','setup.mutalaCount':'عدد المطالعين في اليوم',
'setup.doneTitle':'جاهز! 🎉','setup.finish':'ابدأ!','setup.sumTeacher':'المعلم','setup.sumCenter':'المركز',
'setup.sumDays':'أيام الدرس','setup.sumReading':'القراءة','setup.sumBook':'الكتاب','setup.sumMutala':'مطالعو اليوم',
'day.0':'الأحد','day.1':'الاثنين','day.2':'الثلاثاء','day.3':'الأربعاء','day.4':'الخميس','day.5':'الجمعة','day.6':'السبت',
'sync.idle':'متزامن','sync.syncing':'جارٍ المزامنة…','sync.offline':'غير متصل','sync.error':'خطأ مزامنة',
'nav.students':'الطلاب','nav.attendance':'الحضور','nav.recitation':'المتن والمطالعة',
'nav.exams':'الاختبارات','nav.reports':'التقارير','nav.settings':'الإعدادات',
'students.title':'إدارة الطلاب','students.count':'طالب','students.addTitle':'إنشاء طالب جديد',
'students.name':'اسم الطالب','students.namePh':'مثال: محمد أحمد','students.father':'اسم الأب',
'students.fatherPh':'مثال: أحمد','students.phone':'هاتف الوالد / المتابع','students.phonePh':'+2519…',
'students.guardian':'صفة المتابع','students.gFather':'الأب','students.gMother':'الأم','students.gGuardian':'وصي',
'students.seq':'الرقم التسلسلي (تلقائي)','students.save':'إضافة الطالب','students.update':'تحديث',
'students.search':'بحث باسم الطالب…','students.empty':'لا يوجد طلاب بعد — أضف أول طالب 🌱',
'students.confirmDelete':'سيُحذف هذا الطالب نهائياً. متأكد؟','students.call':'اتصال',
'pdf.namesOnly':'أسماء فقط PDF','pdf.weekly':'تفاصيل أسبوعية PDF','pdf.monthly':'تفاصيل شهرية PDF',
'pdf.noStudents':'أضف طلاباً أولاً','pdf.done':'تم إنشاء PDF ✓','pdf.fail':'تعذّر إنشاء PDF',
'pdf.printFallback':'مكتبة PDF غير متاحة — سيُفتح نافذة الطباعة',
'attendance.title':'الحضور اليومي','attendance.saved':'محفوظ ✓',
'attendance.empty':'أضف طلاباً أولاً من قسم الطلاب','attendance.save':'حفظ حضور اليوم',
'attendance.present':'حضر','attendance.absent':'غاب','attendance.lateQ':'متأخر؟','attendance.mins':'دقيقة',
'attendance.bookYes':'معه الكتاب','attendance.bookNo':'خالي اليدين',
'attendance.autoDebtNote':'اليوم {n} من أصحاب الأدوار غابوا — سُجّل عليهم دين.',
'recitation.title':'المتن والمطالعة','recitation.matn':'قارئ المتن اليوم',
'recitation.matnSlot':'قراءة المتن — طالب واحد فقط اليوم','recitation.mutalaSlot':'المطالعة — طالب أو طالبان اليوم',
'recitation.mutalaPerDay':'عدد المطالعين في اليوم','recitation.debtTitle':'الديون المتراكمة',
'recitation.debtNote':'الدور ينتظر صاحب الدين كل يوم حتى يستوفيه.','recitation.debtEmpty':'لا ديون — بارك الله فيكم 🎉',
'recitation.queueTitle':'ترتيب الأدوار القادمة','recitation.historyTitle':'سجل القراءات','recitation.type':'النوع',
'recitation.matnType':'المتن','recitation.mutalaType':'المطالعة','recitation.readMatn':'قرأ المتن',
'recitation.readMutala':'طالع','recitation.missedBtn':'غاب ⚖️','recitation.statusDone':'تم',
'recitation.statusDebt':'دين','recitation.notStudyDay':'اليوم ليس يوم درس.','recitation.noStudents':'أضف طلاباً أولاً',
'recitation.alreadyMarked':'سُجّل لليوم مسبقاً.',
'exams.title':'الاختبارات','exams.create':'إنشاء اختبار PDF',
'exams.createHint':'صفحة واحدة أو صفحتان فقط — لن يتجاوزها أبداً، وإن قلّ المحتوى تمدّد ليملأها تماماً',
'exams.builderTitle':'صانع الاختبارات','exams.pages':'عدد الصفحات (بحد أقصى)','exams.number':'رقم الاختبار (تلقائي)',
'exams.book':'اسم الكتاب','exams.reading':'اسم القراءة','exams.secEssayHead':'أجب عن الأسئلة الآتية',
'exams.addEssay':'سؤال مقالي','exams.secMcqHead':'اختر الإجابة الصحيحة عن الأسئلة الآتية',
'exams.addMcq':'سؤال اختياري','exams.secTfHead':'أجب عن الأسئلة الآتية بصح أو خطأ',
'exams.addTf':'سؤال صح/خطأ','exams.preview':'معاينة','exams.generate':'توليد PDF',
'exams.questionPh':'اكتب السؤال هنا…','exams.optionPh':'الخيار…','exams.addOption':'＋ خيار',
'exams.noQuestions':'أضف سؤالاً واحداً على الأقل!','exams.emptyList':'لم تُنشئ اختبارات بعد',
'exams.qCount':'سؤال','exams.results':'النتائج','exams.resultScore':'الدرجة','exams.resultTotal':'من',
'exams.saveResults':'حفظ النتائج','exams.confirmDelete':'سيُحذف هذا الاختبار. متأكد؟',
'sheet.exam':'الاختبار رقم','sheet.name':'الاسم:','sheet.date':'التاريخ:','sheet.bookLabel':'الكتاب:',
'sheet.readingLabel':'القراءة:','sheet.essayHead':'أجب عن الأسئلة الآتية',
'sheet.mcqHead':'اختر الإجابة الصحيحة عن الأسئلة الآتية','sheet.tfHead':'أجب عن الأسئلة الآتية بصح أو خطأ',
'sheet.footer':'وبالتوفيق والسداد',
'reports.title':'تقارير الوالدين — بنقرة واحدة','reports.student':'الطالب','reports.period':'الفترة',
'reports.thisWeek':'هذا الأسبوع','reports.lastWeek':'الأسبوع الماضي','reports.thisMonth':'هذا الشهر',
'reports.generate':'تجهيز التقرير بنقرة واحدة','reports.copy':'نسخ','reports.share':'مشاركة',
'reports.copied':'تم النسخ ✓','reports.copyFail':'تعذّر النسخ','reports.shared':'تمت المشاركة ✓',
'reports.emptyPreview':'سيظهر التقرير هنا…','reports.noData':'لا سجلات في هذه الفترة',
'reports.selectStudent':'— اختر طالباً —','reports.weekly':'أسبوعي','reports.monthly':'شهري',
'reports.weekN':'الأسبوع','reports.monthN':'الشهر',
'reports.reportOf':'هذا {p} لقراءة الطالب {name}.','reports.came':'حضر','reports.notCome':'لم يحضر',
'reports.lateNone':'لم يتأخر ولو دقيقة','reports.lateMin':'تأخر {n} دقيقة','reports.bookYes':'جاء حاملاً الكتاب',
'reports.bookNo':'جاء خالي اليدين دون كتاب','reports.debtLine':'في هذا {p} يوم {d} غاب عن {ty}.',
'reports.currentDebt':'دينه الحالي: متن {m}، مطالعة {y}.','reports.examHeader':'الاختبارات:',
'reports.examResult':'اختبار #{n}: أحضر {s} من {t}.','reports.thanks':'لتركيزكم وتعاونكم نشكركم.',
'settings.title':'الإعدادات والحسابات','settings.account':'حسابي','settings.signedInAs':'مسجّل الدخول كـ {u} ({r})',
'settings.curPass':'كلمة المرور الحالية','settings.newUser':'اسم المستخدم الجديد','settings.newPass':'كلمة المرور الجديدة',
'settings.confirmPass':'تأكيد كلمة المرور','settings.updateAccount':'تحديث بياناتي','settings.wrongPass':'كلمة المرور الحالية غير صحيحة!',
'settings.passMismatch':'كلمتا المرور غير متطابقتين!','settings.shortPass':'كلمة المرور 4 أحرف على الأقل.',
'settings.userNameTaken':'هذا الاسم مستخدم مسبقاً!','settings.updated':'تم تحديث حسابك ✓',
'settings.users':'المستخدمون والصلاحيات','settings.role':'الصلاحية','settings.roleAdmin':'مدير — كل الصلاحيات',
'settings.roleTeacher':'معلم — بدون إدارة الحسابات','settings.addUser':'إضافة حساب','settings.userExists':'الاسم موجود مسبقاً!',
'settings.userAdded':'أُضيف الحساب ✓','settings.confirmDeleteUser':'سيُحذف هذا الحساب. متابعة؟',
'settings.cantDeleteSelf':'لا يمكنك حذف حسابك الحالي!','settings.userDeleted':'تم الحذف',
'settings.sync':'المزامنة السحابية','settings.syncEndpoint':'عنوان الخادم (Backend API)',
'settings.syncKey':'مفتاح المزامنة','settings.autoSync':'مزامنة تلقائية عند كل تغيير',
'settings.syncNow':'زامِن الآن','settings.syncOk':'تمت المزامنة ✓','settings.syncFail':'فشلت المزامنة!',
'settings.studyDays':'أيام الدرس','settings.data':'البيانات','settings.export':'تصدير نسخة (JSON)',
'settings.exported':'تم تنزيل النسخة ✓','settings.import':'استيراد نسخة','settings.imported':'تم الاستيراد ✓ — يُعاد التحميل',
'settings.importFail':'الملف غير صالح!','settings.logout':'تسجيل الخروج','settings.reset':'تصفير التطبيق',
'settings.confirmReset':'كل البيانات ستحذف. متأكد تماماً؟','settings.lastSync':'آخر مزامنة: {t}','settings.never':'لم تتم بعد',
'lessons.add':'إضافة قراءة / درس','lessons.title':'إدارة القراءات','lessons.name':'اسم القراءة',
'lessons.namePh':'مثال: قراءة الجزرية','lessons.book':'اسم الكتاب','lessons.bookPh':'مثال: الجزرية',
'lessons.create':'إضافة','lessons.existing':'القراءات الموجودة',
'lessons.confirmDelete':'ستُحذف هذه القراءة بكل طلابها وسجلاتها نهائياً!',
'toast.saved':'تم الحفظ ✓','toast.deleted':'تم الحذف','toast.error':'حدث خطأ!'
},

/* ── English ── */
en: {
'app.name':'Qiraat Manager',
'common.back':'Back','common.next':'Next','common.cancel':'Cancel','common.confirm':'Confirm',
'common.yes':'Yes','common.no':'No','common.close':'Close','common.save':'Save','common.delete':'Delete',
'common.edit':'Edit','common.date':'Date','common.status':'Status','common.install':'Install app',
'common.installed':'App installed ✓','common.unknown':'(deleted)','common.today':'Today',
'login.subtitle':'Sign in to continue','login.username':'Username','login.password':'Password',
'login.enter':'Sign in','login.hint':'Default account: kiar / 1111 — change it in Settings',
'login.error':'Wrong username or password!',
'setup.welcome':'Welcome! Let\u2019s set up your class','setup.step1desc':'Pick your study days',
'setup.teacher':'Teacher name','setup.teacherPh':'e.g. Abu Bismil','setup.center':'Kuttab / Center name (optional)',
'setup.centerPh':'e.g. Anwar Center','setup.daysLabel':'Study days','setup.daysRequired':'Pick at least one day!',
'setup.readingTitle':'Add your first reading','setup.step2desc':'Each reading is fully independent',
'setup.readingName':'Reading / lesson name','setup.readingNamePh':'e.g: Tuhfatul Atfal',
'setup.nameRequired':'Reading name is required!','setup.bookName':'Kitab / Matn name',
'setup.bookNamePh':'e.g. Tuhfatul Atfal','setup.mutalaCount':'Mutala\u2019a students per day',
'setup.doneTitle':'All set! 🎉','setup.finish':'Start!','setup.sumTeacher':'Teacher','setup.sumCenter':'Center',
'setup.sumDays':'Study days','setup.sumReading':'Reading','setup.sumBook':'Kitab','setup.sumMutala':'Daily mutala\u2019a',
'day.0':'Sunday','day.1':'Monday','day.2':'Tuesday','day.3':'Wednesday','day.4':'Thursday','day.5':'Friday','day.6':'Saturday',
'sync.idle':'Synced','sync.syncing':'Syncing…','sync.offline':'Offline','sync.error':'Sync error',
'nav.students':'Students','nav.attendance':'Attendance','nav.recitation':'Matn & Mutala\u2019a',
'nav.exams':'Exams','nav.reports':'Reports','nav.settings':'Settings',
'students.title':'Students','students.count':'students','students.addTitle':'Create new student',
'students.name':'Student name','students.namePh':'e.g. Mohammed Ahmed','students.father':'Father name',
'students.fatherPh':'e.g. Ahmed','students.phone':'Parent phone','students.phonePh':'+2519…',
'students.guardian':'Guardian','students.gFather':'Father','students.gMother':'Mother','students.gGuardian':'Wakil',
'students.seq':'Serial no. (auto)','students.save':'Add student','students.update':'Update',
'students.search':'Search by name…','students.empty':'No students yet — add the first one 🌱',
'students.confirmDelete':'This student will be permanently deleted. Sure?','students.call':'Call',
'pdf.namesOnly':'Names only PDF','pdf.weekly':'Weekly details PDF','pdf.monthly':'Monthly details PDF',
'pdf.noStudents':'Add students first','pdf.done':'PDF created ✓','pdf.fail':'Failed to create PDF',
'pdf.printFallback':'PDF lib unavailable — opening print dialog',
'attendance.title':'Daily attendance','attendance.saved':'Saved ✓',
'attendance.empty':'Add students in the Students tab first','attendance.save':'Save today\u2019s attendance',
'attendance.present':'Came','attendance.absent':'Absent','attendance.lateQ':'Late?','attendance.mins':'min',
'attendance.bookYes':'Has kitab','attendance.bookNo':'Empty-handed',
'attendance.autoDebtNote':'Today {n} turn-owners were absent — debt recorded.',
'recitation.title':'Matn & Mutala\u2019a','recitation.matn':'Today\u2019s matn reader',
'recitation.matnSlot':'Matn reading — only ONE student per day','recitation.mutalaSlot':'Mutala\u2019a — one or two students per day',
'recitation.mutalaPerDay':'Mutala\u2019a students per day','recitation.debtTitle':'Accumulated debts',
'recitation.debtNote':'The turn waits for the debtor daily until he settles it.',
'recitation.debtEmpty':'No debts — Barakallahu feekum! 🎉','recitation.queueTitle':'Upcoming turns',
'recitation.historyTitle':'Recitation log','recitation.type':'Type','recitation.matnType':'Matn',
'recitation.mutalaType':'Mutala\u2019a','recitation.readMatn':'Read the matn','recitation.readMutala':'Did mutala\u2019a',
'recitation.missedBtn':'Absent ⚖️','recitation.statusDone':'Done','recitation.statusDebt':'Debt',
'recitation.notStudyDay':'Today is not a study day.','recitation.noStudents':'Add students first',
'recitation.alreadyMarked':'Already marked for today.',
'exams.title':'Exams','exams.create':'Create exam PDF',
'exams.createHint':'One or two pages only — never more; small content expands to fill the page',
'exams.builderTitle':'Exam builder','exams.pages':'Pages (max)','exams.number':'Exam no. (auto)',
'exams.book':'Kitab name','exams.reading':'Reading name','exams.secEssayHead':'Answer the following questions',
'exams.addEssay':'Essay question','exams.secMcqHead':'Choose the correct answer for the following questions',
'exams.addMcq':'MCQ question','exams.secTfHead':'Answer the following questions with True or False',
'exams.addTf':'True/False question','exams.preview':'Preview','exams.generate':'Generate PDF',
'exams.questionPh':'Write the question…','exams.optionPh':'Option…','exams.addOption':'＋ Option',
'exams.noQuestions':'Add at least one question!','exams.emptyList':'No exams created yet',
'exams.qCount':'questions','exams.results':'Results','exams.resultScore':'Score','exams.resultTotal':'Out of',
'exams.saveResults':'Save results','exams.confirmDelete':'This exam will be deleted. Sure?',
'sheet.exam':'Exam No.','sheet.name':'Name:','sheet.date':'Date:','sheet.bookLabel':'Kitab:',
'sheet.readingLabel':'Reading:','sheet.essayHead':'Answer the following questions',
'sheet.mcqHead':'Choose the correct answer for the following questions',
'sheet.tfHead':'Answer the following questions with True or False','sheet.footer':'Good luck!',
'reports.title':'Parent reports — one tap','reports.student':'Student','reports.period':'Period',
'reports.thisWeek':'This week','reports.lastWeek':'Last week','reports.thisMonth':'This month',
'reports.generate':'Generate report in one tap','reports.copy':'Copy','reports.share':'Share',
'reports.copied':'Copied ✓','reports.copyFail':'Copy failed','reports.shared':'Shared ✓',
'reports.emptyPreview':'Report will appear here…','reports.noData':'No records in this period',
'reports.selectStudent':'— Select student —','reports.weekly':'weekly','reports.monthly':'monthly',
'reports.weekN':'week','reports.monthN':'month',
'reports.reportOf':'This is the {p} reading report of student {name}.','reports.came':'Attended',
'reports.notCome':'Absent','reports.lateNone':'Not late even a minute','reports.lateMin':'Late by {n} min',
'reports.bookYes':'Came with his kitab','reports.bookNo':'Came empty-handed without kitab',
'reports.debtLine':'On {d} this {p} he missed his {ty}.',
'reports.currentDebt':'Current debt: matn {m}, mutala\u2019a {y}.','reports.examHeader':'Exams:',
'reports.examResult':'Exam #{n}: scored {s} of {t}.','reports.thanks':'Thank you for your attention and cooperation.',
'settings.title':'Settings & accounts','settings.account':'My account',
'settings.signedInAs':'Signed in as {u} ({r})','settings.curPass':'Current password',
'settings.newUser':'New username','settings.newPass':'New password','settings.confirmPass':'Confirm password',
'settings.updateAccount':'Update my account','settings.wrongPass':'Current password is wrong!',
'settings.passMismatch':'Passwords do not match!','settings.shortPass':'Password must be 4+ characters.',
'settings.userNameTaken':'This username is taken!','settings.updated':'Account updated ✓',
'settings.users':'Users & permissions','settings.role':'Role','settings.roleAdmin':'Admin — full access',
'settings.roleTeacher':'Teacher — no account management','settings.addUser':'Add account',
'settings.userExists':'Username already exists!','settings.userAdded':'Account added ✓',
'settings.confirmDeleteUser':'This account will be deleted. Continue?','settings.cantDeleteSelf':'You can\u2019t delete your own account!',
'settings.userDeleted':'Deleted','settings.sync':'Cloud sync','settings.syncEndpoint':'Sync endpoint (Backend API)',
'settings.syncKey':'Sync key','settings.autoSync':'Auto-sync on every change','settings.syncNow':'Sync now',
'settings.syncOk':'Synced ✓','settings.syncFail':'Sync failed!','settings.studyDays':'Study days',
'settings.data':'Data','settings.export':'Export backup (JSON)','settings.exported':'Backup downloaded ✓',
'settings.import':'Import backup','settings.imported':'Imported ✓ — reloading','settings.importFail':'Invalid file!',
'settings.logout':'Log out','settings.reset':'Reset app','settings.confirmReset':'ALL data will be erased. Absolutely sure?',
'settings.lastSync':'Last sync: {t}','settings.never':'Never',
'lessons.add':'Add reading / lesson','lessons.title':'Manage readings','lessons.name':'Reading name',
'lessons.namePh':'e.g. Jazariyyah','lessons.book':'Kitab name','lessons.bookPh':'e.g. Jazariyyah',
'lessons.create':'Add','lessons.existing':'Existing readings',
'lessons.confirmDelete':'This reading with all its students and records will be deleted!',
'toast.saved':'Saved ✓','toast.deleted':'Deleted','toast.error':'An error occurred!'
}
};

let LANG = 'am';
const t = (k, vars = {}) => {
  let s = (I18N[LANG] && I18N[LANG][k]) ?? I18N.en[k] ?? k;
  for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
  return s;
};

/* ───────────── (3) الحالة والتخزين ───────────── */
let state = null;

function defaultState() {
  return {
    _v: 1,
    users: [{ id: uid(), username: 'kiar', password: '1111', role: 'admin', created: todayStr() }],
    settings: {
      lang: 'am', initialized: false, teacherName: '', centerName: '',
      studyDays: [0, 1, 2, 3, 4], autoSync: true, syncEndpoint: '', syncKey: '', lastSync: null
    },
    lessons: [], currentLessonId: null
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      state = Object.assign(defaultState(), JSON.parse(raw));
      state.settings = Object.assign(defaultState().settings, state.settings);
      return;
    }
  } catch (e) { console.warn('state corrupted, resetting', e); }
  state = defaultState();
}
function saveState(schedule = true) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { console.warn(e); }
  if (schedule && state.settings.autoSync && state.settings.initialized) scheduleSync();
}
const cur = () => state.lessons.find(l => l.id === state.currentLessonId) || state.lessons[0] || null;
const studentName = (L, id) => { const s = L.students.find(x => x.id === id); return s ? s.name : t('common.unknown'); };
const currentUser = () => state.users.find(u => u.username === localStorage.getItem(SESS)) || null;
const isAdmin = () => (currentUser() || {}).role === 'admin';

function newLesson(name, book, mutala) {
  return {
    id: uid(), name, bookName: book || '', mutalaPerDay: mutala || 2,
    students: [], attendance: {}, exams: [],
    rec: { matnQueue: [], mutalaQueue: [], debts: {}, history: [] }
  };
}

/* ───────────── (4) المزامنة السحابية ───────────── */
let syncTimer = null, syncBusy = false;

function setSyncStatus(st) {
  const p = $('#syncStatus'); if (!p) return;
  p.dataset.state = st;
  $('.sync-txt', p).textContent = t('sync.' + st);
}
function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(false), 1600);
}
async function syncNow(manual = false) {
  if (syncBusy) return; syncBusy = true;
  setSyncStatus('syncing');
  try {
    const ep = (state.settings.syncEndpoint || '').trim();
    if (ep) {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Key': state.settings.syncKey || '' },
        body: JSON.stringify(state)
      });
      if (!res.ok) throw 0;
    } else {
      localStorage.setItem(CLOUD, JSON.stringify(state));   // محاكاة سحابية محلية
      await new Promise(r => setTimeout(r, 650));
    }
    state.settings.lastSync = Date.now();
    saveState(false); setSyncStatus('idle'); updateLastSync();
    if (manual) toast(t('settings.syncOk'));
  } catch (e) {
    setSyncStatus('error');
    if (manual) toast(t('settings.syncFail'), 'err');
  }
  syncBusy = false;
}
function updateLastSync() {
  const el = $('#lastSyncTime'); if (!el) return;
  el.textContent = t('settings.lastSync', {
    t: state.settings.lastSync ? new Date(state.settings.lastSync).toLocaleString() : t('settings.never')
  });
}

/* ───────────── (5) النوافذ والإشعارات ───────────── */
function toast(msg, type = 'ok') {
  const w = $('#toastWrap'); if (!w) return;
  const d = document.createElement('div');
  d.className = 'toast toast--' + type;
  d.textContent = msg;
  w.appendChild(d);
  setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 350); }, 2700);
}
function openModal(title, html) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = html;
  $('#modalBackdrop').hidden = false;
}
function closeModal() { $('#modalBackdrop').hidden = true; }
function confirmDlg(msg, onYes, danger = true) {
  openModal(t('common.confirm'), `
    <p class="muted" style="font-size:var(--fs-s)">${esc(msg)}</p>
    <div class="modal-actions">
      <button class="btn btn--ghost" id="mNo">${t('common.cancel')}</button>
      <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" id="mYes">${t('common.yes')}</button>
    </div>`);
  $('#mNo').onclick = closeModal;
  $('#mYes').onclick = () => { closeModal(); onYes(); };
}

/* ───────────── (6) تطبيق الترجمة ───────────── */
function applyI18n() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = (LANG === 'ar') ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(n => {
    const s = I18N[LANG][n.dataset.i18n];
    if (s != null) n.textContent = s;
  });
  $$('[data-i18n-placeholder]').forEach(n => {
    const s = I18N[LANG][n.dataset.i18nPlaceholder];
    if (s != null) n.placeholder = s;
  });
  $$('[data-i18n-title]').forEach(n => {
    const s = I18N[LANG][n.dataset.i18nTitle];
    if (s != null) n.title = s;
  });
  setSyncStatus(($('#syncStatus') || {}).dataset?.state || 'idle');
}
function setLang(l) {
  if (!I18N[l]) return;
  LANG = l; state.settings.lang = l; saveState(false);
  applyI18n();
  $('#langSelect').value = l;
  $$('.lang-mini').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  if (!$('#appScreen').hidden) renderAll();
}

/* ───────────── (7) شاشات الدخول/التهيئة ───────────── */
function showLogin() {
  $('#loginScreen').hidden = false; $('#setupScreen').hidden = true; $('#appScreen').hidden = true;
}
function showSetup() {
  $('#loginScreen').hidden = true; $('#setupScreen').hidden = false; $('#appScreen').hidden = true;
  setupStep = 1; updateSetupUI();
}
function showApp() {
  $('#loginScreen').hidden = true; $('#setupScreen').hidden = true; $('#appScreen').hidden = false;
  applyRole(); renderAll();
  setSyncStatus(navigator.onLine ? 'idle' : 'offline');
}

/* معالج الدخول */
function bindLogin() {
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const u = $('#loginUsername').value.trim();
    const p = $('#loginPassword').value;
    const user = state.users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);
    const err = $('#loginError');
    if (!user) { err.hidden = false; err.textContent = t('login.error'); return; }
    err.hidden = true;
    localStorage.setItem(SESS, user.username);
    $('#loginUsername').value = ''; $('#loginPassword').value = '';
    showApp();
  });
  $('#togglePass').onclick = () => {
    const inp = $('#loginPassword');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  };
  $$('.lang-mini').forEach(b => b.onclick = () => setLang(b.dataset.lang));
}

/* ───────────── (8) خطوات التهيئة ───────────── */
let setupStep = 1;
function updateSetupUI() {
  $$('.setup-step').forEach(s => s.hidden = +s.dataset.step !== setupStep);
  $$('.setup-progress .dot').forEach(d => d.classList.toggle('active', +d.dataset.dot <= setupStep));
  $('#setupBack').hidden = setupStep === 1;
  $('#setupNext').textContent = setupStep === 3 ? t('setup.finish') : t('common.next');
}
function buildSetupSummary() {
  const days = getDays($('#daysPicker')).map(d => t('day.' + d)).join(' ، ');
  const mc = $('.active', $('#setupMutalaCount'));
  $('#setupSummary').innerHTML = [
    ['setup.sumTeacher', $('#setupTeacher').value.trim() || '—'],
    ['setup.sumCenter',  $('#setupCenter').value.trim()  || '—'],
    ['setup.sumDays',    days],
    ['setup.sumReading', $('#setupReadingName').value.trim()],
    ['setup.sumBook',    $('#setupBookName').value.trim() || '—'],
    ['setup.sumMutala',  mc ? mc.dataset.count : '2']
  ].map(([k, v]) => `<li><b>${t(k)}:</b> ${esc(v)}</li>`).join('');
}
function bindSetup() {
  $('#setupNext').onclick = () => {
    if (setupStep === 1) {
      if (!getDays($('#daysPicker')).length) return toast(t('setup.daysRequired'), 'err');
      setupStep = 2;
    } else if (setupStep === 2) {
      if (!$('#setupReadingName').value.trim()) return toast(t('setup.nameRequired'), 'err');
      buildSetupSummary(); setupStep = 3;
    } else {
      const mc = $('.active', $('#setupMutalaCount'));
      state.settings.teacherName = $('#setupTeacher').value.trim();
      state.settings.centerName  = $('#setupCenter').value.trim();
      state.settings.studyDays   = getDays($('#daysPicker'));
      const L = newLesson($('#setupReadingName').value.trim(), $('#setupBookName').value.trim(),
                           mc ? +mc.dataset.count : 2);
      state.lessons.push(L);
      state.currentLessonId = L.id;
      state.settings.initialized = true;
      saveState(); showApp();
      toast(t('toast.saved'));
      return;
    }
    updateSetupUI();
  };
  $('#setupBack').onclick = () => {
    if (setupStep > 1) { setupStep--; updateSetupUI(); }
  };
}
const getDays = container => $$('.day-chip.active', container).map(b => +b.dataset.day);
function bindDaysPicker(container, getInitial, onChange) {
  $$('.day-chip', container).forEach(b => {
    b.classList.toggle('active', getInitial().includes(+b.dataset.day));
    b.onclick = () => {
      const set = new Set(getDays(container));
      const d = +b.dataset.day;
      set.has(d) ? set.delete(d) : set.add(d);
      $$('.day-chip', container).forEach(x => x.classList.toggle('active', set.has(+x.dataset.day)));
      onChange([...set]);
    };
  });
}

/* ───────────── (9) الدروس / القراءات ───────────── */
function renderLessonsUI() {
  const sel = $('#lessonSelect');
  const prev = state.currentLessonId;
  sel.innerHTML = state.lessons.map(L => `<option value="${L.id}">${esc(L.name)}</option>`).join('');
  if (prev && state.lessons.some(L => L.id === prev)) sel.value = prev;
  const L = cur();
  $('#brandLessonName').textContent = L ? L.name : '—';
  setSeg($('#settingsMutalaSeg'), L ? L.mutalaPerDay : 2, 'count');
}
function switchLesson(id) {
  if (!state.lessons.some(L => L.id === id)) return;
  state.currentLessonId = id; saveState();
  renderAll();
}
function openLessonModal() {
  const L = cur();
  openModal(t('lessons.title'), `
    <div class="field"><label>${t('lessons.name')}</label>
      <input id="mLName" placeholder="${t('lessons.namePh')}"></div>
    <div class="field"><label>${t('lessons.book')}</label>
      <input id="mLBook" placeholder="${t('lessons.bookPh')}"></div>
    <div class="field"><label>${t('setup.mutalaCount')}</label>
      <div class="seg" id="mLSeg">
        <button type="button" data-count="1">1</button>
        <button type="button" data-count="2" class="active">2</button>
      </div></div>
    <div class="modal-actions">
      <button class="btn btn--ghost" id="mLCancel">${t('common.cancel')}</button>
      <button class="btn btn--primary" id="mLOk">${t('lessons.create')}</button>
    </div>
    ${isAdmin() && state.lessons.length ? `
      <h4 class="card-title" style="font-size:var(--fs-s)">${t('lessons.existing')}</h4>
      <div id="mLList">${state.lessons.map(x => `
        <div class="queue-item" style="margin-bottom:.4rem">
          <span class="queue-day">${esc(x.name)}</span>
          <span class="qtag qtag--mutala">${x.students.length} ${t('students.count')}</span>
          <span style="flex:1"></span>
          <button class="q-remove" data-del="${x.id}" title="${t('common.delete')}">🗑</button>
        </div>`).join('')}
      </div>` : ''}
  `);
  $('#mLSeg').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', $('#mLSeg')).forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  };
  $('#mLCancel').onclick = closeModal;
  $('#mLOk').onclick = () => {
    const name = $('#mLName').value.trim();
    if (!name) return toast(t('setup.nameRequired'), 'err');
    const mc = +$('.active', $('#mLSeg')).dataset.count;
    const NL = newLesson(name, $('#mLBook').value.trim(), mc);
    state.lessons.push(NL);
    state.currentLessonId = NL.id;
    saveState(); closeModal(); renderAll();
    toast(t('toast.saved'));
  };
  const lst = $('#mLList');
  if (lst) lst.onclick = e => {
    const b = e.target.closest('[data-del]'); if (!b) return;
    const del = b.dataset.del;
    confirmDlg(t('lessons.confirmDelete'), () => {
      state.lessons = state.lessons.filter(x => x.id !== del);
      if (state.currentLessonId === del) state.currentLessonId = state.lessons[0]?.id || null;
      saveState(); closeModal(); renderAll();
      toast(t('toast.deleted'));
    });
  };
}

/* ───────────── (10) الطلاب ───────────── */
const GUARD_KEY = { father: 'students.gFather', mother: 'students.gMother', guardian: 'students.gGuardian' };

function nextSeq(L) { return L.students.reduce((m, s) => Math.max(m, s.seq), 0) + 1; }

function renderStudents() {
  const L = cur(); if (!L) return;
  const q = ($('#studentSearch').value || '').trim().toLowerCase();
  const list = L.students.filter(s => (s.name + ' ' + s.father).toLowerCase().includes(q));
  $('#studentsCount').textContent = L.students.length;
  $('#studentSeq').value = nextSeq(L);
  $('#studentsEmpty').hidden = L.students.length > 0;
  $('#studentsList').innerHTML = list.map(s => `
    <div class="student-card">
      <div class="st-top">
        <span class="st-seq">${s.seq}</span>
        <div class="st-name">${esc(s.name)}<span class="st-father">${esc(s.father)}</span></div>
      </div>
      <div class="st-meta">
        <span>📞 ${esc(s.phone)}</span>
        <span class="st-guard">${t(GUARD_KEY[s.guardian] || 'students.gFather')}</span>
      </div>
      <div class="st-actions">
        <a class="st-btn st-btn--call" href="tel:${esc(s.phone)}">📞 ${t('students.call')}</a>
        <button class="st-btn st-btn--edit" data-act="edit" data-id="${s.id}">✏️ ${t('common.edit')}</button>
        <button class="st-btn st-btn--del" data-act="del" data-id="${s.id}">🗑 ${t('common.delete')}</button>
      </div>
    </div>`).join('');
}
function startEditStudent(id) {
  const L = cur(); const s = L.students.find(x => x.id === id); if (!s) return;
  $('#studentEditId').value = id;
  $('#studentName').value = s.name;
  $('#studentFather').value = s.father;
  $('#studentPhone').value = s.phone;
  $('#studentGuardian').value = s.guardian;
  $('#studentSeq').value = s.seq;
  $('#studentCancel').hidden = false;
  $('#studentSubmit').textContent = t('students.update');
  $('#studentName').focus();
}
function resetStudentForm() {
  $('#addStudentForm').reset();
  $('#studentEditId').value = '';
  $('#studentCancel').hidden = true;
  $('#studentSubmit').textContent = t('students.save');
  renderStudents();
}
function deleteStudent(id) {
  const L = cur();
  const R = L.rec || {};
  if (R.matnQueue)  R.matnQueue  = R.matnQueue.filter(x => x !== id);
  if (R.mutalaQueue) R.mutalaQueue = R.mutalaQueue.filter(x => x !== id);
  if (R.debts) delete R.debts[id];
  L.students = L.students.filter(s => s.id !== id);
  for (const d in L.attendance) { delete L.attendance[d][id]; if (!Object.keys(L.attendance[d]).length) delete L.attendance[d]; }
  saveState(); renderStudents(); renderAttendance(); renderRecitation(); renderReportSelects();
  toast(t('toast.deleted'));
}
function bindStudents() {
  $('#addStudentForm').addEventListener('submit', e => {
    e.preventDefault();
    const L = cur();
    const name = $('#studentName').value.trim();
    const father = $('#studentFather').value.trim();
    const phone = $('#studentPhone').value.trim();
    const guardian = $('#studentGuardian').value;
    if (!name || !father || !phone) return toast(t('toast.error'), 'err');
    const editId = $('#studentEditId').value;
    if (editId) {
      const s = L.students.find(x => x.id === editId);
      if (s) Object.assign(s, { name, father, phone, guardian });
    } else {
      L.students.push({ id: uid(), seq: nextSeq(L), name, father, phone, guardian });
    }
    saveState(); resetStudentForm();
    renderAttendance(); renderRecitation(); renderReportSelects();
    toast(t('toast.saved'));
  });
  $('#studentCancel').onclick = resetStudentForm;
  $('#studentSearch').addEventListener('input', renderStudents);
  $('#studentsList').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    if (b.dataset.act === 'edit') startEditStudent(b.dataset.id);
    if (b.dataset.act === 'del') confirmDlg(t('students.confirmDelete'), () => deleteStudent(b.dataset.id));
  });
}

/* ───────────── (11) الحضور اليومي ───────────── */
function attDefault() { return { present: true, late: false, lateMin: 0, book: true }; }

function renderAttendance() {
  const L = cur(); if (!L) return;
  let date = $('#attendanceDate').value || todayStr();
  $('#attendanceDate').value = date;
  const d = parseD(date);
  $('#attendanceDayName').textContent = t('day.' + d.getDay()) + ' ' + fmtDM(date);
  const dayRec = L.attendance[date] || {};
  $('#attendanceList').innerHTML = L.students.map(s => {
    const r = dayRec[s.id] || attDefault();
    return `
    <div class="att-row ${r.present ? '' : 'is-absent'}" data-id="${s.id}">
      <div class="att-info">
        <span class="att-seq">${s.seq}</span>
        <span class="att-name">${esc(s.name)}</span>
        <span class="att-father">${esc(s.father)}</span>
      </div>
      <div class="att-controls-row">
        <div class="seg-att">
          <button type="button" class="att-opt att-opt--present ${r.present ? 'active' : ''}" data-val="present">✅ ${t('attendance.present')}</button>
          <button type="button" class="att-opt att-opt--absent ${r.present ? '' : 'active'}" data-val="absent">❌ ${t('attendance.absent')}</button>
        </div>
        <div class="late-block" data-on="${!!r.late}">
          <button type="button" class="late-toggle ${r.late ? 'active' : ''}">⏰ ${t('attendance.lateQ')}</button>
          <input type="number" class="late-mins" min="1" max="600" value="${r.lateMin || ''}" placeholder="${t('attendance.mins')}">
        </div>
        <div class="book-block">
          <button type="button" class="book-toggle ${r.book ? 'active' : ''}" data-val="yes">📚 ${t('attendance.bookYes')}</button>
          <button type="button" class="book-toggle ${r.book ? '' : 'active'}" data-val="no">🖐 ${t('attendance.bookNo')}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  $('#attendanceEmpty').hidden = !!L.students.length;
  updateAttStats();
}
function updateAttStats() {
  const L = cur(); if (!L) return;
  const date = $('#attendanceDate').value;
  const recs = Object.values(L.attendance[date] || {});
  $('#attPresentCount').textContent = recs.filter(r => r.present).length;
  $('#attAbsentCount').textContent  = recs.filter(r => !r.present).length;
  $('#attLateCount').textContent    = recs.filter(r => r.present && r.late).length;
  $('#attNoBookCount').textContent  = recs.filter(r => r.present && !r.book).length;
}
function attRowRecord(sid) {
  const L = cur(); const date = $('#attendanceDate').value;
  L.attendance[date] = L.attendance[date] || {};
  L.attendance[date][sid] = L.attendance[date][sid] || attDefault();
  return L.attendance[date][sid];
}
function bindAttendance() {
  $('#attendanceDate').addEventListener('change', renderAttendance);
  $('#attPrevDay').onclick = () => { shiftAttDate(-1); };
  $('#attNextDay').onclick = () => { shiftAttDate(1); };
  $('#attendanceList').addEventListener('click', e => {
    const row = e.target.closest('.att-row'); if (!row) return;
    const r = attRowRecord(row.dataset.id);
    const opt = e.target.closest('.att-opt');
    const lt  = e.target.closest('.late-toggle');
    const bt  = e.target.closest('.book-toggle');
    if (opt) {
      r.present = opt.dataset.val === 'present';
      if (!r.present) { r.late = false; r.book = true; }
    } else if (lt) {
      r.late = !r.late;
      if (r.late && !r.lateMin) r.lateMin = 5;
    } else if (bt) {
      r.book = bt.dataset.val === 'yes';
    } else return;
    saveState(); renderAttendance();
  });
  $('#attendanceList').addEventListener('input', e => {
    if (!e.target.classList.contains('late-mins')) return;
    const row = e.target.closest('.att-row'); if (!row) return;
    const r = attRowRecord(row.dataset.id);
    r.lateMin = Math.max(0, +e.target.value || 0);
    saveState(false);
  });
  $('#saveAttendanceBtn').onclick = () => {
    const date = $('#attendanceDate').value;
    /* تسجيل دين تلقائي لأصحاب الأدوار الغائبين اليوم */
    if (date === todayStr()) {
      const n = autoDebt(date);
      if (n) { renderRecitation(); toast(t('attendance.autoDebtNote', { n }), 'info'); }
    }
    saveState();
    $('#attendanceSavedBadge').hidden = false;
    setTimeout(() => { $('#attendanceSavedBadge').hidden = true; }, 2200);
    syncNow(false);
  };
}
function shiftAttDate(delta) {
  const d = parseD($('#attendanceDate').value || todayStr());
  d.setDate(d.getDate() + delta);
  $('#attendanceDate').value = dstr(d);
  renderAttendance();
}

/* ───────────── (12) محرك المتن والمطالعة (نظام الدين) ───────────── */
/*
 * الفكرة: طابوران (متن + مطالعة) لكل قراءة.
 * - المتن: صاحب رأس الطابور هو قارئ اليوم (طالب واحد فقط).
 * - المطالعة: أول K من الطابور (K = 1 أو 2).
 * - إذا غاب صاحب الدور: يبقى في رأس الطابور ويتضاعف "دينه" يوماً بعد يوم.
 * - إذا حضر وقرأ: ينقص دينه. إذا صار صفراً يخرج من الطابور (ثم يعود
 *   في نهايته تلقائياً عند دورة جديدة). الدور لا يتجاوز صاحب الدين أبداً.
 */
function ensureQueues(L) {
  if (!L.rec) L.rec = { matnQueue: [], mutalaQueue: [], debts: {}, history: [] };
  const R = L.rec;
  R.matnQueue = R.matnQueue || []; R.mutalaQueue = R.mutalaQueue || [];
  R.debts = R.debts || {}; R.history = R.history || [];
  const ids = L.students.map(s => s.id);
  R.matnQueue  = R.matnQueue.filter(id => ids.includes(id));
  R.mutalaQueue = R.mutalaQueue.filter(id => ids.includes(id));
  for (const id in R.debts) if (!ids.includes(id)) delete R.debts[id];
  for (const id of ids) {                       // الطلاب الجدد يلتحقون بآخر الطابور
    if (!R.matnQueue.includes(id))  R.matnQueue.push(id);
    if (!R.mutalaQueue.includes(id)) R.mutalaQueue.push(id);
  }
}
const matnCandidates   = L => L.rec.matnQueue.length ? [L.rec.matnQueue[0]] : [];
const mutalaCandidates = L => L.rec.mutalaQueue.slice(0, L.mutalaPerDay || 2);
const resolvedToday = (L, type, sid, date) =>
  L.rec.history.some(h => h.date === date && h.type === type && h.sid === sid);

function markRecitation(type, sid, status, date = todayStr(), silent = false) {
  const L = cur(); ensureQueues(L); const R = L.rec;
  if (resolvedToday(L, type, sid, date)) { if (!silent) toast(t('recitation.alreadyMarked'), 'err'); return false; }
  R.history.push({ date, type, sid, status });
  R.debts[sid] = R.debts[sid] || { matn: 0, mutala: 0 };
  const d = R.debts[sid];
  if (status === 'debt') {
    d[type]++;                                   // الغياب → يتضاعف الدين
  } else {                                       // قرأ/طالع → ينقص الدين
    d[type] = Math.max(0, d[type] - 1);
    if (d[type] === 0) {
      const q = type === 'matn' ? R.matnQueue : R.mutalaQueue;
      const i = q.indexOf(sid);
      if (i > -1) q.splice(i, 1);                // استوفى → يخرج من الطابور
      if (!d.matn && !d.mutala) delete R.debts[sid];
    }
  }
  saveState();
  if (!silent) { renderRecitation(); toast(t('toast.saved')); }
  return true;
}
function autoDebt(date) {
  const L = cur(); ensureQueues(L);
  let n = 0;
  const day = L.attendance[date] || {};
  const check = (type, cands) => {
    for (const sid of cands) {
      const r = day[sid];
      if (r && r.present === false && !resolvedToday(L, type, sid, date)) {
        if (markRecitation(type, sid, 'debt', date, true)) n++;
      }
    }
  };
  check('matn',   matnCandidates(L));
  check('mutala', mutalaCandidates(L));
  return n;
}
function nextStudyDates(offset, n) {
  const out = []; const d = new Date();
  d.setDate(d.getDate() + offset);
  const sd = state.settings.studyDays.length ? state.settings.studyDays : [0,1,2,3,4,5,6];
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    if (sd.includes(d.getDay())) out.push(dstr(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function slotHTML(L, type, sid, date) {
  const s = L.students.find(x => x.id === sid); if (!s) return '';
  const ev = L.rec.history.find(h => h.date === date && h.type === type && h.sid === sid);
  let statusHtml;
  if (ev) {
    statusHtml = ev.status === 'done'
      ? `<span class="slot-status slot-status--done">✅ ${t('recitation.statusDone')}</span>`
      : `<span class="slot-status slot-status--debt">⚖️ ${t('recitation.statusDebt')}</span>`;
  } else {
    statusHtml = `
      <div class="slot-actions">
        <button type="button" class="slot-btn slot-btn--done" data-type="${type}" data-sid="${sid}" data-st="done">
          ✅ ${t(type === 'matn' ? 'recitation.readMatn' : 'recitation.readMutala')}
        </button>
        <button type="button" class="slot-btn slot-btn--debt" data-type="${type}" data-sid="${sid}" data-st="debt">
          ${t('recitation.missedBtn')}
        </button>
      </div>`;
  }
  return `
  <div class="slot-item ${ev ? (ev.status === 'done' ? 'done' : 'debt') : ''}">
    <span class="slot-idx">${s.seq}</span>
    <span class="slot-student">${esc(s.name)}</span>
    ${statusHtml}
  </div>`;
}
function renderRecitation() {
  const L = cur(); if (!L) return;
  ensureQueues(L); const R = L.rec;
  const date = todayStr(); const d = new Date();
  $('#recitationDate').textContent = t('day.' + d.getDay()) + ' — ' + fmtDM(date);

  const mC = matnCandidates(L);
  $('#matnTodayName').textContent = mC.length ? studentName(L, mC[0]) : '—';
  const note = state.settings.studyDays.includes(d.getDay())
    ? '' : `<p class="muted">⚠️ ${t('recitation.notStudyDay')}</p>`;
  $('#matnSlot').innerHTML =
    (mC.length ? mC.map(sid => slotHTML(L, 'matn', sid, date)).join('') : `<p class="empty">${t('recitation.noStudents')}</p>`) + note;

  const k = L.mutalaPerDay || 2;
  const uC = mutalaCandidates(L);
  $('#mutalaSlots').innerHTML =
    uC.length ? uC.map(sid => slotHTML(L, 'mutala', sid, date)).join('') : `<p class="empty">${t('recitation.noStudents')}</p>`;
  setSeg($('#mutalaPerDaySeg'), k, 'count');

  renderDebts(); renderQueuePreview(); renderRecHistory();
}
function renderDebts() {
  const L = cur(); const R = L.rec;
  const entries = Object.entries(R.debts).filter(([, d]) => d.matn > 0 || d.mutala > 0);
  $('#debtCount').textContent = entries.length;
  $('#debtEmpty').hidden = entries.length > 0;
  $('#debtList').innerHTML = entries.map(([sid, d]) => {
    const s = L.students.find(x => x.id === sid); if (!s) return '';
    const chips =
      (d.matn > 0 ? `<span class="debt-type matn">${t('recitation.matnType')} ×${d.matn}</span>` : '') +
      (d.mutala > 0 ? `<span class="debt-type mutala">${t('recitation.mutalaType')} ×${d.mutala}</span>` : '');
    return `
    <div class="debt-item">
      <span class="slot-idx">${s.seq}</span>
      <span class="debt-student">${esc(s.name)}</span>
      ${chips}
    </div>`;
  }).join('') + (entries.length ? `<p class="muted">${t('recitation.debtNote')}</p>` : '');
}
function renderQueuePreview() {
  const L = cur(); ensureQueues(L);
  const mq = [...L.rec.matnQueue], uq = [...L.rec.mutalaQueue], k = L.mutalaPerDay || 2;
  const dates = nextStudyDates(1, 6);
  $('#queuePreview').innerHTML = dates.map(ds => {
    const d = parseD(ds);
    const mn = mq.length ? mq[0] : null;
    if (mn) mq.push(mq.shift());                        // قرأ → يدور للنهاية
    const us = [];
    for (let i = 0; i < k && uq.length; i++) us.push(uq.shift());
    uq.push(...us);
    return `
    <div class="queue-item">
      <span class="queue-day">${t('day.' + d.getDay())} ${fmtDM(ds)}</span>
      <div class="queue-tags">
        <span class="qtag qtag--matn">📜 ${mn ? esc(studentName(L, mn)) : '—'}</span>
        <span class="qtag qtag--mutala">🔁 ${us.map(id => esc(studentName(L, id))).join(' ، ') || '—'}</span>
      </div>
    </div>`;
  }).join('') || `<p class="empty">${t('recitation.noStudents')}</p>`;
}
function renderRecHistory() {
  const L = cur();
  const rows = (L.rec.history || []).slice(-60).reverse().map(h => {
    const s = L.students.find(x => x.id === h.sid);
    return `
    <tr>
      <td>${fmtDM(h.date)}</td>
      <td>${t(h.type === 'matn' ? 'recitation.matnType' : 'recitation.mutalaType')}</td>
      <td>${esc(s ? s.name : t('common.unknown'))}</td>
      <td>${h.status === 'done'
        ? `<span class="chip chip--green">✅ ${t('recitation.statusDone')}</span>`
        : `<span class="chip chip--amber">⚖️ ${t('recitation.statusDebt')}</span>`}</td>
    </tr>`;
  }).join('');
  $('#recitationHistoryBody').innerHTML = rows ||
    `<tr><td colspan="4" style="text-align:center;color:var(--muted)">—</td></tr>`;
}
function bindRecitation() {
  const slotClick = e => {
    const b = e.target.closest('.slot-btn'); if (!b) return;
    markRecitation(b.dataset.type, b.dataset.sid, b.dataset.st);
  };
  $('#matnSlot').addEventListener('click', slotClick);
  $('#mutalaSlots').addEventListener('click', slotClick);
  $('#mutalaPerDaySeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const L = cur(); if (!L) return;
    L.mutalaPerDay = +b.dataset.count;
    saveState(); renderRecitation();
  });
}

/* ───────────── (13) الاختبارات + ورقة A4 بالتمدد التلقائي ───────────── */
const MCQ_LETTERS = ['(أ)', '(ب)', '(ج)', '(د)', '(هـ)'];
let previewSheet = null;

function setSeg(container, val, attr) {
  $$('button', container).forEach(b => b.classList.toggle('active', String(b.dataset[attr]) === String(val)));
}
function builderPages() { return +($('.active', $('#examPagesSeg')).dataset.pages); }

function qEssayRow() {
  return `<div class="q-row q-row--essay">
    <span class="q-idx">•</span>
    <textarea class="q-text" rows="2" placeholder="${t('exams.questionPh')}"></textarea>
    <button type="button" class="q-remove" title="${t('common.delete')}">🗑</button>
  </div>`;
}
function optRow(i) {
  return `<div class="opt-row"><span class="opt-letter">${MCQ_LETTERS[i] || ''}</span>
    <input class="opt-input" placeholder="${t('exams.optionPh')}"></div>`;
}
function qMcqRow() {
  return `<div class="q-row q-row--mcq">
    <span class="q-idx">•</span>
    <textarea class="q-text" rows="2" placeholder="${t('exams.questionPh')}"></textarea>
    <button type="button" class="q-remove" title="${t('common.delete')}">🗑</button>
    <div class="mcq-opts-edit">${optRow(0)}${optRow(1)}${optRow(2)}
      <button type="button" class="btn btn--soft btn--sm add-opt">${t('exams.addOption')}</button>
    </div>
  </div>`;
}
function qTfRow() {
  return `<div class="q-row q-row--tf">
    <span class="q-idx">•</span>
    <textarea class="q-text" rows="1" placeholder="${t('exams.questionPh')}"></textarea>
    <button type="button" class="q-remove" title="${t('common.delete')}">🗑</button>
  </div>`;
}
function renumber() {
  [['#essayQuestions'], ['#mcqQuestions'], ['#tfQuestions']].forEach(([sel]) => {
    $$('.q-row', $(sel)).forEach((r, i) => { $('.q-idx', r).textContent = i + 1; });
  });
}
function openExamBuilder() {
  const L = cur();
  $('#examNumber').value = (L.exams || []).length + 1;
  $('#examBookName').value = L.bookName || '';
  $('#examReadingName').value = L.name || '';
  $('#essayQuestions').innerHTML = qEssayRow();
  $('#mcqQuestions').innerHTML = qMcqRow();
  $('#tfQuestions').innerHTML = qTfRow();
  setSeg($('#examPagesSeg'), 1, 'pages');
  renumber();
  $('#examBuilder').hidden = false;
}
function collectExam() {
  const essay = $$('#essayQuestions .q-row').map(r => $('.q-text', r).value.trim()).filter(Boolean);
  const mcq = $$('#mcqQuestions .q-row').map(r => ({
    q: $('.q-text', r).value.trim(),
    opts: $$('.opt-input', r).map(i => i.value.trim()).filter(Boolean)
  })).filter(m => m.q);
  const tf = $$('#tfQuestions .q-row').map(r => $('.q-text', r).value.trim()).filter(Boolean);
  return { essay, mcq, tf };
}

/* بناء ورقة A4 (html كامل) */
function sheetHTML(ex, fs) {
  const fontStack = LANG === 'am'
    ? "'Noto Serif Ethiopic','El Messiri',serif"
    : LANG === 'en'
    ? "'Space Grotesk','El Messiri',serif"
    : "'El Messiri','Aref Ruqaa',serif";
  let n = 0;
  const essay = ex.essay.map(q => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">${++n})</span><span class="q-text">${esc(q)}</span></div>
      <div class="q-line"></div>
      <div class="q-sep"></div>
    </div>`).join('');
  const mcq = ex.mcq.map(m => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">${++n})</span><span class="q-text">${esc(m.q)}</span></div>
      <div class="mcq-opts">${m.opts.map((o, i) =>
        `<span class="mcq-opt"><span class="ob">${MCQ_LETTERS[i] || ''}</span><span>${esc(o)}</span></span>`).join('')}
      </div>
      <div class="q-sep"></div>
    </div>`).join('');
  const tf = ex.tf.map(q => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">${++n})</span><span class="q-text">${esc(q)}</span></div>
      <div class="tf-line"><span class="tf-bracket"></span><span class="tf-hint">✓ / ✗</span></div>
      <div class="q-sep"></div>
    </div>`).join('');
  const sec = (cls, head, body) => body ? `<div class="sec-block"><div class="sec-title ${cls}">${head}</div>${body}</div>` : '';
  const sub = [ex.reading ? t('sheet.readingLabel') + ' ' + esc(ex.reading) : '',
               ex.book ? t('sheet.bookLabel') + ' ' + esc(ex.book) : ''].filter(Boolean).join(' • ');
  return `
  <div class="exam-sheet" dir="${LANG === 'ar' ? 'rtl' : 'ltr'}"
       style="--sheet-fs:${fs}pt;font-family:${fontStack}">
    <div class="sheet-bism">بسم الله الرحمن الرحيم</div>
    <div class="sheet-head">
      <div class="sheet-title">${t('sheet.exam')} <b>${ex.number}</b></div>
      ${sub ? `<div class="sheet-sub">${sub}</div>` : ''}
    </div>
    <div class="sheet-name-row">
      <div class="name-field"><span class="name-label">${t('sheet.name')}</span><span class="name-underline"></span></div>
      <div class="date-field"><span class="name-label">${t('sheet.date')}</span><span class="name-underline"></span></div>
    </div>
    <div class="sheet-sep"></div>
    ${sec('sec-title--essay', t('sheet.essayHead'), essay)}
    ${sec('sec-title--mcq',   t('sheet.mcqHead'),   mcq)}
    ${sec('sec-title--tf',    t('sheet.tfHead'),    tf)}
    <div class="sheet-foot">${t('sheet.footer')}</div>
  </div>`;
}

/* خوارزمية التمدد/التقلص: تجد أكبر خط يجعل المحتوى يملأ الصفحات المطلوبة بدقة */
async function fitSheet(ex, pages) {
  const stage = $('#pdfStage');
  stage.innerHTML = sheetHTML(ex, 11);
  const sheet = stage.firstElementChild;
  try { await document.fonts.ready; } catch (e) {}
  const PAGE = 1122.5;                       // 297mm بالبكسل
  const T = pages * PAGE * 0.985;
  const h = () => sheet.offsetHeight;
  let lo = 6.5, hi = 20, best = lo;
  sheet.style.setProperty('--sheet-fs', lo + 'pt');
  if (h() > T) {                             // محتوى كثير جداً → وضع مضغوط
    sheet.style.padding = '8mm 10mm';
    sheet.style.lineHeight = '1.45';
  }
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    sheet.style.setProperty('--sheet-fs', mid + 'pt');
    if (h() <= T) { best = mid; lo = mid; } else { hi = mid; }
  }
  sheet.style.setProperty('--sheet-fs', best + 'pt');
  if (best >= 19.6) {                        // محتوى قليل → تمدد أسطر الإجابة ليكتمل الملء
    let grow = 1, guard = 0;
    while (h() < T * 0.93 && grow < 3 && guard++ < 30) {
      grow += 0.2;
      $$('.q-line', sheet).forEach(e => e.style.height = (1.4 * grow).toFixed(2) + 'em');
      $$('.tf-bracket', sheet).forEach(e => e.style.height = (1.6 * grow).toFixed(2) + 'em');
      $$('.q-sep', sheet).forEach(e => e.style.margin = (0.55 * grow).toFixed(2) + 'em 0');
    }
  }
  return sheet;
}

function exportPdf(el, filename) {
  if (!window.html2pdf) { toast(t('pdf.printFallback'), 'info'); window.print(); return; }
  html2pdf().set({
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.q-item', '.sheet-head', '.sheet-name-row', '.mcq-opt', '.p-row'] }
  }).from(el).save()
    .then(() => toast(t('pdf.done')))
    .catch(() => toast(t('pdf.fail'), 'err'));
}
function showSheetPreview(sheet) {
  previewSheet = sheet;
  const cont = $('#examSheetContainer');
  cont.innerHTML = '';
  cont.appendChild(sheet);
  requestAnimationFrame(() => {
    const w = ($('#previewScroll').clientWidth || 800) - 26;
    $('#previewScroll').style.setProperty('--pv-scale', Math.min(1, w / 794).toFixed(3));
  });
  $('#examPreviewOverlay').hidden = false;
}

function renderExams() {
  const L = cur(); if (!L) return;
  L.exams = L.exams || [];
  $('#examsCount').textContent = L.exams.length;
  $('#examsList').innerHTML = L.exams.length ? L.exams.slice().reverse().map(ex => `
    <div class="exam-card">
      <span class="exam-num">${t('sheet.exam')} #${ex.number}</span>
      <span class="exam-meta">${esc(ex.book || '')} ${ex.reading ? '• ' + esc(ex.reading) : ''} • ${ex.date} • ${ex.pages} ${t('exams.pages')} • ${ex.essay.length + ex.mcq.length + ex.tf.length} ${t('exams.qCount')}</span>
      <div class="exam-actions">
        <button class="btn btn--soft btn--sm" data-act="preview" data-id="${ex.id}">👁 ${t('exams.preview')}</button>
        <button class="btn btn--soft btn--sm" data-act="pdf" data-id="${ex.id}">🖨 PDF</button>
        <button class="btn btn--soft btn--sm" data-act="results" data-id="${ex.id}">🏆 ${t('exams.results')}</button>
        <button class="btn btn--ghost btn--sm" data-act="del" data-id="${ex.id}">🗑</button>
      </div>
    </div>`).join('') : `<p class="empty">${t('exams.emptyList')}</p>`;
}
function openResults(ex) {
  const L = cur();
  const rows = L.students.map(s => {
    const r = (ex.results || {})[s.id] || { score: '', total: '' };
    return `
    <tr>
      <td style="text-align:start;font-weight:700">${esc(s.name)}</td>
      <td><input type="number" min="0" class="rScore" data-sid="${s.id}" value="${r.score}" placeholder="0"></td>
      <td><input type="number" min="1" class="rTotal" data-sid="${s.id}" value="${r.total}" placeholder="10"></td>
    </tr>`;
  }).join('');
  openModal(`${t('exams.results')} — ${t('sheet.exam')} #${ex.number}`, `
    <div class="table-wrap"><table class="table">
      <thead><tr><th>${t('students.name')}</th><th>${t('exams.resultScore')}</th><th>${t('exams.resultTotal')}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <div class="modal-actions"><button class="btn btn--primary" id="rSave">${t('exams.saveResults')}</button></div>`);
  $('#rSave').onclick = () => {
    ex.results = {};
    $$('#modalBody .rScore').forEach(inp => {
      const sid = inp.dataset.sid;
      const tot = $(`#modalBody .rTotal[data-sid="${sid}"]`).value;
      if (inp.value !== '' && tot !== '') ex.results[sid] = { score: +inp.value, total: +tot };
    });
    saveState(); closeModal(); renderExams();
    toast(t('toast.saved'));
  };
}
function bindExams() {
  $('#createExamBtn').onclick = openExamBuilder;
  $('#examBuilderClose').onclick = () => { $('#examBuilder').hidden = true; };
  $('#examPagesSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    setSeg($('#examPagesSeg'), b.dataset.pages, 'pages');
  });
  $('#addEssayQ').onclick = () => { $('#essayQuestions').insertAdjacentHTML('beforeend', qEssayRow()); renumber(); };
  $('#addMcqQ').onclick   = () => { $('#mcqQuestions').insertAdjacentHTML('beforeend', qMcqRow()); renumber(); };
  $('#addTfQ').onclick    = () => { $('#tfQuestions').insertAdjacentHTML('beforeend', qTfRow()); renumber(); };
  $('#examBuilder').addEventListener('click', e => {
    const rm = e.target.closest('.q-remove');
    if (rm) { rm.closest('.q-row').remove(); renumber(); return; }
    const ao = e.target.closest('.add-opt');
    if (ao) {
      const box = ao.closest('.mcq-opts-edit');
      const n = $$('.opt-row', box).length;
      if (n < 5) {
        ao.insertAdjacentHTML('beforebegin', optRow(n));
        $$('.opt-row', box).forEach((r, i) => { $('.opt-letter', r).textContent = MCQ_LETTERS[i] || ''; });
      }
    }
  });
  $('#examPreviewBtn').onclick = async () => {
    const data = collectExam();
    if (!data.essay.length && !data.mcq.length && !data.tf.length) return toast(t('exams.noQuestions'), 'err');
    const ex = { number: +$('#examNumber').value || 1, book: $('#examBookName').value.trim(),
                 reading: $('#examReadingName').value.trim(), pages: builderPages(), ...data };
    showSheetPreview(await fitSheet(ex, ex.pages));
  };
  $('#examPreviewClose').onclick = () => { $('#examPreviewOverlay').hidden = true; };
  $('#examPreviewPrint').onclick = () => { if (previewSheet) exportPdf(previewSheet, `exam-${+$('#examNumber').value || 1}.pdf`); };
  $('#examGenerateBtn').onclick = async () => {
    const data = collectExam();
    if (!data.essay.length && !data.mcq.length && !data.tf.length) return toast(t('exams.noQuestions'), 'err');
    const L = cur();
    const ex = {
      id: uid(), number: +$('#examNumber').value || L.exams.length + 1, date: todayStr(),
      book: $('#examBookName').value.trim(), reading: $('#examReadingName').value.trim(),
      pages: builderPages(), ...data, results: {}
    };
    const sheet = await fitSheet(ex, ex.pages);
    L.exams.push(ex);
    saveState(); renderExams();
    $('#examBuilder').hidden = true;
    exportPdf(sheet, `exam-${ex.number}.pdf`);
  };
  $('#examsList').addEventListener('click', async e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const L = cur(); const ex = L.exams.find(x => x.id === b.dataset.id); if (!ex) return;
    const act = b.dataset.act;
    if (act === 'del') {
      confirmDlg(t('exams.confirmDelete'), () => {
        L.exams = L.exams.filter(x => x.id !== ex.id);
        saveState(); renderExams(); toast(t('toast.deleted'));
      });
    } else if (act === 'results') {
      openResults(ex);
    } else if (act === 'preview') {
      showSheetPreview(await fitSheet(ex, ex.pages));
    } else if (act === 'pdf') {
      exportPdf(await fitSheet(ex, ex.pages), `exam-${ex.number}.pdf`);
    }
  });
}

/* ───────────── (14) PDF الطلاب: أسماء / أسبوعي / شهري ───────────── */
const PAPER_CSS = `
.p-sheet{width:210mm;min-height:297mm;background:#fff;color:#14161c;padding:12mm 13mm;
  box-sizing:border-box;font-size:11.5pt;line-height:1.55}
.p-bism{text-align:center;font-family:'Aref Ruqaa',serif;font-size:15pt;color:#1e3a8a;margin-bottom:6px}
.p-title{text-align:center;font-family:'Aref Ruqaa',serif;font-size:16pt;border:2px solid #14161c;
  border-radius:6px;padding:6px 10px;margin-bottom:4px;font-weight:700}
.p-sub{text-align:center;color:#3f4453;font-size:10pt;margin-bottom:10px}
.p-cols{column-count:2;column-gap:8mm}
.p-item{padding:4px 2px;border-bottom:1px solid #b3b9c6;break-inside:avoid;font-size:12pt;font-weight:600}
table.p-tbl{width:100%;border-collapse:collapse;font-size:9.5pt}
.p-tbl th{background:#0f766e;color:#fff;padding:5px 4px;border:1px solid #14161c;font-size:8.5pt}
.p-tbl td{border:1px solid #555;padding:4px;text-align:center}
.p-tbl td.p-name{text-align:start;font-weight:700}
.p-tbl tr{break-inside:avoid;page-break-inside:avoid}
.p-foot{margin-top:10px;text-align:center;color:#4b5563;font-size:9pt;border-top:1px dashed #999;padding-top:6px}
`;
function paperFont() {
  return LANG === 'am' ? "'Noto Serif Ethiopic','El Messiri',serif"
       : LANG === 'en' ? "'Space Grotesk','El Messiri',serif"
       : "'El Messiri','Aref Ruqaa',serif";
}
function paper(inner) {
  return `<div class="p-sheet" dir="${LANG === 'ar' ? 'rtl' : 'ltr'}" style="font-family:${paperFont()}">
    <style>${PAPER_CSS}</style>
    <div class="p-bism">بسم الله الرحمن الرحيم</div>${inner}
  </div>`;
}
function paperHead(title) {
  const st = state.settings;
  return `<div class="p-title">${esc(title)}</div>
  <div class="p-sub">${[st.centerName && esc(st.centerName), st.teacherName && esc(st.teacherName), todayStr()].filter(Boolean).join(' • ')}</div>`;
}
function weekDates(base = new Date()) {
  const off = (base.getDay() + 6) % 7;
  const mon = new Date(base); mon.setDate(base.getDate() - off);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return dstr(d); });
}
function cellSym(r) {
  if (!r) return '—';
  if (!r.present) return '❌';
  let s = '✅';
  if (r.late) s += '⏰' + (r.lateMin || 0);
  if (!r.book) s += '🖐';
  return s;
}
function makeNamesPdf() {
  const L = cur(); if (!L) return;
  if (!L.students.length) return toast(t('pdf.noStudents'), 'err');
  const items = L.students.map((s, i) =>
    `<div class="p-item">${i + 1}. ${esc(s.name)} ${esc(s.father)}</div>`).join('');
  $('#pdfStage').innerHTML = paper(`
    ${paperHead(L.name)}
    <div class="p-sub">${t('students.count')}: ${L.students.length}</div>
    <div class="p-cols">${items}</div>
    <div class="p-foot">${esc(L.name)} • ${todayStr()}</div>`);
  exportPdf($('#pdfStage').firstElementChild, 'students-names.pdf');
}
function makeWeeklyPdf() {
  const L = cur(); if (!L) return;
  if (!L.students.length) return toast(t('pdf.noStudents'), 'err');
  const dates = weekDates();
  const head = `<tr><th>${t('students.name')}</th>${dates.map(ds =>
    `<th>${t('day.' + parseD(ds).getDay())}<br>${fmtDM(ds)}</th>`).join('')}
    <th>✅</th><th>❌</th><th>⏰</th></tr>`;
  const rows = L.students.map(s => {
    let p = 0, a = 0, late = 0;
    const cells = dates.map(ds => {
      const r = (L.attendance[ds] || {})[s.id];
      if (r) { r.present ? p++ : a++; if (r.late) late += r.lateMin || 0; }
      return `<td>${cellSym(r)}</td>`;
    }).join('');
    return `<tr class="p-row"><td class="p-name">${esc(s.name)}</td>${cells}<td>${p}</td><td>${a}</td><td>${late}</td></tr>`;
  }).join('');
  $('#pdfStage').innerHTML = paper(`
    ${paperHead(t('pdf.weekly') + ' — ' + L.name)}
    <table class="p-tbl">${head}${rows}</table>
    <div class="p-foot">${todayStr()}</div>`);
  exportPdf($('#pdfStage').firstElementChild, 'weekly-report.pdf');
}
function makeMonthlyPdf() {
  const L = cur(); if (!L) return;
  if (!L.students.length) return toast(t('pdf.noStudents'), 'err');
  const now = new Date();
  const a = dstr(new Date(now.getFullYear(), now.getMonth(), 1));
  const b = dstr(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  const rows = L.students.map(s => {
    let p = 0, ab = 0, late = 0, nb = 0, md = 0, ud = 0;
    for (const ds in L.attendance) {
      if (ds < a || ds > b) continue;
      const r = L.attendance[ds][s.id]; if (!r) continue;
      r.present ? p++ : ab++;
      if (r.late) late += r.lateMin || 0;
      if (r.present && !r.book) nb++;
    }
    for (const h of (L.rec.history || [])) {
      if (h.date < a || h.date > b || h.sid !== s.id || h.status !== 'done') continue;
      h.type === 'matn' ? md++ : ud++;
    }
    const d = (L.rec.debts || {})[s.id] || { matn: 0, mutala: 0 };
    const exs = (L.exams || []).filter(e => (e.results || {})[s.id] && e.date >= a && e.date <= b)
      .map(e => `${e.results[s.id].score}/${e.results[s.id].total}`).join(', ');
    return `<tr class="p-row">
      <td class="p-name">${esc(s.name)}</td><td>${p}</td><td>${ab}</td><td>${late}</td><td>${nb}</td>
      <td>${md}</td><td>${ud}</td><td>${d.matn}/${d.mutala}</td><td>${exs || '—'}</td>
    </tr>`;
  }).join('');
  $('#pdfStage').innerHTML = paper(`
    ${paperHead(t('pdf.monthly') + ' — ' + L.name)}
    <table class="p-tbl">
      <tr><th>${t('students.name')}</th><th>✅</th><th>❌</th><th>⏰${t('attendance.mins')}</th><th>🖐</th>
      <th>${t('recitation.matnType')}</th><th>${t('recitation.mutalaType')}</th><th>⚖️</th><th>${t('exams.results')}</th></tr>
      ${rows}
    </table>
    <div class="p-foot">${todayStr()}</div>`);
  exportPdf($('#pdfStage').firstElementChild, 'monthly-report.pdf');
}

/* ───────────── (15) تقرير الوالد (بنقرة واحدة) ───────────── */
function periodRange(p) {
  const n = new Date();
  let a, b;
  if (p === 'thisMonth') {
    a = new Date(n.getFullYear(), n.getMonth(), 1);
    b = new Date(n.getFullYear(), n.getMonth() + 1, 0);
  } else {
    const off = (n.getDay() + 6) % 7;
    const mon = new Date(n); mon.setDate(n.getDate() - off);
    if (p === 'lastWeek') mon.setDate(mon.getDate() - 7);
    a = new Date(mon);
    b = new Date(mon); b.setDate(mon.getDate() + 6);
  }
  return [dstr(a), dstr(b)];
}
function buildReport(sid, period) {
  const L = cur(); ensureQueues(L);
  const s = L.students.find(x => x.id === sid); if (!s) return '';
  const [a, b] = periodRange(period);
  const monthly = period === 'thisMonth';
  const lines = [];
  lines.push('السلام عليكم ورحمة الله وبركاته', '');
  lines.push('📜' + t('reports.reportOf', {
    name: s.name + ' ' + s.father,
    p: t(monthly ? 'reports.monthly' : 'reports.weekly')
  }), '');

  for (let d = parseD(a); d <= parseD(b); d.setDate(d.getDate() + 1)) {
    const ds = dstr(d);
    const rec = (L.attendance[ds] || {})[sid];
    if (!rec) continue;
    lines.push(`${t('day.' + d.getDay())} ${fmtDM(ds)}`);
    lines.push(rec.present ? '✅' + t('reports.came') : '❌' + t('reports.notCome'));
    if (rec.present) {
      lines.push('⏰' + (rec.late ? t('reports.lateMin', { n: rec.lateMin || 1 }) : t('reports.lateNone')));
      lines.push('📝' + (rec.book ? t('reports.bookYes') : t('reports.bookNo')));
    }
    lines.push('');
  }
  /* ما فوّته من متن/مطالعة خلال الفترة */
  const missed = (L.rec.history || []).filter(h =>
    h.sid === sid && h.status === 'debt' && h.date >= a && h.date <= b);
  if (missed.length) {
    for (const h of missed) {
      lines.push(t('reports.debtLine', {
        p: t(monthly ? 'reports.monthN' : 'reports.weekN'),
        d: t('day.' + parseD(h.date).getDay()) + ' ' + fmtDM(h.date),
        ty: t(h.type === 'matn' ? 'recitation.matnType' : 'recitation.mutalaType')
      }));
    }
    lines.push('');
  }
  /* الدين الحالي */
  const dc = (L.rec.debts || {})[sid];
  if (dc && (dc.matn > 0 || dc.mutala > 0)) {
    lines.push('⚠️ ' + t('reports.currentDebt', { m: dc.matn, y: dc.mutala }), '');
  }
  /* الاختبارات */
  const exs = (L.exams || []).filter(e => (e.results || {})[sid] && e.date >= a && e.date <= b);
  if (exs.length) {
    lines.push(t('reports.examHeader'));
    for (const e of exs) {
      const r = e.results[sid];
      lines.push(t('reports.examResult', { n: e.number, s: r.score, t: r.total }));
    }
    lines.push('');
  }
  lines.push(t('reports.thanks'));
  return lines.join('\n');
}
function renderReportSelects() {
  const L = cur(); if (!L) return;
  const sel = $('#reportStudentSelect');
  const prev = sel.value;
  sel.innerHTML = L.students.length
    ? `<option value="">${t('reports.selectStudent')}</option>` +
      L.students.map(s => `<option value="${s.id}">${esc(s.name)} ${esc(s.father)}</option>`).join('')
    : `<option value="">${t('recitation.noStudents')}</option>`;
  if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
}
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); toast(t('reports.copied')); }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(t('reports.copied')); }
    catch (e2) { toast(t('reports.copyFail'), 'err'); }
    ta.remove();
  }
}
function bindReports() {
  $('#generateReportBtn').onclick = () => {
    const sid = $('#reportStudentSelect').value;
    if (!sid) return toast(t('reports.selectStudent'), 'err');
    const txt = buildReport(sid, $('#reportPeriodSelect').value);
    $('#reportPreview').value = txt;
    if (!txt) toast(t('reports.noData'), 'err');
  };
  $('#sendTelegramBtn').onclick = () => {
    const txt = $('#reportPreview').value;
    if (!txt) return toast(t('reports.noData'), 'err');
    window.open('https://t.me/share/url?url=%20&text=' + encodeURIComponent(txt), '_blank');
  };
  $('#copyReportBtn').onclick = () => {
    const txt = $('#reportPreview').value;
    if (!txt) return toast(t('reports.noData'), 'err');
    copyText(txt);
  };
  $('#shareReportBtn').onclick = async () => {
    const txt = $('#reportPreview').value;
    if (!txt) return toast(t('reports.noData'), 'err');
    if (navigator.share) {
      try { await navigator.share({ text: txt }); toast(t('reports.shared')); }
      catch (e) { /* ألغى المستخدم */ }
    } else copyText(txt);
  };
}

/* ───────────── (16) الحسابات والصلاحيات ───────────── */
function applyRole() {
  const admin = isAdmin();
  $('#usersCard').hidden = !admin;
  $('#resetAppBtn').hidden = !admin;
}
function updateCurrentUserBadge() {
  const u = currentUser();
  $('#currentUserBadge').textContent = u
    ? t('settings.signedInAs', { u: u.username, r: t(u.role === 'admin' ? 'settings.roleAdmin' : 'settings.roleTeacher') })
    : '—';
}
function renderUsers() {
  const tb = $('#usersTableBody'); if (!tb) return;
  tb.innerHTML = state.users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(u.username)}</td>
      <td>${t(u.role === 'admin' ? 'settings.roleAdmin' : 'settings.roleTeacher')}</td>
      <td><button class="q-remove" data-del="${u.id}" title="${t('common.delete')}">🗑</button></td>
    </tr>`).join('');
}
function renderSettingsUI() {
  const L = cur();
  bindDaysPicker($('#settingsDaysPicker'),
    () => state.settings.studyDays,
    days => { state.settings.studyDays = days; saveState(); renderRecitation(); });
  setSeg($('#settingsMutalaSeg'), L ? L.mutalaPerDay : 2, 'count');
  $('#syncEndpoint').value = state.settings.syncEndpoint || '';
  $('#syncKey').value = state.settings.syncKey || '';
  $('#autoSyncToggle').checked = !!state.settings.autoSync;
  updateLastSync();
}
function bindSettings() {
  $('#accountForm').addEventListener('submit', e => {
    e.preventDefault();
    const u = currentUser(); if (!u) return;
    if ($('#curPassword').value !== u.password) return toast(t('settings.wrongPass'), 'err');
    const nu = $('#newUsername').value.trim();
    const np = $('#newPassword').value;
    const cp = $('#confirmPassword').value;
    if (nu && state.users.some(x => x.id !== u.id && x.username.toLowerCase() === nu.toLowerCase()))
      return toast(t('settings.userNameTaken'), 'err');
    if (np || cp) {
      if (np !== cp) return toast(t('settings.passMismatch'), 'err');
      if (np.length < 4) return toast(t('settings.shortPass'), 'err');
    }
    if (nu) { u.username = nu; localStorage.setItem(SESS, nu); }
    if (np) u.password = np;
    saveState(); e.target.reset();
    renderUsers(); updateCurrentUserBadge();
    toast(t('settings.updated'));
  });
  $('#addUserForm').addEventListener('submit', e => {
    e.preventDefault();
    const nu = $('#newAccUsername').value.trim();
    const np = $('#newAccPassword').value;
    if (!nu || !np) return toast(t('toast.error'), 'err');
    if (state.users.some(x => x.username.toLowerCase() === nu.toLowerCase()))
      return toast(t('settings.userExists'), 'err');
    state.users.push({ id: uid(), username: nu, password: np, role: $('#newAccRole').value, created: todayStr() });
    saveState(); e.target.reset(); renderUsers();
    toast(t('settings.userAdded'));
  });
  $('#usersTableBody').addEventListener('click', e => {
    const b = e.target.closest('[data-del]'); if (!b) return;
    if (b.dataset.del === (currentUser() || {}).id) return toast(t('settings.cantDeleteSelf'), 'err');
    const target = state.users.find(x => x.id === b.dataset.del);
    if (target?.role === 'admin' && state.users.filter(x => x.role === 'admin').length <= 1)
      return toast(t('settings.cantDeleteSelf'), 'err');
    confirmDlg(t('settings.confirmDeleteUser'), () => {
      state.users = state.users.filter(x => x.id !== b.dataset.del);
      saveState(); renderUsers(); toast(t('settings.userDeleted'));
    });
  });
  $('#syncEndpoint').addEventListener('change', e => { state.settings.syncEndpoint = e.target.value.trim(); saveState(false); });
  $('#syncKey').addEventListener('change', e => { state.settings.syncKey = e.target.value; saveState(false); });
  $('#autoSyncToggle').addEventListener('change', e => { state.settings.autoSync = e.target.checked; saveState(false); });
  $('#syncNowBtn').onclick = () => syncNow(true);
  $('#settingsMutalaSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const L = cur(); if (!L) return;
    L.mutalaPerDay = +b.dataset.count;
    saveState(); renderLessonsUI(); renderRecitation();
  });
  $('#exportDataBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `qiraat-backup-${todayStr()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(t('settings.exported'));
  };
  $('#importDataBtn').onclick = () => $('#importFileInput').click();
  $('#importFileInput').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const obj = JSON.parse(rd.result);
        if (!obj.users || !obj.lessons) throw 0;
        localStorage.setItem(LS_KEY, JSON.stringify(obj));
        toast(t('settings.imported'));
        setTimeout(() => location.reload(), 900);
      } catch (err) { toast(t('settings.importFail'), 'err'); }
    };
    rd.readAsText(f);
    e.target.value = '';
  });
  $('#logoutBtn').onclick = () => {
    localStorage.removeItem(SESS);
    showLogin();
  };
  $('#resetAppBtn').onclick = () => confirmDlg(t('settings.confirmReset'), () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(SESS);
    localStorage.removeItem(CLOUD);
    location.reload();
  });
}

/* ───────────── (17) عام: التبويبات / النوافذ / PWA ───────────── */
function bindTabs() {
  $$('.tab').forEach(tb => {
    tb.onclick = () => {
      $$('.tab').forEach(x => x.classList.toggle('active', x === tb));
      $$('.view').forEach(v => { v.hidden = v.dataset.view !== tb.dataset.view; });
      if (tb.dataset.view === 'attendance')  renderAttendance();
      if (tb.dataset.view === 'recitation')  renderRecitation();
      if (tb.dataset.view === 'reports')     renderReportSelects();
    };
  });
}
function bindCommon() {
  $('#modalClose').onclick = closeModal;
  $('#modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      $('#examPreviewOverlay').hidden = true;
      $('#examBuilder').hidden = true;
    }
  });
  $('#langSelect').onchange = e => setLang(e.target.value);
  $('#lessonSelect').onchange = e => switchLesson(e.target.value);
  $('#addLessonBtn').onclick = openLessonModal;
  $('#pdfNamesBtn').onclick   = makeNamesPdf;
  $('#pdfWeeklyBtn').onclick  = makeWeeklyPdf;
  $('#pdfMonthlyBtn').onclick = makeMonthlyPdf;
  window.addEventListener('online',  () => setSyncStatus('idle'));
  window.addEventListener('offline', () => setSyncStatus('offline'));
  window.addEventListener('resize', () => {
    if (!$('#examPreviewOverlay').hidden) {
      const w = ($('#previewScroll').clientWidth || 800) - 26;
      $('#previewScroll').style.setProperty('--pv-scale', Math.min(1, w / 794).toFixed(3));
    }
  });
}
function bindPWA() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    $('#installBtn').hidden = false;
  });
  $('#installBtn').onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const r = await deferredPrompt.userChoice;
    if (r.outcome === 'accepted') toast(t('common.installed'));
    deferredPrompt = null;
    $('#installBtn').hidden = true;
  };
  window.addEventListener('appinstalled', () => { $('#installBtn').hidden = true; });
}

/* ───────────── (18) التهيئة الكاملة والتشغيل ───────────── */
function renderAll() {
  renderLessonsUI();
  renderStudents();
  renderAttendance();
  renderRecitation();
  renderExams();
  renderReportSelects();
  renderUsers();
  renderSettingsUI();
  updateCurrentUserBadge();
  updateLastSync();
}

function init() {
  loadState();
  LANG = I18N[state.settings.lang] ? state.settings.lang : 'am';
  applyI18n();
  $('#langSelect').value = LANG;
  $$('.lang-mini').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));

  bindLogin(); bindSetup(); bindStudents(); bindAttendance();
  bindRecitation(); bindExams(); bindReports(); bindSettings();
  bindTabs(); bindCommon(); bindPWA();

  const sess = localStorage.getItem(SESS);
  if (!state.settings.initialized)      showSetup();
  else if (sess && state.users.some(u => u.username === sess)) showApp();
  else                                  showLogin();
}

init();
