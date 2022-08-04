import { IsValid } from '../components/IsValid.js';
import { request } from '../components/request.js';

const formDOM = document.querySelector('form');
const notificationsDOM = document.querySelector('.notifications');
const inputsDOM = formDOM.querySelectorAll('input');
const submitDOM = formDOM.querySelector('button');

submitDOM.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = inputsDOM[0].value;
    const pass = inputsDOM[1].value;
    const repass = inputsDOM[2].value;

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return notificationsDOM.textContent = emailMsg;
    }

    const [passErr, passMsg] = IsValid.password(pass);
    if (passErr) {
        return notificationsDOM.textContent = passMsg;
    }

    if (pass !== repass) {
        return notificationsDOM.textContent = 'Slaptazodziai turi sutapti';
    }

    // surinkti duomenis
    const data = { email, pass };

    // juos issiusti i serverio API
    await request('/api/account', 'POST', data, {
        notificationsDOM,
    });
})