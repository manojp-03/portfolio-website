async function loadProjects() {
    try {
        const res = await fetch('/projects');
        const data = await res.json();

        const container = document.getElementById('project-list');

        container.innerHTML = data.map(p => `
            <div class="card" data-aos="zoom-in">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
            </div>
        `).join('');

        if (window.AOS) AOS.refresh();

    } catch (err) {
        console.log("Error loading projects:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadProjects);