# nauss-auto-correspondence

- يعمل من الفرع **main** على GitHub Pages.
- الملف `index.html` هو النسخة الأصلية كما هو.
- حفظ المراسلات يتم عبر GitHub Actions بإنشاء ملف JSON داخل `data/letters/`:
  - تشغيل تلقائي عبر `repository_dispatch` (event_type: `save-letter`)
  - أو يدوي عبر `workflow_dispatch` وإدخال `title` و`content`.

> صلاحية الكتابة للمستودع مفعّلة عبر `GITHUB_TOKEN` ضمن GitHub Actions.

