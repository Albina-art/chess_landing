const participants = [
  {
    name: "Хозе-Рауль Капабланка",
    role: "Чемпион мира по шахматам",
    image: "https://www.figma.com/api/mcp/asset/04537335-8b9f-44ac-9ed9-dedcb243e6f8"
  },
  {
    name: "Эммануил Ласкер",
    role: "Чемпион мира по шахматам",
    image: "https://www.figma.com/api/mcp/asset/d390f11d-f20a-4b77-9375-e9bdb928bdb6"
  },
  {
    name: "Александр Алехин",
    role: "Чемпион мира по шахматам",
    image: "https://www.figma.com/api/mcp/asset/36f0c736-e4a5-45cf-b936-18ece5b52e62"
  },
  {
    name: "Арон Нимцович",
    role: "Чемпион мира по шахматам",
    image: "https://www.figma.com/api/mcp/asset/a327c349-90cb-48c4-8465-c821789c6e9f"
  },
  {
    name: "Рихард Рети",
    role: "Чемпион мира по шахматам",
    image: "https://www.figma.com/api/mcp/asset/1989fcea-939e-4a9b-8713-61268d17debe"
  },
  {
    name: "Остап Бендер",
    role: "Гроссмейстер",
    image: "https://www.figma.com/api/mcp/asset/09ac465b-5637-4d89-9d1d-9ff5d0f57dc5"
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
  return window.innerWidth <= 760 ? 1 : 3;
}

function perViewStages() {
  return window.innerWidth <= 760 ? 1 : 3;
}

function renderParticipants() {
  pTrack.innerHTML = participants
    .map(
      (item) => `
        <article class="participant-card">
          <div class="participant-card__photo">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
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

  requestAnimationFrame(() => {
    pTrack.style.transition = "transform 0.45s ease";
  });
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
  buildStageDots();
  updateStages();
}

function buildStageDots() {
  const pages = Math.ceil(stages.length / perViewStages());
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

  const view = perViewStages();
  const pages = Math.ceil(stages.length / view);
  const maxPage = pages - 1;
  if (sIndex < 0) sIndex = 0;
  if (sIndex > maxPage) sIndex = maxPage;

  const cardWidth = cards[0].getBoundingClientRect().width + 16;
  const shiftBy = sIndex * cardWidth * view;
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
  buildStageDots();
  updateStages();
  updateParticipants(true);
});

renderParticipants();
renderStages();
startParticipantsAutoplay();
revealOnScroll();
