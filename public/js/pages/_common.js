// Failas skirtas bendrai logikai,
// kuri turi suktis visuose puslapiuose

import { request } from "../components/request.js";

const logoutDOM = document.getElementById('logout');
if (logoutDOM) {
    logoutDOM.addEventListener('click', async (e) => {
        e.preventDefault();

        await request('/api/token', 'DELETE');
    })
}