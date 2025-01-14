import React, { useState } from "react";

const Recipe = ({ recipeShown }) => {
  return (
    <section className='flex flex-col gap-3 px-1 mt-12 sm:w-full'>
      {recipeShown}
      {/* <h2 className='text-2xl font-bold'>Chef Claude Recommends:</h2>
      <article className='suggested-recipe-container' aria-live='polite'>
        <p className='mt-6 mb-12 leading-6'>
          Based on the ingredients you have available, I would recommend making
          a simple a delicious <strong>Beef Bolognese Pasta</strong>. Here is
          the recipe:
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
          <li>Bring a large pot of salted water to a boil for the pasta.</li>
          <li>
            In a large skillet or Dutch oven, cook the ground beef over
            medium-high heat, breaking it up with a wooden spoon, until browned
            and cooked through, about 5-7 minutes.
          </li>
          <li>
            Add the diced onion and minced garlic to the skillet and cook for
            2-3 minutes, until the onion is translucent.
          </li>
          <li>Stir in the tomato paste and cook for 1 minute.</li>
          <li>
            Add the crushed tomatoes, beef broth, oregano, and basil. Season
            with salt and pepper to taste.
          </li>
          <li>
            Reduce the heat to low and let the sauce simmer for 15-20 minutes,
            stirring occasionally, to allow the flavors to meld.
          </li>
          <li>
            While the sauce is simmering, cook the pasta according to the
            package instructions. Drain the pasta and return it to the pot.
          </li>
          <li>
            Add the Bolognese sauce to the cooked pasta and toss to combine.
          </li>
          <li>
            Serve hot, garnished with additional fresh basil or grated Parmesan
            cheese if desired.
          </li>
        </ol>
      </article> */}
    </section>
  );
};

export default Recipe;
