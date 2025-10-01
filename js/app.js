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

    }
}

const app = new App();