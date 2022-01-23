getRandomMeal();

async function getRandomMeal() {
  const resp = await fetch("http://www.themealdb.com/api/json/v1/1/random.php");
  const respData = await resp.json();
  console.log(respData);
}

function getMealById(id) {
  const meal = await fetch(
    "www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
}

function getMealsBySearch(term) {
  const meals = await fetch(
    "www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
}
