"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { debounce, throttle } from "../utils/debounceThrottle";
import Recipe from "./Recipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromDishGenie } from "../ai";

const Main = () => {
  const [ingredients, setIngredients] = useState([]); // ingredients array state
  const [recipeShown, setRecipeShown] = useState(false); // recipe shown state
  const [loading, setLoading] = useState(false);
  const recipeSection = useRef(null);
  console.log(recipeSection);

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
    // Add validation
    if (!ingredients || ingredients.length < 3) {
      console.error("Please add at least 3 ingredients");
      return;
    }
    // Debug log
    console.log("Sending ingredients state:", ingredients);
    // run the claude API function
    setLoading(true);
    try {
      const recipeMarkdown = await getRecipeFromDishGenie(ingredients);
      setRecipeShown(recipeMarkdown);
    } catch (error) {
      console.error("Failed to get recipe:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (recipeSection.current && recipeShown) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipeShown]);

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
          <IngredientsList
            ref={recipeSection}
            ingredients={ingredients}
            getRecipe={getRecipe}
          />
        )}

        {loading && (
          <div role='status' className='w-full'>
            <svg
              aria-hidden='true'
              className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
          </div>
        )}
        {recipeShown && !loading && <Recipe recipeShown={recipeShown} />}
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
