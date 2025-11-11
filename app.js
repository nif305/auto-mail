/* =========================================================
   auto-mail / app.js
   - حفظ المراسلة تلقائيًا عبر GitHub Actions (repository_dispatch)
   - زر العودة للصفحة الرئيسية + تصفير النموذج والمخرجات
   - جاهز للعمل على GitHub Pages
   ========================================================= */

/* ========== 1) الحفظ التلقائي في GitHub ========== */
async function saveLetterToGitHub(title, content) {
  // عدّل هذين حسب مستودعك:
  const repoOwner = "nif305";
  const repoName  = "auto-mail";

  const eventType = "save-letter";

  // عند التشغيل من المتصفح تحتاج PAT لكل مستخدم مرة واحدة
  // (Fine-grained token بصلاحيات: Contents RW + Actions RW)
  let token = localStorage.getItem("gh_pat") || "";
  if (!token) {
    token = prompt("أدخل GitHub Personal Access Token (يُحفظ محليًا في المتصفح):");
    if (token) localStorage.setItem("gh_pat", token);
  }

  const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: {
        title: title || "بدون عنوان",
        content: content || ""
      }
    })
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    alert("❌ فشل إرسال الحفظ إلى GitHub.\n" + t);
    throw new Error("GitHub dispatch failed");
  } else {
    // نجاح
    console.log("✅ تم إرسال الحفظ إلى GitHub.");
  }
}

/* 
  استدعِ هذه بعد توليد المراسلة مباشرة لبدء الحفظ التلقائي.
  عدّل طريقة جلب العنوان/المحتوى بما يناسب هيكل صفحتك.
*/
window.triggerAutoSave = async function () {
  const titleEl   = document.querySelector("h1, h2, h3");
  const letterBox = document.getElementById("letterDisplay");
  const title   = (titleEl && titleEl.textContent) || "مراسلة";
  const content = (letterBox && letterBox.innerHTML) || document.body.innerHTML;
  await saveLetterToGitHub(title, content);
};

/* ========== 2) إعادة التهيئة + زر العودة ========== */

// تنظّف الصفحة بالكامل وتعيدها إلى وضع البداية
function resetLetterUI() {
  // عناصر عرض المراسلة
  const out  = document.getElementById("letterOutput");
  const disp = document.getElementById("letterDisplay");
  const edit = document.getElementById("letterEditor");

  if (disp) disp.innerHTML = "";
  if (out)  out.classList.add("hidden");
  if (edit) edit.classList.add("hidden");

  // إظهار الشاشة/النماذج الأساسية (حدّد المعرفات الصحيحة لديك)
  const catSel  = document.getElementById("categorySelection");   // شاشة اختيار الفئة
  const typeSec = document.getElementById("letterTypeSection");   // شاشة اختيار النوع
  const form    = document.getElementById("letterForm");          // نموذج الإدخال الرئيسي (إن وجد)

  if (catSel)  catSel.style.display  = "grid";
  if (typeSec) typeSec.style.display = "none";
  if (form) {
    try { form.reset(); } catch(_) {}
    form.classList.remove("hidden");
  }

  // مسح أي حقول خارج الفورم أيضًا
  document.querySelectorAll("input, textarea, select").forEach(el => {
    const t = (el.type || "").toLowerCase();
    if (t === "checkbox" || t === "radio") el.checked = false;
    else if (!["button","submit","reset","file"].includes(t)) el.value = "";
  });

  // مسح الحقول/الجداول الديناميكية إن وجدت
  const dyn = document.getElementById("dynamicFields");
  if (dyn) dyn.innerHTML = "";
  const tbl = document.getElementById("coursesTableBuilder");
  if (tbl) tbl.innerHTML = "";

  // تمرير لأعلى الصفح
