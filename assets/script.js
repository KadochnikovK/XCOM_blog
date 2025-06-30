document.addEventListener("DOMContentLoaded", function () {
  // ========== Расчет отступов для фиксированных элементов ==========
  function calculateContentOffset() {
    const header = document.querySelector(".header");
    const breadcrumbs = document.querySelector(".breadcrumbs");
    const mainContent = document.querySelector("main");

    if (!header || !mainContent) return;

    let offset = header.offsetHeight;

    if (breadcrumbs && getComputedStyle(breadcrumbs).position === "fixed") {
      offset += breadcrumbs.offsetHeight;
    }

    mainContent.style.paddingTop = `${offset}px`;
  }

  // ========== Обновление при ресайзе ==========
  function handleResize() {
    calculateContentOffset();
  }

  // ========== Инициализация всех функций ==========
  // Первоначальный расчет
  calculateContentOffset();

  // Обновление при изменении размера окна
  window.addEventListener("resize", debounce(handleResize, 100));

  // Функция для предотвращения частых вызовов при ресайзе
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // ========== Общие функции ==========
  // Обновление года в футере
  function updateCopyright() {
    const copyrightElement = document.getElementById("copy");
    if (copyrightElement) {
      copyrightElement.textContent = `© XCOM ${new Date().getFullYear()}. Все права защищены.`;
    }
  }

  // Плавная прокрутка для якорных ссылок
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Обновляем URL без перезагрузки страницы
          if (targetId !== "#form") {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  // ========== Хедер и мобильное меню ==========
  function initMobileMenu() {
    const hamburger = document.querySelector(".header__hamburger");
    const menu = document.querySelector(".header__menu");

    if (hamburger && menu) {
      hamburger.addEventListener("click", function () {
        this.classList.toggle("active");
        menu.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
      });

      // Закрытие меню при клике на ссылку
      menu.querySelectorAll(".header__link").forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          menu.classList.remove("active");
          document.body.classList.remove("no-scroll");
        });
      });
    }
  }

  // ========== Фильтрация статей ==========
  function initArticleFilter() {
    const filterButtons = document.querySelectorAll(".button--tab[data-tab]");

    if (filterButtons.length) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Удаляем активный класс у всех кнопок
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          // Добавляем активный класс текущей кнопке
          this.classList.add("active");

          const filterValue = this.dataset.tab;
          const articles = document.querySelectorAll(".article-card");

          articles.forEach((article) => {
            if (filterValue === "all" || article.dataset.category === filterValue) {
              article.style.display = "block";
            } else {
              article.style.display = "none";
            }
          });
        });
      });
    }
  }

  // ========== Форма заявки ==========
  function initApplicationForm() {
    const form = document.getElementById("form");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // Имитация отправки
        submitButton.disabled = true;
        submitButton.textContent = "Отправка...";

        // Здесь должна быть реальная отправка на сервер
        setTimeout(() => {
          alert("Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.");
          form.reset();
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }, 1500);
      });
    }
  }

  // ========== Ленивая загрузка изображений ==========
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  }

  // ========== Инициализация всех функций ==========
  updateCopyright();
  initSmoothScroll();
  initMobileMenu();
  initArticleFilter();
  initApplicationForm();
  initLazyLoading();

  // Анимация при загрузке страницы
  document.body.classList.add("loaded");
});
