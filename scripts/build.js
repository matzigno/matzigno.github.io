#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sitePath = path.join(root, 'content', 'site.json');
const outputPath = path.join(root, 'index.html');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function externalLink(url, label, className = '') {
  const classAttribute = className ? ` class="${escapeHtml(className)}"` : '';
  return `<a${classAttribute} href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function renderLinkList(links) {
  return links
    .map((link) => `<li>${externalLink(link.url, link.label)}<span aria-hidden="true">↗</span></li>`)
    .join('\n              ');
}

function renderMetrics(metrics) {
  return metrics
    .map((metric) => `
            <div class="metric">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(metric.label)}</span>
              <small>${escapeHtml(metric.detail)}</small>
            </div>`)
    .join('');
}

function renderResearchAreas(areas) {
  return areas
    .map((area, index) => `
          <article class="research-card">
            <span class="card-number">0${index + 1}</span>
            <h3>${escapeHtml(area.title)}</h3>
            <p>${escapeHtml(area.description)}</p>
          </article>`)
    .join('');
}

function renderPublications(publications) {
  return publications
    .map((publication) => `
          <article class="publication">
            <p class="publication-year">${escapeHtml(publication.year)}</p>
            <div>
              <h3>${externalLink(publication.url, publication.title)}</h3>
              <p class="publication-authors">${escapeHtml(publication.authors)}</p>
              <p class="publication-venue">${escapeHtml(publication.venue)}</p>
            </div>
          </article>`)
    .join('');
}

function renderProjects(projects) {
  return projects
    .map((project) => `
          <article class="project-card">
            <p class="eyebrow">${escapeHtml(project.period)}</p>
            <h3>${escapeHtml(project.name)}</h3>
            <p class="project-subtitle">${escapeHtml(project.subtitle)}</p>
            <p>${escapeHtml(project.description)}</p>
          </article>`)
    .join('');
}

function renderTimeline(items, type) {
  return items
    .map((item) => `
          <li>
            <p class="timeline-period">${escapeHtml(item.period)}</p>
            <div>
              <h3>${escapeHtml(type === 'teaching' ? item.course : item.role)}</h3>
              <p>${escapeHtml(type === 'teaching' ? item.programme : item.institution)}</p>
            </div>
          </li>`)
    .join('');
}

function renderSimpleList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ');
}

function build() {
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
  const scholarLink = site.quick_links.find((link) => link.label === 'Google Scholar');
  const profileLink = site.quick_links.find((link) => link.label === 'University profile');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#102d43" />
  <title>${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#top" aria-label="${escapeHtml(site.brand)} home">
        <span class="brand-mark">${escapeHtml(site.profile.initials)}</span>
        <span>${escapeHtml(site.brand)}</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#research">Research</a>
        <a href="#publications">Publications</a>
        <a href="#projects">Projects</a>
        <a href="#teaching">Teaching</a>
        <a href="#service">Service</a>
        <a class="nav-contact" href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <section id="top" class="hero">
      <div class="hero-grid container">
        <div class="hero-copy">
          <p class="eyebrow">Network science · Graph machine learning · Data mining</p>
          <h1>${escapeHtml(site.profile.name)}</h1>
          <p class="hero-role">${escapeHtml(site.profile.role)}</p>
          <p class="hero-intro">${escapeHtml(site.profile.intro)}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#publications">Selected publications</a>
            ${externalLink(profileLink.url, 'University profile', 'button button-secondary')}
          </div>
        </div>
        <aside class="profile-card" aria-label="Profile summary">
          <div class="photo-frame">
            <img src="${escapeHtml(site.profile.photo)}" alt="${escapeHtml(site.profile.photo_alt)}" />
          </div>
          <div class="profile-card-body">
            <p class="profile-department">${escapeHtml(site.profile.department)}</p>
            <p>${escapeHtml(site.profile.university)}</p>
            <p>${escapeHtml(site.profile.location)}</p>
          </div>
        </aside>
      </div>
      <div class="container metrics" aria-label="Academic metrics">
${renderMetrics(site.metrics)}
        <p class="metrics-note">Scholar metrics: CV snapshot, 27 March 2026</p>
      </div>
    </section>

    <section id="research" class="section container">
      <div class="section-heading">
        <p class="eyebrow">Research</p>
        <h2>Understanding networks in motion.</h2>
        <p>${escapeHtml(site.profile.bio)}</p>
      </div>
      <div class="research-grid">
${renderResearchAreas(site.research)}
      </div>
    </section>

    <section id="publications" class="section section-tinted">
      <div class="container">
        <div class="section-heading split-heading">
          <div>
            <p class="eyebrow">Selected publications</p>
            <h2>Recent work.</h2>
          </div>
          ${externalLink(scholarLink.url, 'View all on Google Scholar ↗', 'text-link')}
        </div>
        <div class="publication-list">
${renderPublications(site.publications)}
        </div>
      </div>
    </section>

    <section id="projects" class="section container">
      <div class="section-heading">
        <p class="eyebrow">Projects</p>
        <h2>Applied research across domains.</h2>
        <p>Current and recent projects connect methodological work on graph learning with Web3, cybersecurity, biomedical data, and the digital humanities.</p>
      </div>
      <div class="project-grid">
${renderProjects(site.projects)}
      </div>
    </section>

    <section id="teaching" class="section section-dark">
      <div class="container two-column-section">
        <div class="section-heading">
          <p class="eyebrow">Teaching</p>
          <h2>Courses and supervision.</h2>
          <p>I teach graph machine learning, network science, social media analysis, and programming across undergraduate, graduate, doctoral, and postgraduate programmes.</p>
        </div>
        <ol class="timeline">
${renderTimeline(site.teaching, 'teaching')}
        </ol>
      </div>
    </section>

    <section id="service" class="section container">
      <div class="section-heading">
        <p class="eyebrow">Academic service</p>
        <h2>Community and recognition.</h2>
      </div>
      <div class="service-grid">
        <article class="list-card">
          <h3>Service</h3>
          <ul>
            ${renderSimpleList(site.service)}
          </ul>
        </article>
        <article class="list-card">
          <h3>Selected awards</h3>
          <ul>
            ${renderSimpleList(site.awards)}
          </ul>
        </article>
      </div>
    </section>

    <section class="section section-tinted">
      <div class="container two-column-section">
        <div class="section-heading">
          <p class="eyebrow">Career</p>
          <h2>Academic path.</h2>
        </div>
        <ol class="timeline timeline-light">
${renderTimeline(site.career, 'career')}
        </ol>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="container contact-grid">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Let’s discuss networks, data, and collaboration.</h2>
        </div>
        <div class="contact-details">
          <a class="email-link" href="mailto:${escapeHtml(site.profile.email)}">${escapeHtml(site.profile.email)}</a>
          <p>${escapeHtml(site.profile.department)}<br />${escapeHtml(site.profile.office)}</p>
          <ul class="link-list">
              ${renderLinkList(site.quick_links)}
          </ul>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>${site.footer}</p>
      <p>Static site designed for GitHub Pages.</p>
    </div>
  </footer>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Built ${path.relative(root, outputPath)} from content/site.json.`);
}

build();
