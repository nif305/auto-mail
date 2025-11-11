// app.js
// إرسال المراسلات تلقائيًا إلى GitHub Action "Save Letter (Auto)"

async function saveLetterToGitHub(title, content) {
  const repoOwner = "nif305"; // غيّرها إذا كان اسم المستخدم مختلف
  const repoName = "auto-mail"; // اسم المستودع
  const eventType = "save-letter"; // اسم الحدث في workflow

  const token = ""; 
  // ⚠️ ملاحظة: لا تحتاج لتعبئة التوكن هنا لأن GitHub Actions تستخدم GITHUB_TOKEN تلقائيًا عند التنفيذ داخل المستودع
  // هذا السكربت يرسل طلب repository_dispatch إلى GitHub API
  
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token || prompt("أدخل Personal Access Token إذا كنت خارج GitHub Actions:")}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: {
        title: title || "بدون عنوان",
        content: content || "محتوى فارغ"
      }
    })
  });

  if (response.ok) {
    alert("✅ تم حفظ المراسلة تلقائيًا في GitHub (data/letters).");
  } else {
    alert("❌ حدث خطأ أثناء الإرسال إلى GitHub.");
  }
}

// مثال على الاستخدام التلقائي بعد توليد المراسلة
document.addEventListener("DOMContentLoaded", () => {
  // استبدل هذه الوظيفة باستدعاء فعلي بعد توليد الرسالة من نموذجك
  const exampleTitle = "اختبار المراسلة التلقائية";
  const exampleContent = "<p>هذه تجربة حفظ تلقائي.</p>";
  saveLetterToGitHub(exampleTitle, exampleContent);
});
// ===== زر العودة للصفحة الرئيسية =====
document.getElementById("homeBtn").addEventListener("click", function () {
  // إخفاء مخرجات المراسلة
  document.getElementById("letterOutput").classList.add("hidden");

  // إظهار نموذج الإدخال من جديد
  const form = document.getElementById("letterForm");
  if (form) {
    form.reset(); // يمسح كل الحقول
    form.classList.remove("hidden");
  }

  // التمرير لأعلى الصفحة (اختياري)
  window.scrollTo({ top: 0, behavior: "smooth" });
});
