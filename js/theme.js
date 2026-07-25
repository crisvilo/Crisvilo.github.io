/*=========================================
        MODO OSCURO / CLARO
=========================================*/

(function(){

    const STORAGE_KEY = "theme-preference";

    function applyTheme(theme){

        document.documentElement.setAttribute("data-theme", theme);

        const icon = document.querySelector("#themeToggle i");

        if (icon) {
            icon.className = theme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }

    }

    function getPreferredTheme(){

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return saved;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

    }

    document.addEventListener("DOMContentLoaded", () => {

        applyTheme(getPreferredTheme());

        document
            .getElementById("themeToggle")
            .addEventListener("click", () => {

                const current = document.documentElement.getAttribute("data-theme");
                const next = current === "dark" ? "light" : "dark";

                applyTheme(next);

                localStorage.setItem(STORAGE_KEY, next);

            });

    });

})();  