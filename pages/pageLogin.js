import { PageTemplate } from "../lib/PageTemplate.js";

class pageLogin extends PageTemplate {
    constructor(data) {
        super(data);
        this.jsForPage = 'login';
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
                        <button type="submit">Login</button>
                    </div>
                </form>`;
    }
}

export { pageLogin }