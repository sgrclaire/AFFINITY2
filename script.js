// Gestion du thème (similarité / opposition) et du test de personnalité

(function () {
  const body = document.body;
  const modeLabel = document.getElementById("mode-label");
  const testForm = document.getElementById("affinity-test");
  const testResult = document.getElementById("test-result");
  const searchModeForm = document.querySelector(".search-mode-form");
  const profileModeRadios = document.querySelectorAll('.mon-profil-form input[name="profile-mode"]');

  /**
   * Applique un thème sur le body.
   * @param {"similar"|"opposite"} mode
   * @param {boolean} [fromTest=false]
   */
  function setTheme(mode, fromTest) {
    if (mode === "opposite") {
      body.classList.remove("theme-similar");
      body.classList.add("theme-opposite");
      if (modeLabel) {
        modeLabel.textContent = "« les opposés s’attirent » (sombre)";
      }
      if (fromTest && testResult) {
        testResult.textContent =
          "Vous êtes plutôt Team « les opposés s’attirent ». Le site bascule en mode sombre pour symboliser ce choix.";
      }
    } else {
      body.classList.remove("theme-opposite");
      body.classList.add("theme-similar");
      if (modeLabel) {
        modeLabel.textContent = "« qui se ressemble s’assemble » (clair)";
      }
      if (fromTest && testResult) {
        testResult.textContent =
          "Vous êtes plutôt Team « qui se ressemble s’assemble ». Le site bascule en mode clair pour refléter cette préférence.";
      }
    }
  }

  // Initialisation
  setTheme("similar", false);

  // Synchronise le thème avec le choix en entête (radio search-mode)
  if (searchModeForm) {
    searchModeForm.addEventListener("change", function (event) {
      const target = event.target;
      if (target && target.name === "search-mode") {
        const value = target.value === "opposite" ? "opposite" : "similar";
        setTheme(value, false);
      }
    });
  }

  // Synchronise le thème avec le choix dans "Mon profil"
  if (profileModeRadios && profileModeRadios.length > 0) {
    profileModeRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.checked) {
          const value = radio.value === "opposite" ? "opposite" : "similar";
          setTheme(value, false);
        }
      });
    });
  }

  // Test de personnalité : calcule similar vs opposite
  if (testForm) {
    testForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(testForm);
      let similarScore = 0;
      let oppositeScore = 0;

      for (const [, value] of formData.entries()) {
        if (value === "similar") {
          similarScore += 1;
        } else if (value === "opposite") {
          oppositeScore += 1;
        }
      }

      if (similarScore === 0 && oppositeScore === 0) {
        if (testResult) {
          testResult.textContent = "Veuillez répondre aux questions avant de valider le test. 🙂";
        }
        return;
      }

      if (similarScore >= oppositeScore) {
        setTheme("similar", true);
        // Met à jour aussi les radios globales pour cohérence visuelle
        const smSimilar = document.querySelector('input[name="search-mode"][value="similar"]');
        if (smSimilar) smSimilar.checked = true;
      } else {
        setTheme("opposite", true);
        const smOpposite = document.querySelector('input[name="search-mode"][value="opposite"]');
        if (smOpposite) smOpposite.checked = true;
      }
    });
  }

  // Bonus : scroll doux vers les ancres internes (nav)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Mini easter-egg JS : message dans la console pour le prof
  // (visible uniquement en ouvrant les devtools)
  try {
    // eslint-disable-next-line no-console
    console.log(
      "Bonjour Gérald Kembellec 👋\n" +
      "Si vous lisez ceci, c’est que notre web documentaire a éveillé votre curiosité…"
    );
  } catch (e) {
    // Rien de grave si la console n’existe pas.
  }
})();
