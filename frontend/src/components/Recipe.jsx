import React from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";

const Recipe = ({ recipeShown }) => {
  return (
    <div className='min-h-full p-6 my-8 bg-white rounded-lg '>
      <h2 className='mb-4 text-2xl font-bold'>Your Recipe</h2>
      <div className='prose-sm prose sm:prose lg:prose-lg'>
        <ReactMarkdown className=''>{recipeShown}</ReactMarkdown>
      </div>
    </div>
  );
};

Recipe.propTypes = {
  recipeShown: PropTypes.string.isRequired,
};

export default Recipe;
