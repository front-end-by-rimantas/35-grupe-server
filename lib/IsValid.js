class IsValid {
    static email(str) {
        // VALIDUS
        // vardenis@pastas.lt
        // vardenis+1@pastas.lt
        // vardenis@inbox.pastas.lt
        // vardenis@pastas.co.uk
        // vardenis@inbox.pastas.co.uk
        // vardenis.pavardenis@pastas.lt
        // vardenis-pavardenis@pastas.lt
        // vardenis@super-pastas.lt
        // vardenis@pastas2.lt
        // vardenis2@pastas.lt

        // NEVALIDUS
        // @pastas.lt
        // vardenis@
        // vardenispastas.lt
        // vardenis@pastaslt
        // @vardenis@pastas.lt
        // varde@nis@pastas.lt
        // vardenis@@pastas.lt
        // vardenis@pastas.lt@
        // 5vardenis@pastas.lt
        // vardenis@pastas..uk
        // vardenis..pavardenis@pastas.lt
        // !@pastas.lt
        // vardenis@!.!

        if (typeof str !== 'string'
            || str === '') {
            return [true, 'Email turi buti ne tuscias tekstas'];
        }

        if (!str.includes('@')) {
            return [true, 'Email turi tureti @ simboli'];
        }

        return [false, 'OK'];
    }

    static password(str) {
        if (typeof str !== 'string'
            || str === '') {
            return [true, 'Password turi buti ne tuscias tekstas'];
        }
        return [false, 'OK'];
    }
}

export { IsValid }