async function saveLetterToGitHub(title, content) {
  const repoOwner = "nif305";
  const repoName = "auto-mail";
  const eventType = "save-letter";

  let token = localStorage.getItem("gh_pat") || "";
  if (!token) {
    token = prompt("أدخل GitHub Personal Access Token:");
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
    console.log("✅ تم إرسال الحفظ إلى GitHub.");
  }
}

window.triggerAutoSave = async function () {
  const titleEl = document.querySelector("h1, h2, h3");
  const letterBox = document.getElementById("letterDisplay");
  const title = (titleEl && titleEl.textContent) || "مراسلة";
  const content = (letterBox && letterBox.innerHTML) || document.body.innerHTML;
  await saveLetterToGitHub(title, content);
};

function hideEl(el) {
  if (!el) return;
  if (el.classList) el.classList.add("hidden");
  else el.style.display = "none";
}

function showEl(el, display = "block") {
  if (!el) return;
  if (el.classList) el.classList.remove("hidden");
  else el.style.display = display;
}

window.resetLetterUI = function () {
  const out = document.getElementById("letterOutput");
  const disp = document.getElementById("letterDisplay");
  const edit = document.getElementById("letterEditor");

  if (disp) disp.innerHTML = "";
  hideEl(edit);
  hideEl(out);

  const catSel = document.getElementById("categorySelection");
  const typeSec = document.getElementById("letterTypeSection");
  const form = document.getElementById("letterForm");

  if (catSel) showEl(catSel, "grid");
  if (typeSec) hideEl(typeSec);
  if (form) {
    try { form.reset(); } catch (_) {}
    form.classList.remove("hidden");
    form.style.display = "";
  }

  document.querySelectorAll("input, textarea, select").forEach(el => {
    const t = (el.type || "").toLowerCase();
    if (t === "checkbox" || t === "radio") el.checked = false;
    else if (!["button", "submit", "reset", "file"].includes(t)) el.value = "";
  });

  const dyn = document.getElementById("dynamicFields");
  if (dyn) dyn.innerHTML = "";
  const tbl = document.getElementById("coursesTableBuilder");
  if (tbl) tbl.innerHTML = "";
  if (typeof window.courseRowCounter !== "undefined") window.courseRowCounter = 0;

  window.scrollTo({ top: 0, behavior: "smooth" });
};
