import { useState } from "react";
import PropTypes from "prop-types";

const IngredientsList = ({ ingredients, handleRecipeShown }) => {
  return (
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
          <button
            onClick={handleRecipeShown}
            className='px-6 py-3 text-sm rounded-md bg-[#D17557] text-white font-semibold mt-4 sm:mt-0'
          >
            Make my recipe
          </button>
        </div>
      )}
    </section>
  );
};

IngredientsList.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleRecipeShown: PropTypes.func.isRequired,
};

export default IngredientsList;
