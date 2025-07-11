document.addEventListener('DOMContentLoaded', () => {
  /* ---------- dark-mode toggle ---------- */
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const applyTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  };
  applyTheme();
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = body.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      applyTheme();
    });
  }

  /* ---------- smooth scroll nav links ---------- */
  document.querySelectorAll('nav a').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    })
  );

  /* ---------- fetch YOUR GitHub repos ---------- */
  async function loadMyRepos() {
    const container = document.getElementById('repo-grid');
    try {
      const res = await fetch('https://api.github.com/users/Vikas091234/repos?sort=updated');
      const repos = await res.json();
      container.innerHTML = '';
      repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description.'}</p>
          <div class="actions">
            <a class="btn-small btn-primary" href="${repo.html_url}" target="_blank" rel="noopener">View Code</a>
          </div>
        `;
        container.appendChild(card);
      });
    } catch {
      container.innerHTML = '<p>Could not load repositories.</p>';
    }
  }

  /* ---------- localStorage helpers ---------- */
  const STORAGE_KEY = 'vikas-portfolio-data';
  const loadData = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"extraProjects":[],"certificates":[]}');
  const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  /* ---------- render ---------- */
  function renderExtraProjects() {
    const data = loadData();
    const grid = document.getElementById('extra-projects-grid');
    grid.innerHTML = '';
    data.extraProjects.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.innerHTML = `
        <input type="checkbox" class="card-checkbox" data-type="project" data-idx="${idx}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        ${p.url ? `<a class="btn-small btn-primary" href="${p.url}" target="_blank">View</a>` : ''}
      `;
      grid.appendChild(card);
    });
  }

  function renderCertificates() {
    const data = loadData();
    const grid = document.getElementById('certificates-grid');
    grid.innerHTML = '';
    data.certificates.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.innerHTML = `
        <input type="checkbox" class="card-checkbox" data-type="certificate" data-idx="${idx}">
        <h3>${c.title}</h3>
        ${c.url ? `<a class="btn-small btn-primary" href="${c.url}" target="_blank">Show</a>` : ''}
      `;
      grid.appendChild(card);
    });
  }

  /* ---------- add / delete ---------- */
  function addProject() {
    const name = document.getElementById('proj-name').value.trim();
    const desc = document.getElementById('proj-desc').value.trim();
    const url  = document.getElementById('proj-link').value.trim();
    if (!name) return alert('Project name required');
    const data = loadData();
    data.extraProjects.push({ name, desc, url });
    saveData(data);
    renderExtraProjects();
    document.getElementById('proj-name').value = '';
    document.getElementById('proj-desc').value = '';
    document.getElementById('proj-link').value = '';
  }

  function addCertificate() {
    const title = document.getElementById('cert-title').value.trim();
    const url   = document.getElementById('cert-link').value.trim();
    if (!title) return alert('Certificate title required');
    const data = loadData();
    data.certificates.push({ title, url });
    saveData(data);
    renderCertificates();
    document.getElementById('cert-title').value = '';
    document.getElementById('cert-link').value = '';
  }

  function deleteSelected() {
    const data = loadData();
    const checked = document.querySelectorAll('.card-checkbox:checked');
    const toDelete = Array.from(checked).map(cb => ({
      type: cb.dataset.type,
      idx: Number(cb.dataset.idx)
    }));
    toDelete.sort((a, b) => b.idx - a.idx); // splice from bottom
    toDelete.forEach(({ type, idx }) => {
      const key = type === 'project' ? 'extraProjects' : 'certificates';
      data[key].splice(idx, 1);
    });
    saveData(data);
    renderExtraProjects();
    renderCertificates();
    toggleBatchBar();
  }

  function toggleBatchBar() {
    const any = document.querySelectorAll('.card-checkbox:checked').length > 0;
    document.getElementById('batch-bar').classList.toggle('show', any);
  }

  /* checkbox/select-all listeners */
  document.addEventListener('change', (e) => {
    if (e.target.id === 'select-all') {
      document.querySelectorAll('.card-checkbox').forEach(cb => cb.checked = e.target.checked);
    }
    toggleBatchBar();
  });

  /* ---------- init ---------- */
  loadMyRepos();
  renderExtraProjects();
  renderCertificates();
  document.getElementById('year').textContent = new Date().getFullYear();
});
/* toggle add-project form */
function toggleAddProjectForm() {
  const form = document.getElementById('add-project-form');
  form.style.display = form.style.display === 'none' ? 'grid' : 'none';
}

/* toggle add-certificate form */
function toggleAddCertificateForm() {
  const form = document.getElementById('add-certificate-form');
  form.style.display = form.style.display === 'none' ? 'grid' : 'none';
}