const meals = document.getElementById("meals");

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
  const mealId = await resp.json();
  console.log(mealId);
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
    } else {
      addMealToLS(mealData.idMeal);
      btnEl.classList.add("active");
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
