# SkillBridge Foundation

نسخة تأسيس جديدة للمنصة مبنية من الصفر كواجهة static منظمة، هدفها:

- تقديم flow واضح جدًا للطالب والشركة.
- تقليل التشتيت الموجود في النسخ السابقة.
- تجهيز بنية سهلة النقل لاحقًا إلى React أو Angular.
- جعل استبدال البيانات mock ببيانات backend مباشرًا بدون إعادة بناء الواجهة.

## المسارات الحالية

- `index.html`
  صفحة تعريفية بالمنتج والـ flows الأساسية.

- `pages/student-hub.html`
  نقطة الدخول الأساسية للطالب.
  تعرض:
  profile summary
  Talent DNA snapshot
  strengths / gaps
  next actions
  journey map

- `pages/talent-passport.html`
  صفحة Talent Passport كملف بصري مختصر يشرح قيمة الطالب.

- `pages/opportunities.html`
  صفحة Smart Apply لعرض الفرص المناسبة مع:
  fit score
  why fit
  missing gap
  next step

- `pages/company-workspace.html`
  نقطة الدخول الأساسية للشركة.
  تعرض:
  metrics
  pipeline
  shortlist
  insights

- `pages/job-dna.html`
  تصور واضح لبصمة الوظيفة وقابل للتحويل لاحقًا إلى form/schema.

## هيكل الملفات

```text
skillbridge-foundation/
  index.html
  README.md
  assets/
    css/
      style.css
    js/
      mock-data.js
      main.js
  pages/
    student-hub.html
    talent-passport.html
    opportunities.html
    company-workspace.html
    job-dna.html
```

## لماذا هذه البنية مناسبة للتطوير لاحقًا

### 1. Design System واحد

كل الـ tokens والمكونات البصرية الأساسية موجودة في `assets/css/style.css`:

- colors
- spacing
- cards
- buttons
- layout grids
- responsive rules

هذا يجعل استخراجها لاحقًا إلى:

- `tokens.css` + `components.css`
- أو `Tailwind config`
- أو `SCSS modules`

أمرًا مباشرًا.

### 2. Data-Driven Rendering

كل البيانات mock موجودة في `assets/js/mock-data.js`.
الـ render logic موجود في `assets/js/main.js`.

هذا يعني أن النقل إلى React أو Angular سيكون غالبًا:

- استبدال `window.SkillBridgeMock` بـ API calls أو state management.
- تقسيم renderers إلى components.
- الإبقاء على نفس structure ونفس naming للـ data contracts.

### 3. Page Ownership واضح

كل صفحة تمثل محطة واضحة في المنتج، وليس مجرد تجميع Sections عشوائية.
هذا سيسهل لاحقًا map الصفحات إلى routes مثل:

- `/student`
- `/student/passport`
- `/student/opportunities`
- `/company`
- `/company/job-dna`

## Data Contracts مقترحة عند الربط مع backend

### Student Profile

```json
{
  "name": "ملك عبد الرحيم",
  "stage": "طالبة سنة رابعة - نظم معلومات",
  "completion": 84,
  "targetRole": "Product Data Analyst Intern",
  "matchScore": 87,
  "passportScore": 91
}
```

### Talent DNA Metric

```json
{
  "label": "حل المشكلات",
  "value": 92,
  "detail": "تحويل الغموض إلى خطوات واضحة قابلة للتنفيذ."
}
```

### Opportunity Card

```json
{
  "company": "Nile Analytics",
  "title": "Data Analyst Intern",
  "match": 87,
  "mode": "Hybrid",
  "location": "القاهرة",
  "reason": "قوة في التنظيم والتحليل + أساس قوي في SQL.",
  "gaps": "ينقصك Storytelling مع البيانات وPower BI.",
  "nextStep": "قدمي الآن مع مشروع dashboard."
}
```

### Candidate Card

```json
{
  "name": "سيف محمود",
  "role": "Frontend Intern",
  "fit": 91,
  "badges": ["React Basics", "UI Discipline", "Fast Learner"],
  "summary": "منظم، سريع، ولديه مشروعين قريبين من احتياج الدور.",
  "risk": "يحتاج خبرة أكبر في API integration."
}
```

## اقتراح النقل إلى React أو Angular

### React

- `layout/Topbar`
- `components/MetricCard`
- `components/PassportSkill`
- `components/OpportunityCard`
- `components/CandidateCard`
- `pages/StudentHubPage`
- `pages/TalentPassportPage`
- `pages/CompanyWorkspacePage`

### Angular

- `shared/components/topbar`
- `shared/components/metric-card`
- `student/pages/student-hub`
- `student/pages/talent-passport`
- `student/pages/opportunities`
- `company/pages/company-workspace`
- `company/pages/job-dna`

## الخطوة المنطقية التالية

بعد موافقتكم على هذا الاتجاه، الأفضل يكون واحد من المسارين:

1. تحويل هذه النسخة إلى React structure بنفس الـ UX الحالي.
2. ربط النسخة الحالية أولًا بـ mock API / JSON server ثم نقلها إلى framework.

لو هنكمل، الأفضل في المرحلة الجاية نبدأ بـ:

- auth flow موحد
- layout app shell
- forms حقيقية للـ onboarding و Job DNA
- naming موحد للـ API endpoints
