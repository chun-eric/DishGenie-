"use client";
import { useState } from "react";

const Main = () => {
  const [ingredients, setIngredients] = useState([
    "all the main spices",
    "pasta",
    "ground beef",
    "tomato paste",
  ]); // ingredients array state
  const [recipeShown, setRecipeShown] = useState(false);

  // use the new React 19 formData and action attributes on forms
  // currently however the form actions isnt working on my react version even though it is react 19

  // The new React 19 form action works!!
  async function handleIngredient(formData) {
    // how to grab the form data
    // Update the ingredients array state and render the list
    const ingredientData = Object.fromEntries([
      ["ingredient", formData.get("ingredient") || ""],
      // ["recipeStatus", formData.get("recipeStatus") || ""],
      // ["foodStatus", formData.getAll("foodStatus") || []],
      // ["favoriteFood", formData.get("favorite_food") || ""],
    ]);

    // print each value
    console.log("New Ingredient:", ingredientData.ingredient);
    console.log("Recipe Status:", ingredientData.recipeStatus);
    console.log("Food Status:", ingredientData.foodStatus);
    console.log("Favorite Food:", ingredientData.favoriteFood);

    // prevent array flattening by creating objects
    setIngredients((prev) => [...prev, ingredientData]);
  }

  return (
    <div className='max-w-4xl min-h-screen px-6 mx-auto my-20'>
      <main className=''>
        <form
          action={handleIngredient}
          // onSubmit={addIngredient}
          className='flex flex-col items-center justify-center gap-3 sm:flex-row'
        >
          <input
            // value={inputValue}
            // onChange={(e) => setInputValue(e.target.value)}
            className='px-4 h-12 outline-none sm:w-[70%] rounded-md border  w-full border-[#D1D5DB] placeholder:text-sm'
            type='text'
            placeholder='e.g. Garlic '
            aria-label='Add ingredient'
            name='ingredient'
          />

          <button
            type='submit'
            className='w-full h-12 px-4 text-sm text-white bg-black rounded-md sm:flex-1 text-semibold'
          >
            +Add Ingredient
          </button>
        </form>
        {ingredients && ingredients.length > 0 && (
          <section className='px-1 mt-12 sm:w-full'>
            <div className='flex flex-col mb-8'>
              <h2 className='text-2xl font-bold'>
                Ingredients on hand:{" "}
                <span className='text-sm text-gray-600'>(minimum 3)</span>
              </h2>
              <ul
                className='flex flex-col items-left justify-between background-[#f0efeb]  py-2.5 px-5 rounded-lg'
                aria-live='polite'
              >
                {ingredients.map((ingredient, index) => (
                  <li className='mt-3 list-disc text-[#4e535e]' key={index}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            {ingredients.length >= 3 && (
              <div className='flex flex-col sm:flex-row items-left sm:items-center justify-between w-full rounded-md bg-[#f0efeb] px-8 py-10'>
                <div className=''>
                  <h3 className='text-lg font-semibold leading-6 text-slate-800'>
                    Ready for a recipe?
                  </h3>
                  <p className='text-sm text-[#6B7280] leading-10'>
                    Generate a recipe from my ingredients list
                  </p>
                </div>
                <button className='px-6 py-3 text-sm rounded-md bg-[#D17557] text-white font-semibold mt-4 sm:mt-0'>
                  Make my recipe
                </button>
              </div>
            )}
          </section>
        )}
        <section className='flex flex-col gap-3 px-1 mt-12 sm:w-full'>
          <h2 className='text-2xl font-bold'>Chef Claude Recommends:</h2>
          <article className='suggested-recipe-container' aria-live='polite'>
            <p className='mt-6 mb-12 leading-6'>
              Based on the ingredients you have available, I would recommend
              making a simple a delicious <strong>Beef Bolognese Pasta</strong>.
              Here is the recipe:
            </p>

            <strong className='text-xl'>Ingredients:</strong>
            <ul className='flex flex-col gap-3 px-5 mt-5 list-disc'>
              <li>1 lb. ground beef</li>
              <li>1 onion, diced</li>
              <li>3 cloves garlic, minced</li>
              <li>2 tablespoons tomato paste</li>
              <li>1 (28 oz) can crushed tomatoes</li>
              <li>1 cup beef broth</li>
              <li>1 teaspoon dried oregano</li>
              <li>1 teaspoon dried basil</li>
              <li>Salt and pepper to taste</li>
              <li>
                8 oz pasta of your choice (e.g., spaghetti, penne, or linguine)
              </li>
            </ul>
            <div className='my-12'>
              <strong className='mt-10 text-xl'>Instructions:</strong>
            </div>
            <ol className='flex flex-col gap-4 px-5 text-gray-700 list-decimal'>
              <li>
                Bring a large pot of salted water to a boil for the pasta.
              </li>
              <li>
                In a large skillet or Dutch oven, cook the ground beef over
                medium-high heat, breaking it up with a wooden spoon, until
                browned and cooked through, about 5-7 minutes.
              </li>
              <li>
                Add the diced onion and minced garlic to the skillet and cook
                for 2-3 minutes, until the onion is translucent.
              </li>
              <li>Stir in the tomato paste and cook for 1 minute.</li>
              <li>
                Add the crushed tomatoes, beef broth, oregano, and basil. Season
                with salt and pepper to taste.
              </li>
              <li>
                Reduce the heat to low and let the sauce simmer for 15-20
                minutes, stirring occasionally, to allow the flavors to meld.
              </li>
              <li>
                While the sauce is simmering, cook the pasta according to the
                package instructions. Drain the pasta and return it to the pot.
              </li>
              <li>
                Add the Bolognese sauce to the cooked pasta and toss to combine.
              </li>
              <li>
                Serve hot, garnished with additional fresh basil or grated
                Parmesan cheese if desired.
              </li>
            </ol>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Main;

// function addIngredient(event) {
//   event.preventDefault();
//   // how to grab the form data
//   const formData = new FormData(event.currentTarget);
//   const newIngredient = formData.get("ingredient");
//   console.log(newIngredient);
//   // Update the ingredients array state and render the list
//   setIngredients((prev) => [...prev, newIngredient]);

//   // Reset the form
//   setInputValue("");
// }

//    {/** radio */}
{
  /* <fieldset className='flex flex-col border border-[#D1D5DB]'>
  <legend>Ingredient Status:</legend>
  <label>
    <input
      defaultChecked={true}
      className='mr-2'
      type='radio'
      name='recipeStatus'
      value='in-stock'
    />
    In Stock
  </label>
  <label>
    <input
      className='mr-2'
      type='radio'
      name='recipeStatus'
      value='out-of-stock'
    />
    Out of Stock
  </label>
  <label>
    <input
      className='mr-2'
      type='radio'
      name='recipeStatus'
      value='low-stock'
    />
    Low Stock
  </label>
</fieldset>; */
}

{
  /** checkboxes */
}
{
  /* <fieldset className='flex flex-col border border-[#D1D5DB]'>
<legend>Ingredients:</legend>
<label>
  <input
    defaultChecked={true}
    className='mr-2'
    type='checkbox'
    name='foodStatus'
    value='pork'
  />
  Pork
</label>
<label>
  <input
    className='mr-2'
    type='checkbox'
    name='foodStatus'
    value='beef'
  />
  Beef
</label>
<label>
  <input
    className='mr-2'
    type='checkbox'
    name='foodStatus'
    value='chicken'
  />
  Chicken
</label>
</fieldset>

{/** select options */
}
{
  /* <div className='flex flex-col'>
<label htmlFor='favorite_food'>What is your favorite food?</label>
<select
  required
  name='favorite_food'
  id='favorite_food'
  className='p-2 border border-[#D1D5DB] rounded-md'
>
  <option value='' disabled>
    -- Please choose an option --
  </option>
  <option value='pork'>Pork</option>
  <option value='beef'>Beef</option>
  <option value='chicken'>Chicken</option>
</select>
</div> */
}
