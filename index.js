import { server } from "./lib/server.js";

const app = {};

app.init = () => {
    // sukurti pradinius folder'ius
    // sukurti pradinius file'us

    // prisijungti prie DB
    // paleisti (musu) serveri
    server.init();

    // pasikartojantys procesai:
    // - istrinti nenaudojamus failus
    // - su'zip'inti sena informacija
    // - atsinaujinti API informacija
}

app.init();

export { app };