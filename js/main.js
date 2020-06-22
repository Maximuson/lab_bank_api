const requestURL =
  "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

const getAllCourse = async () => {
  const response = await fetch(requestURL);
  const data = await response.json();
  return data;
};
const getCourseFor7Days = async (code, day) => {
  const URL = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${code}&date=${day}&json`;
  const response = await fetch(URL);
  const data = await response.json();
  return data[0];
};
const CourseMainItem = ({ txt, rate, cc }) => {
  return `
    <div class="js-valuteItem valute__item" data-code="${cc}">
    <div class="valute__item-top">
    <span class="valute__name">${txt}</span>
    <div>
    <span class="valute__ammount">${rate}</span>
    <span class="valute__symb">${cc}</span>
    <button class="js-loadDetails btn-more">За 7 днів</button>
    </div>
    </div>
    <div class="js-valute__item-bottom-container valute__item-bottom-container">
    </div>
    </div>
  </div>`;
};
const courseDayItem = ({ cc, rate, exchangedate }) => {
  return `
    <div class="valute__item-bottom-item">
        <span class="valute__date">${exchangedate}</span>
        <span class="valute__ammount">${rate} ${cc}</span>
    </div>`;
};
const handleBtnItemClick = (e) => {
  const btn = e.target;
  const listItem = e.target.closest(".js-valuteItem");
  const bottomContainer = listItem.querySelector(
    ".js-valute__item-bottom-container"
  );
  const code = listItem.dataset.code;
  getFormatedWeek().forEach((item) => {
    getCourseFor7Days(code, item).then((data) => {
      bottomContainer.insertAdjacentHTML("beforeend", courseDayItem(data));
      btn.disabled = true;
    });
  });
};
document.querySelector(".js-valuteContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("js-loadDetails")) {
    handleBtnItemClick(e);
  }
});
const showAllCourse = (data) => {
  const mocup = data.reduce((acc, item) => {
    return (acc += CourseMainItem(item));
  }, "");
  document.querySelector(".valute-container").innerHTML = mocup;
};
const getFormatedWeek = () => {
  const oneDay = 86400 * 1000;
  const today = new Date();
  const todayInSeconds = today.getTime();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(todayInSeconds - oneDay * i);
    const year = newDate.getFullYear();
    const month = (newDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = newDate.getDate().toString().padStart(2, "0");
    const formatedDate = `${year}${month}${day}`;
    dates.push(formatedDate);
  }
  return dates;
};
getFormatedWeek();
getAllCourse().then((data) => {
  showAllCourse(data);
});
