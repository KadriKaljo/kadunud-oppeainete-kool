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

    startAdventure() {
        startTextAdventure();
    }

    //nav
    showSection(sectionName) {
        if (sectionName === 'all') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const targetSection = document.querySelector(`.${sectionName}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

const app = new App();