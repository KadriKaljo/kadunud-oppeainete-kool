class App {
    constructor() {}

    loadModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');

            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.opacity = '1';
            modal.style.zIndex = '9999';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');

            modal.style.display = '';
            modal.style.alignItems = '';
            modal.style.justifyContent = '';
            modal.style.opacity = '';
            modal.style.zIndex = '';
        }
    }

    handleApplication(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const name = formData.get('name') || event.target.querySelector('input[type="text"]').value;

        if (name.trim()) {
            this.loadModal('application-result');
            const resultDiv = document.querySelector('.application-result');
            resultDiv.innerHTML = `
                <h3>Application Status</h3>
                <p>Thank you, ${name}! Your application to the School of Forgotten Subjects has been received.</p>
                <p>🎮 While you wait for admission, would you like to explore the school in our interactive adventure?</p>
                <button class="btn btn-primary" onclick="startTextAdventure(); app.closeModal('application-result');">
                    Start Adventure
                </button>
                <button class="btn btn-secondary" onclick="app.closeModal('application-result')">
                    Close
                </button>
            `;
        }
    }

    startAdventure() {
        startTextAdventure();
    }

    //nav
    showSection(sectionName) {
        const sections = document.querySelectorAll('main section');

        if (sectionName === 'all') {
            sections.forEach(section => section.style.display = 'block');
        } else {
            sections.forEach(section => section.style.display = 'none');

            const targetSection = document.querySelector(`.${sectionName}`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        }
    }
}

const app = new App();