const meals = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");

fetchFavMeals();
getRandomMeal();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  console.log("Meal By Id:", meal);
  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const termResp = await resp.json();
  console.log(termResp);
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
          <div class="meal-header">
          ${
            random
              ? `
            <span class="random">Random Recipe</span>`
              : ""
          }
            <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            />
          </div>
          <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
          </div>      
  `;

  const btnEl = meal.querySelector(".meal-body .fav-btn");

  btnEl.addEventListener("click", () => {
    if (btnEl.classList.contains("active")) {
      removeMealFromS(mealData.idMeal);
      btnEl.classList.remove("active");
      favContainer.innerHTML = "";
      fetchFavMeals();
    } else {
      addMealToLS(mealData.idMeal);
      btnEl.classList.add("active");

      favContainer.innerHTML = "";
      fetchFavMeals();
    }
  });

  meals.appendChild(meal);
}

function addMealToLS(mealId) {
  const mealIds = getMealsFromStorage();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function getMealsFromStorage() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}

function removeMealFromS(mealId) {
  const mealIds = getMealsFromStorage();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

async function fetchFavMeals() {
  //clean fav container
  favContainer.innerHTML = "";

  const mealIds = getMealsFromStorage();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    meal = await getMealById(mealId);
    addMealToFav(meal);
  }
}

function addMealToFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
        <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}";
      /><span>${mealData.strMeal}</span>
      <button class="clear"><i class="fas fa-window-close"></i></button>
        `;

  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealFromS(mealData.idMeal);
    fetchFavMeals();
  });
  favContainer.appendChild(favMeal);
}

// STYLE FAV CONTAINER ???
