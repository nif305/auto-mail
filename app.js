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
    alert("فشل إرسال الحفظ إلى GitHub.\n" + t);
    throw new Error("GitHub dispatch failed");
  } else {
    console.log("تم إرسال الحفظ إلى GitHub.");
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
function resetLetterUI() {
  var out  = document.getElementById('letterOutput');
  var disp = document.getElementById('letterDisplay');
  var edit = document.getElementById('letterEditor');

  if (disp) disp.innerHTML = '';
  if (edit) edit.classList.add('hidden');
  if (out)  out.classList.add('hidden');

  var cat  = document.getElementById('categorySelection');
  var type = document.getElementById('letterTypeSection');
  var form = document.getElementById('letterForm');

  if (cat)  { cat.classList.remove('hidden'); cat.style.display = 'grid'; }
  if (type) { type.classList.add('hidden'); }
  if (form) { try { form.reset(); } catch(_) {} form.classList.remove('hidden'); form.style.display = ''; }

  Array.prototype.forEach.call(document.querySelectorAll('input,textarea,select'), function (el) {
    var t = (el.type || '').toLowerCase();
    if (t === 'checkbox' || t === 'radio') el.checked = false;
    else if (['button','submit','reset','file'].indexOf(t) === -1) el.value = '';
  });

  var dyn = document.getElementById('dynamicFields');       if (dyn) dyn.innerHTML = '';
  var tbl = document.getElementById('coursesTableBuilder'); if (tbl) tbl.innerHTML = '';
  if (typeof window.courseRowCounter !== 'undefined') window.courseRowCounter = 0;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'homeBtn') {
    e.preventDefault();
    resetLetterUI();
  }
})
