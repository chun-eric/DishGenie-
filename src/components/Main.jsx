"use client";
import { useState } from "react";

const Main = () => {
  const [ingredients, setIngredients] = useState([]); // ingredients array state

  // use the new React 19 formData and action attributes on forms
  // currently however the form actions isnt working on my react version even though it is react 19

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

  // The new React 19 form action works!!
  async function handleIngredient(formData) {
    // how to grab the form data
    const newIngredient = formData.get("ingredient");
    // Update the ingredients array state and render the list
    setIngredients((prev) => [...prev, newIngredient]);
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
            className='px-4 h-12 outline-none sm:w-[70%] rounded-md border  w-[95%] border-[#D1D5DB] placeholder:text-sm'
            type='text'
            placeholder='e.g. Garlic '
            aria-label='Add ingredient'
            name='ingredient'
          />

          <button
            type='submit'
            className='px-4 h-12 text-sm text-white bg-black rounded-md sm:flex-1 text-semibold w-[95%]'
          >
            +Add Ingredient
          </button>
        </form>
        <ul>
          {/* Render list of ingredients */}
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Main;
