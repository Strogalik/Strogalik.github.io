document.addEventListener("DOMContentLoaded", function () {
  // Переключение языка
  const langButtons = document.querySelectorAll(".lang-btn");
  const translations = {
    ru: {
      headerInfo: "30+ курсов",
      mainTitle: "Получите любой из моих курсов<br />по самой низкой цене",
      searchPlaceholder: "Найти курсы по ключевому слову"
    },
    en: {
      headerInfo: "30+ courses",
      mainTitle: "Get any of my courses<br />at the lowest price possible",
      searchPlaceholder: "Find courses by keyword"
    },
  };

  function switchLanguage(lang) {
    document.querySelector(".hero .header-info").innerText =
      translations[lang].headerInfo;
    document.querySelector(".hero .main-title").innerHTML =
      translations[lang].mainTitle;
    document
      .querySelector(".hero .search-input")
      .setAttribute("placeholder", translations[lang].searchPlaceholder);
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const lang = btn.getAttribute("data-lang");
      switchLanguage(lang);
    });
  });

  // Переключение темы
  const themeButton = document.getElementById("themeToggle");
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    if (document.body.classList.contains("light-theme")) {
      themeButton.innerText = "Сменить тему (светлая)";
    } else {
      themeButton.innerText = "Сменить тему (тёмная)";
    }
  });

  // Функционал поиска по тегам и тексту
  const searchInput = document.querySelector(".hero .search-input");
  const tagElements = document.querySelectorAll(".tag");
  const cards = document.querySelectorAll(".course-card");

  let selectedTag = null;

  function filterCourses() {
    const searchValue = searchInput.value.toLowerCase().trim();

    cards.forEach((card) => {
      const cardTitle = card
        .querySelector(".course-title")
        .textContent.toLowerCase();
      const cardDesc = card
        .querySelector(".course-description")
        .textContent.toLowerCase();
      const cardTags = card.dataset.tags.toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        cardTitle.includes(searchValue) ||
        cardDesc.includes(searchValue) ||
        cardTags.includes(searchValue);

      let matchesTag = true;
      if (selectedTag) {
        matchesTag = cardTags.includes(selectedTag);
      }

      card.style.display = matchesSearch && matchesTag ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", () => {
    selectedTag = null;
    filterCourses();
  });

  tagElements.forEach((tagEl) => {
    tagEl.addEventListener("click", () => {
      const clickedTag = tagEl.textContent.trim().toLowerCase();
      if (selectedTag === clickedTag) {
        selectedTag = null;
      } else {
        selectedTag = clickedTag;
        searchInput.value = "";
      }
      filterCourses();
    });
  });
});
