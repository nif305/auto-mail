// app.js — إرسال المراسلات تلقائيًا إلى GitHub Action عبر repository_dispatch
async function saveLetterToGitHub(title, content) {
  const repoOwner = "nif305";     // غيّرها إذا احتجت
  const repoName  = "auto-mail";  // اسم المستودع
  const eventType = "save-letter";

  // ستحتاج Personal Access Token عند التشغيل من المتصفح (GitHub Pages)
  // أدخل التوكن مرة واحدة وسيحفظه المتصفح محليًا (اختياري)
  let token = localStorage.getItem("gh_pat") || "";
  if (!token) {
    token = prompt("أدخل GitHub Personal Access Token (يُفضَّل Fine-grained بحد أدنى من الصلاحيات):");
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
    const t = await res.text();
    alert("❌ فشل إرسال الطلب إلى GitHub. " + t);
  } else {
    alert("✅ تم حفظ المراسلة تلقائيًا في data/letters/");
  }
}

// نادِ هذه الدالة مباشرة بعد توليد المراسلة من صفحتك
// مثال عام (عدّل حسب صفحتك):
window.triggerAutoSave = () => {
  const title   = document.querySelector("h1,h2,h3")?.textContent || "مراسلة";
  const content = document.querySelector("#letterDisplay")?.innerHTML || document.body.innerHTML;
  saveLetterToGitHub(title, content);
};
