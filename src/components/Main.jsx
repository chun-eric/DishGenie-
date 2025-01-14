"use client";
import { useState } from "react";
import Recipe from "./Recipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromDishGenie } from "../ai";

const Main = () => {
  const [ingredients, setIngredients] = useState([]); // ingredients array state
  const [recipeShown, setRecipeShown] = useState(false); // recipe shown state
  const [loading, setLoading] = useState(false);

  // use the new React 19 formData and action attributes on forms
  // currently however the form actions isnt working on my react version even though it is react 19

  // The new React 19 form action works!!
  async function addIngredient(formData) {
    // Grab form data and update the ingredients array state and render the list
    const newIngredient = formData.get("ingredient");
    // print each value
    // prevent array flattening by creating objects
    setIngredients((prev) => [...prev, newIngredient]);
  }

  async function getRecipe() {
    // run the claude API function
    const recipeMarkdown = await getRecipeFromDishGenie(ingredients);
    setRecipeShown(recipeMarkdown);
  }

  return (
    <div className='max-w-4xl min-h-screen px-6 mx-auto my-20'>
      <main className=''>
        <form
          action={addIngredient}
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
          <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
        )}
        {recipeShown && <Recipe recipeShown={recipeShown} />}
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
