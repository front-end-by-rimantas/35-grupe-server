import { PageTemplate } from "../lib/PageTemplate.js";

class pageRegister extends PageTemplate {
    constructor(data) {
        super(data);
        this.jsForPage = 'register';
    }

    mainHTML() {
        return `<form>
                    <div class="notifications"></div>
                    <div>
                        <label>Email</label>
                        <input type="text">
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password">
                    </div>
                    <div>
                        <label>Repeat password</label>
                        <input type="password">
                    </div>
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>`;
    }
}

export { pageRegister }