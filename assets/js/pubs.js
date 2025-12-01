const csvPath = '/assets/papers.csv'; // Adjust path as needed

async function loadPublications() {
    let container = document.getElementById('publications-container');
    
    try {
    const response = await fetch(csvPath);
    if (!response.ok) {
        throw new Error('Failed to load publications CSV');
    }
    
    const csvText = await response.text();
    
    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: header => header.trim(),
        complete: function(results) {
        if (results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors);
        }
        
        if (results.data.length === 0) {
            container.innerHTML = '<p class="error">No publications found.</p>';
            return;
        }
        
        displayPublications(results.data);
        },
        error: function(error) {
        container.innerHTML = `<p class="error">Error parsing CSV: ${error.message}</p>`;
        }
    });
    } catch (error) {
    container.innerHTML = `<p class="error">Error loading publications: ${error.message}</p>`;
    console.error(error);
    }
}

function displayPublications(publications) {
    const container = document.getElementById('publications-container');
    
    const listHTML = publications.map(pub => {
    const title = pub.title || 'Untitled';
    const authors = pub.authors ? pub.authors.replace(/Matthew Varona/g, '<span style="text-decoration:underline;font-style:italic;">Matthew Varona</span>') : '';
    const venue = pub.venue || '';
    const summary = pub.summary || '';
    const icon = pub.icon || '';
    const paperLink = pub.paper_link || '';
    let bibtex = pub.bibtex || '';
    // add a delegated click handler for BibTeX links and a single modal UI (only once)
    if (!window._bibModalInitialized) {
        // create modal
        const modal = document.createElement('div');
        modal.id = 'bib-modal';
        modal.style.cssText = `
            display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
            align-items:center; justify-content:center; z-index:9999; padding:1rem;
        `;
        modal.innerHTML = `
            <div style="background:#fff; max-width:800px; width:100%; border-radius:8px; padding:1rem; box-shadow:0 8px 24px rgba(0,0,0,0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:.5rem;">
                    <strong>BibTeX</strong>
                    <div style="display:flex; gap:.5rem;">
                        <button id="bib-copy-btn" class="pub-link bibtex" style="background:#2ecc71;">Copy</button>
                        <button id="bib-close-btn" class="pub-link bibtex" style="background:#e74c3c;">Close</button>
                    </div>
                </div>
                <div style="max-height:60vh; overflow:auto; background:#f7f7f7; padding:.75rem; border-radius:4px;">
                    <pre id="bib-modal-content" style="white-space:pre-wrap; margin:0; font-family:monospace; font-size:.9rem;"></pre>
                </div>
                <div id="bib-modal-status" style="margin-top:.5rem; color:#555; font-size:.9rem;"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const pre = modal.querySelector('#bib-modal-content');
        const closeBtn = modal.querySelector('#bib-close-btn');
        const copyBtn = modal.querySelector('#bib-copy-btn');
        const status = modal.querySelector('#bib-modal-status');

        function showModal() { modal.style.display = 'flex'; }
        function hideModal() { modal.style.display = 'none'; pre.textContent = ''; status.textContent = ''; }

        closeBtn.addEventListener('click', hideModal);
        modal.addEventListener('click', (ev) => { if (ev.target === modal) hideModal(); });

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(pre.textContent || '');
                status.textContent = 'Copied to clipboard';
                setTimeout(() => { status.textContent = ''; }, 2000);
            } catch (err) {
                status.textContent = 'Could not copy to clipboard';
            }
        });

        // helper to detect if a string looks like a URL
        function looksLikeUrl(s) {
            return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s) || s.startsWith('/') || s.startsWith('./') || s.startsWith('../') || /\.bib(\?.*)?$/.test(s);
        }

        // show BibTeX content from either raw text or by fetching a URL
        window.showBib = async function(source) {
            pre.textContent = 'Loading…';
            status.textContent = '';
            showModal();

            // try to read raw attribute value as-is first (may contain actual bibtex)
            if (!source) {
                pre.textContent = '(no content)';
                return;
            }

            if (looksLikeUrl(source)) {
                try {
                    const res = await fetch(source, {cache: 'no-store'});
                    if (!res.ok) throw new Error('Failed to fetch');
                    const text = await res.text();
                    pre.textContent = text;
                } catch (err) {
                    pre.textContent = `Error fetching BibTeX: ${err.message}`;
                }
            } else {
                // treat as raw BibTeX text (getAttribute will give original string)
                try {
                    // If the string was HTML-escaped when put into href, decode common HTML entities
                    const decoded = source.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
                    pre.textContent = decoded;
                } catch (err) {
                    pre.textContent = source;
                }
            }
        };

        // delegated click handler for any bibtex link within publications
        document.addEventListener('click', (ev) => {
            const a = ev.target.closest('a.pub-link.bibtex');
            if (!a) return;
            ev.preventDefault();
            const raw = a.getAttribute('href') || '';
            // showBib expects the original href string; this covers both URL and raw-text cases
            window.showBib(raw);
        });

        window._bibModalInitialized = true;
    }

    // for the current publication item, convert raw bibtex field into a safe href string
    // ensure we don't break the existing template that uses the bibtex variable in href
    if (bibtex) {
        // prefer keeping a direct URL if it's clearly a link; otherwise use the raw content but keep it as an href string
        const safeHref = (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(bibtex) || bibtex.startsWith('/') || bibtex.endsWith('.bib')) ? bibtex : bibtex;
        // overwrite the bibtex variable that the template will insert as href so the click handler sees it
        bibtex = safeHref;
    }
    return `
        <li class="publication-item">
        <div class="pub-icon"><img src="${icon}" alt="Publication icon"></div>
        <div class="pub-info">
            <span class="pub-venue">${venue}</span>
            <div class="pub-title">${title}</div>
            <div class="pub-authors">${authors}</div>
            <div class="pub-summary">${summary}</div>
            <div class="pub-links">
                ${paperLink ? `<a href="${paperLink}" class="pub-link" target="_blank" rel="noopener">Paper</a>` : ''}
                ${bibtex ? `<a href="${bibtex}" class="pub-link bibtex" target="_blank" rel="noopener">BibTeX</a>` : ''}
            </div>
        </div>
        </li>
    `;
    }).join('');
    
    container.innerHTML = `<ul class="publications-list">${listHTML}</ul>`;
}

loadPublications();
