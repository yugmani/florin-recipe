const mealsEl = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");

fetchFavMeals();
getRandomMeal();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = await respData.meals[0];

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = await respData.meals[0];

  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const termResp = await resp.json();
  const meals = await termResp.meals;

  return meals;
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
            <h3>${mealData.strMeal}</h3>
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

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
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

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favContainer.appendChild(favMeal);
}

searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = "";
  const search = searchTerm.value;

  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = "";
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
  <h1>${mealData.strMeal}</h1>
        <img
          src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"
        />

        <p>
         ${mealData.strInstructions}
        </p>
        <h2>Ingredients </h2>
        <ul class="ingredients">
        ${ingredients
          .map(
            (ing) => `
        <li class="ingredient>${ing}</li>
        `
          )
          .join("")}
        </ul>
        `;
  mealInfoEl.appendChild(mealEl);
  mealPopup.classList.remove("hidden");
}
