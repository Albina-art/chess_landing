const participants = [
  {
    name: "Хозе-Рауль Капабланка",
    role: "Чемпион мира по шахматам",
  },
  {
    name: "Эммануил Ласкер",
    role: "Чемпион мира по шахматам",
  },
  {
    name: "Александр Алехин",
    role: "Чемпион мира по шахматам",
  },
  {
    name: "Арон Нимцович",
    role: "Чемпион мира по шахматам",
  },
  {
    name: "Рихард Рети",
    role: "Чемпион мира по шахматам",
  },
  {
    name: "Остап Бендер",
    role: "Гроссмейстер",
  }
];

const stages = [
  "Строительство железнодорожной магистрали Москва-Васюки",
  "Открытие фешенебельной гостиницы «Проходная пешка» и других небоскрёбов",
  "Поднятие сельского хозяйства в радиусе на тысячу километров: производство овощей, фруктов, икры, шоколадных конфет",
  "Строительство дворца для турнира",
  "Размещение гаражей для гостевого автотранспорта",
  "Постройка сверхмощной радиостанции для передачи всему миру сенсационных результатов",
  "Создание аэропорта «Большие Васюки» с регулярным отправлением почтовых самолётов и дирижаблей во все концы света, включая Лос-Анжелос и Мельбурн"
];

const pTrack = document.querySelector(".participants__track");
const pCounter = document.getElementById("currentSlide");
const pPrev = document.querySelector("[data-action='prev-p']");
const pNext = document.querySelector("[data-action='next-p']");

const sTrack = document.querySelector(".stages__track");
const sDotsWrap = document.querySelector(".stages__dots");
const sPrev = document.querySelector(".stages [data-action='prev']");
const sNext = document.querySelector(".stages [data-action='next']");

let pIndex = 0;
let sIndex = 0;
let pTimer;

function perViewParticipants() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function perViewStages() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function renderParticipants() {
  pTrack.innerHTML = participants
    .map(
      (item) => `
        <article class="participant-card">
          <img class="participant-card__photo" src="./images/participant.webp" alt="${item.name}" loading="lazy" />
          <h3>${item.name}</h3>
          <p>${item.role}</p>
          <a href="#participants">Подробнее</a>
        </article>
      `
    )
    .join("");
  updateParticipants(true);
}

function updateParticipants(skipTransition = false) {
  const cards = [...pTrack.children];
  if (!cards.length) return;
  const view = perViewParticipants();
  const max = Math.max(participants.length - view, 0);

  if (pIndex > max) pIndex = 0;
  if (skipTransition) pTrack.style.transition = "none";
  else pTrack.style.transition = "transform 0.45s ease";

  const width = cards[0].getBoundingClientRect().width + 20;
  pTrack.style.transform = `translateX(${-pIndex * width}px)`;

  const currentPage = Math.min(pIndex + 1, participants.length);
  pCounter.textContent = String(currentPage);

  if (skipTransition) {
    requestAnimationFrame(() => {
      pTrack.style.transition = "transform 0.45s ease";
    });
  }
}

function nextParticipants() {
  const view = perViewParticipants();
  const max = Math.max(participants.length - view, 0);
  pIndex = pIndex >= max ? 0 : pIndex + 1;
  updateParticipants();
}

function prevParticipants() {
  const view = perViewParticipants();
  const max = Math.max(participants.length - view, 0);
  pIndex = pIndex <= 0 ? max : pIndex - 1;
  updateParticipants();
}

function startParticipantsAutoplay() {
  clearInterval(pTimer);
  pTimer = setInterval(nextParticipants, 4000);
}

function renderStages() {
  if (window.innerWidth <= 768) {
    const mobileGroups = [[0, 1], [2], [3, 4], [5], [6]];
    sTrack.innerHTML = mobileGroups
      .map(
        (group) => `
          <article class="stage-page">
            ${group
              .map(
                (index) => `
                  <div class="stage-page__item">
                    <div class="stage-card__num">${index + 1}</div>
                    <p>${stages[index]}</p>
                  </div>
                `
              )
              .join("")}
          </article>
        `
      )
      .join("");
  } else {
    sTrack.innerHTML = stages
      .map(
        (item, i) => `
          <article class="stage-card">
            <div class="stage-card__num">${i + 1}</div>
            <p>${item}</p>
          </article>
        `
      )
      .join("");
  }
  buildStageDots();
  updateStages();
}

function buildStageDots() {
  const pages = window.innerWidth <= 768 ? sTrack.children.length : Math.ceil(stages.length / perViewStages());
  sDotsWrap.innerHTML = "";
  for (let i = 0; i < pages; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.addEventListener("click", () => {
      sIndex = i;
      updateStages();
    });
    sDotsWrap.appendChild(dot);
  }
}

function updateStages() {
  const cards = [...sTrack.children];
  if (!cards.length) return;

  if (window.innerWidth > 768) {
    sIndex = 0;
    sTrack.style.transform = "none";
    sPrev.disabled = true;
    sNext.disabled = true;
    [...sDotsWrap.children].forEach((dot) => dot.classList.remove("active"));
    return;
  }

  const pages = cards.length;
  const maxPage = pages - 1;
  if (sIndex < 0) sIndex = 0;
  if (sIndex > maxPage) sIndex = maxPage;

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(sTrack).columnGap || getComputedStyle(sTrack).gap || "0");
  const shiftBy = sIndex * (cardWidth + gap);
  sTrack.style.transform = `translateX(${-shiftBy}px)`;

  sPrev.disabled = sIndex === 0;
  sNext.disabled = sIndex === maxPage;

  [...sDotsWrap.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === sIndex);
  });
}

function revealOnScroll() {
  const nodes = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  nodes.forEach((node) => io.observe(node));
}

pPrev.addEventListener("click", () => {
  prevParticipants();
  startParticipantsAutoplay();
});
pNext.addEventListener("click", () => {
  nextParticipants();
  startParticipantsAutoplay();
});

sPrev.addEventListener("click", () => {
  sIndex -= 1;
  updateStages();
});
sNext.addEventListener("click", () => {
  sIndex += 1;
  updateStages();
});

window.addEventListener("resize", () => {
  renderStages();
  updateParticipants(true);
});

renderParticipants();
renderStages();
startParticipantsAutoplay();
revealOnScroll();
