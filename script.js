/* ============================================================
   AURELLE FINE JEWELRY — SCRIPT
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Product data ---------- */
  var PRODUCTS = [
    {
      id: "p1",
      name: "Éclat Solitaire Ring",
      category: "rings",
      categoryLabel: "Rings",
      price: 2450,
      wasPrice: null,
      rating: 5,
      reviewCount: 128,
      badge: "Bestseller",
      img: "img/Éclat.PNG"
    },
    {
      id: "p2",
      name: "Lumière Diamond Pendant",
      category: "necklaces",
      categoryLabel: "Necklaces",
      price: 1890,
      wasPrice: 2100,
      rating: 5,
      reviewCount: 96,
      badge: "Sale",
      img: "img/Lumière.PNG"
    },
    {
      id: "p3",
      name: "Aurora Drop Earrings",
      category: "earrings",
      categoryLabel: "Earrings",
      price: 980,
      wasPrice: null,
      rating: 4,
      reviewCount: 64,
      badge: null,
      img: "img/Aurora.PNG"
    },
    
  
  ];

  var currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  /* ---------- Render products ---------- */
  var productGrid = document.getElementById("productGrid");
  var cartCountEl = document.getElementById("cartCount");
  var cartCount = 0;

  function starMarkup(rating) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += i <= rating
        ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9"/></svg>'
        : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3"><polygon points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9"/></svg>';
    }
    return out;
  }

  function renderProducts(filter) {
    productGrid.innerHTML = "";
    var list = filter === "all" ? PRODUCTS : PRODUCTS.filter(function (p) { return p.category === filter; });

    list.forEach(function (product, idx) {
      var card = document.createElement("article");
      card.className = "product-card";
      card.style.transitionDelay = (idx % 4) * 0.06 + "s";

      card.innerHTML =
        '<div class="product-media">' +
          (product.badge ? '<span class="product-badge">' + product.badge + "</span>" : "") +
          '<img src="' + product.img + '" alt="' + product.name + ', ' + product.categoryLabel + '" loading="lazy">' +
        "</div>" +
        '<div class="product-info">' +
          '<p class="product-category">' + product.categoryLabel + "</p>" +
          '<h3 class="product-name">' + product.name + "</h3>" +
          '<div class="product-rating">' + starMarkup(product.rating) +
            '<span class="rating-count">(' + product.reviewCount + ")</span></div>" +
          '<p class="product-price">' + currency.format(product.price) +
            (product.wasPrice ? '<span class="was">' + currency.format(product.wasPrice) + "</span>" : "") +
          "</p>" +
          '<button class="add-to-cart" type="button" data-name="' + product.name + '">Add to Cart</button>' +
        "</div>";

      productGrid.appendChild(card);
    });

    /* re-observe new cards for scroll-reveal */
    document.querySelectorAll(".product-card").forEach(function (el) { cardObserver.observe(el); });
  }

  /* ---------- Filter chips ---------- */
  var filterChips = document.querySelectorAll(".filter-chip");
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      renderProducts(chip.dataset.filter);
    });
  });

  /* ---------- Add to cart (event delegation) ---------- */
  productGrid.addEventListener("click", function (e) {
    var btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    cartCount++;
    cartCountEl.textContent = cartCount;
    var original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.classList.add("is-added");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("is-added");
    }, 1400);
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function updateHeader() {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("main > section[id]");
  var navAnchors = document.querySelectorAll(".nav-link");
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Search toggle ---------- */
  var searchToggle = document.getElementById("searchToggle");
  var searchBar = document.getElementById("searchBar");
  var searchClose = document.getElementById("searchClose");

  function openSearch() {
    searchBar.classList.add("is-open");
    searchToggle.setAttribute("aria-expanded", "true");
    setTimeout(function () { searchBar.querySelector("input").focus(); }, 350);
  }
  function closeSearch() {
    searchBar.classList.remove("is-open");
    searchToggle.setAttribute("aria-expanded", "false");
  }
  searchToggle.addEventListener("click", function () {
    searchBar.classList.contains("is-open") ? closeSearch() : openSearch();
  });
  searchClose.addEventListener("click", closeSearch);

  /* ---------- Scroll reveal ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      formStatus.textContent = "Please fill in all required fields correctly.";
      return;
    }
    formStatus.textContent = "Thank you! Your message has been sent — our concierge team will reply within one business day.";
    contactForm.reset();
  });

  /* ---------- Newsletter form ---------- */
  var newsletterForm = document.getElementById("newsletterForm");
  var newsletterStatus = document.getElementById("newsletterStatus");
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!newsletterForm.checkValidity()) {
      newsletterStatus.textContent = "Please enter a valid email address.";
      return;
    }
    newsletterStatus.textContent = "You're subscribed. Welcome to Aurelle.";
    newsletterForm.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Initial render ---------- */
  renderProducts("all");
})();
