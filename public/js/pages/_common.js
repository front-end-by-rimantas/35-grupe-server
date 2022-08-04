// Failas skirtas bendrai logikai,
// kuri turi suktis visuose puslapiuose

console.log('Bendras JS');

const logoutDOM = document.getElementById('logout');
if (logoutDOM) {
    logoutDOM.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Bandau atsijungti nuo sistemos...');

        const response = await fetch('/api/token', {
            method: 'DELETE',
        })
    })
}