import { IsValid } from './components/IsValid.js';

const formDOM = document.querySelector('form');
const inputsDOM = formDOM.querySelectorAll('input');
const submitDOM = formDOM.querySelector('button');

submitDOM.addEventListener('click', (e) => {
    e.preventDefault();

    const email = inputsDOM[0].value;
    const pass = inputsDOM[1].value;
    const repass = inputsDOM[2].value;

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return console.log(emailMsg);
    }

    const [passErr, passMsg] = IsValid.password(pass);
    if (passErr) {
        return console.log(passMsg);
    }

    if (pass !== repass) {
        return console.log('Slaptazodziai turi sutapti');
    }

    // surinkti duomenis
    const data = { email, pass };
    console.log(data);

    // juos issiusti i serverio API
    fetch('/api/account', {
        method: 'POST',
        body: JSON.stringify(data),
    })

    // is serverio gausim atsakyma:
    // - jei gerai - OK
    // - jei NE gerai - klaidos pranesimas
})