document.addEventListener("DOMContentLoaded", function () {
    // Az űrlap elemeinek lekérése
    const kartyaSzamInput = document.getElementById("kartyaSzam");
    const kartyaNevInput = document.getElementById("kartyaNev");
    const cvcInput = document.getElementById("cvc");
    const lejaratInput = document.getElementById("lejarat");
    const kartyaMenteseCheckbox = document.getElementById("kartyaMentese");
    const gomb = document.getElementById("gomb");

    // Ellenőrzés: van-e már mentett kártyaadat
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (var cookie of cookies) {
            var [key, value] = cookie.split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return "";
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Ha van mentett adat, töltse be
    if (getCookie("kartyaSzam")) {
        kartyaSzamInput.value = getCookie("kartyaSzam");
        kartyaNevInput.value = getCookie("kartyaNev");
        cvcInput.value = getCookie("cvc");
        lejaratInput.value = getCookie("lejarat");
        kartyaMenteseCheckbox.checked = true;
    }

    // Gomb eseménykezelő
    gomb.addEventListener("click", function () {
        if (kartyaMenteseCheckbox.checked) {
            // Kártyaadatok mentése 30 napra
            setCookie("kartyaSzam", kartyaSzamInput.value, 30);
            setCookie("kartyaNev", kartyaNevInput.value, 30);
            setCookie("cvc", cvcInput.value, 30);
            setCookie("lejarat", lejaratInput.value, 30);
        } else {
            // Ha nincs bejelölve, töröljük a cookie-kat
            deleteCookie("kartyaSzam");
            deleteCookie("kartyaNev");
            deleteCookie("cvc");
            deleteCookie("lejarat");
        }

        // Oldal újratöltése
        location.reload();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const kartyaSzamInput = document.getElementById("kartyaSzam");
    const cvcInput = document.getElementById("cvc");
    const lejaratInput = document.getElementById("lejarat");

    // Kártyaszám: Csak számokat engedélyezünk, és pontosan 16 számjegy lehet
    kartyaSzamInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Csak számok
        if (this.value.length > 16) {
            this.value = this.value.slice(0, 16); // Maximum 16 karakter
        }
    });

    // CVC: Csak 3 számjegy lehet
    cvcInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Csak számok
        if (this.value.length > 3) {
            this.value = this.value.slice(0, 3); // Maximum 3 karakter
        }
    });

    // Lejárati dátum: Formátum HH/ÉÉ (pl. 12/25)
    lejaratInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Csak számokat engedünk
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4); // Maximum 4 számjegy (MMYY)
        }

        if (this.value.length === 4) {
            this.value = this.value.slice(0, 2) + "/" + this.value.slice(2); // Automatikus formázás
        }
    });

    // Lejárati dátum: Ellenőrzés (nem lehet múltbeli)
    lejaratInput.addEventListener("blur", function () {
        const now = new Date();
        const currentYear = now.getFullYear() % 100; // Utolsó két számjegy
        const currentMonth = now.getMonth() + 1; // 1-12 hónapok

        let [month, year] = this.value.split("/").map(num => parseInt(num));

        if (month < 1 || month > 12) {
            alert("Hibás hónap! (1-12)");
            this.value = "";
            return;
        }

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            alert("A kártya lejárt!");
            this.value = "";
        }
    });
});
