/**
 * Patients list page
 */
(function () {
  "use strict";
  const user = Auth.requireAuth();
  if (!user) return;
  Auth.renderShell(user, "patients.html");

  const content = document.getElementById("pageContent");
  content.insertAdjacentHTML("beforeend",
    '<div class="page-head fade-in-up">' +
      '<div class="left"><div class="icon-pill"><i class="fa-solid fa-user-injured"></i></div>' +
      '<div><div class="page-title">Patients</div><div class="page-sub" id="patientCount">Loading patients…</div></div></div>' +
      '<div class="actions">' +
        '<button class="btn btn-ghost" id="exportCsv"><i class="fa-solid fa-file-csv"></i> Export CSV</button>' +
        '<button class="btn btn-ghost" id="printBtn"><i class="fa-solid fa-print"></i> Print</button>' +
        '<a href="add-patient.html" class="btn"><i class="fa-solid fa-plus"></i> Add Patient</a>' +
      '</div></div>' +
    '<div class="table-wrap fade-in-up">' +
      '<div class="table-toolbar">' +
        '<div class="search"><i class="fa-solid fa-magnifying-glass"></i><input class="input" id="search" placeholder="Search by name, ID, disease, phone…" /></div>' +
        '<select class="select" id="filterDept" style="max-width:220px"><option value="">All Departments</option></select>' +
        '<select class="select" id="filterStatus" style="max-width:180px"><option value="">All Status</option><option>Admitted</option><option>Discharged</option><option>Emergency</option><option>Pending</option></select>' +
        '<select class="select" id="sortBy" style="max-width:180px"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A-Z</option><option value="age">Age</option></select>' +
      '</div>' +
      '<div class="table-scroll"><table class="data" id="ptable"><thead><tr>' +
      '<th>Patient</th><th>Patient ID</th><th>Gender</th><th>Age</th><th>Blood</th><th>Disease</th><th>Doctor</th><th>Department</th><th>Phone</th><th>Admission</th><th>Status</th><th>Actions</th>' +
      '</tr></thead><tbody id="pbody"></tbody></table></div>' +
      '<div class="pagination" id="pager"></div>' +
    '</div>'
  );

  let all = [];
  let page = 1;
  const size = 10;

  async function load() {
    const body = document.getElementById("pbody");
    body.innerHTML = '<tr><td colspan="12"><div class="loading-overlay"><div class="spinner"></div>Loading…</div></td></tr>';
    try {
      all = await API.list("patients");
      const depts = await API.list("departments");
      const sel = document.getElementById("filterDept");
      depts.forEach((d) => { const o = document.createElement("option"); o.value = d.name; o.textContent = d.name; sel.appendChild(o); });
      render();
    } catch (e) {
      body.innerHTML = '<tr><td colspan="12"><div class="empty-state">Could not load patients: ' + Utils.escapeHtml(e.message) + '</div></td></tr>';
    }
  }

  function filtered() {
    const q = document.getElementById("search").value.trim().toLowerCase();
    const dept = document.getElementById("filterDept").value;
    const status = document.getElementById("filterStatus").value;
    const sort = document.getElementById("sortBy").value;
    let rows = all.slice();
    if (q) rows = rows.filter((p) => (p.firstName + " " + p.lastName + " " + p.id + " " + (p.disease || "") + " " + (p.phone || "") + " " + (p.email || "")).toLowerCase().includes(q));
    if (dept) rows = rows.filter((p) => p.department === dept);
    if (status) rows = rows.filter((p) => p.status === status);
    if (sort === "newest") rows.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sort === "oldest") rows.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    else if (sort === "name") rows.sort((a, b) => (a.firstName + " " + a.lastName).localeCompare(b.firstName + " " + b.lastName));
    else if (sort === "age") rows.sort((a, b) => (Number(Utils.calcAge(a.dob)) || 0) - (Number(Utils.calcAge(b.dob)) || 0));
    return rows;
  }

  function render() {
    const rows = filtered();
    document.getElementById("patientCount").textContent = all.length + (all.length === 1 ? " patient" : " patients") + " • showing " + rows.length + " matched";
    const pg = Utils.paginate(rows, page, size);
    const body = document.getElementById("pbody");
    if (!pg.data.length) {
      body.innerHTML = '<tr><td colspan="12"><div class="empty-state"><i class="fa-solid fa-user-injured"></i>No patients found. Click <b>Add Patient</b> to create one.</div></td></tr>';
    } else {
      body.innerHTML = pg.data.map((p) =>
        '<tr>' +
        '<td data-label="Patient"><div class="row-cell">' + Utils.avatarHtml(p.firstName + " " + p.lastName, p.photo, 36) +
        '<div class="meta"><b>' + Utils.escapeHtml(p.firstName + " " + p.lastName) + '</b><small>' + Utils.escapeHtml(p.gender || "") + '</small></div></div></td>' +
        '<td data-label="Patient ID"><b>' + Utils.escapeHtml(p.id) + '</b></td>' +
        '<td data-label="Gender">' + Utils.escapeHtml(p.gender || "—") + '</td>' +
        '<td data-label="Age">' + Utils.escapeHtml(Utils.calcAge(p.dob) || "—") + '</td>' +
        '<td data-label="Blood">' + Utils.escapeHtml(p.blood || "—") + '</td>' +
        '<td data-label="Disease">' + Utils.escapeHtml(p.disease || "—") + '</td>' +
        '<td data-label="Doctor">' + Utils.escapeHtml(p.doctor || "—") + '</td>' +
        '<td data-label="Department">' + Utils.escapeHtml(p.department || "—") + '</td>' +
        '<td data-label="Phone">' + Utils.escapeHtml(p.phone || "—") + '</td>' +
        '<td data-label="Admission">' + Utils.escapeHtml(Utils.fmtDate(p.admissionDate)) + '</td>' +
        '<td data-label="Status">' + Utils.statusBadge(p.status) + '</td>' +
        '<td data-label="Actions"><div class="row-actions">' +
        '<button class="view" data-view="' + Utils.escapeHtml(p.id) + '" title="View"><i class="fa-solid fa-eye"></i></button>' +
        '<button class="edit" data-edit="' + Utils.escapeHtml(p.id) + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
        '<button class="del" data-del="' + Utils.escapeHtml(p.id) + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div></td></tr>'
      ).join("");
    }
    renderPager(pg);
  }

  function renderPager(pg) {
    const pager = document.getElementById("pager");
    const btns = [];
    for (let i = 1; i <= pg.pages; i++) btns.push('<button class="' + (i === pg.page ? "active" : "") + '" data-page="' + i + '">' + i + '</button>');
    pager.innerHTML = '<div class="info">Showing ' + ((pg.page - 1) * pg.size + 1) + '–' + Math.min(pg.page * pg.size, pg.total) + ' of ' + pg.total + '</div>' +
      '<div class="pages"><button data-page="' + Math.max(1, pg.page - 1) + '" ' + (pg.page === 1 ? "disabled" : "") + '><i class="fa-solid fa-chevron-left"></i></button>' + btns.join("") +
      '<button data-page="' + Math.min(pg.pages, pg.page + 1) + '" ' + (pg.page === pg.pages ? "disabled" : "") + '><i class="fa-solid fa-chevron-right"></i></button></div>';
  }

  document.getElementById("search").addEventListener("input", Utils.debounce(() => { page = 1; render(); }, 250));
  document.getElementById("filterDept").addEventListener("change", () => { page = 1; render(); });
  document.getElementById("filterStatus").addEventListener("change", () => { page = 1; render(); });
  document.getElementById("sortBy").addEventListener("change", () => render());
  document.getElementById("pager").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-page]"); if (!b) return; page = parseInt(b.getAttribute("data-page"), 10); render();
  });

  document.getElementById("pbody").addEventListener("click", async (e) => {
    const v = e.target.closest("[data-view]"); const ed = e.target.closest("[data-edit]"); const dl = e.target.closest("[data-del]");
    if (v) window.location.href = "patient-details.html?id=" + encodeURIComponent(v.getAttribute("data-view"));
    else if (ed) window.location.href = "add-patient.html?id=" + encodeURIComponent(ed.getAttribute("data-edit"));
    else if (dl) {
      if (!confirm("Delete this patient? This cannot be undone.")) return;
      await API.removeOne("patients", dl.getAttribute("data-del"));
      Validation.toast("Patient deleted", "success");
      load();
    }
  });

  document.getElementById("exportCsv").addEventListener("click", () => {
    const rows = filtered().map((p) => ({
      id: p.id, name: p.firstName + " " + p.lastName, gender: p.gender, age: Utils.calcAge(p.dob),
      blood: p.blood, disease: p.disease, doctor: p.doctor, department: p.department, phone: p.phone,
      admission: p.admissionDate, status: p.status,
    }));
    Utils.exportCSV("patients.csv", rows);
    Validation.toast("CSV exported", "success");
  });

  document.getElementById("printBtn").addEventListener("click", () => Utils.printArea(document.querySelector(".table-wrap")));

  load();
})();
