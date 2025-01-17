import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";

const Recipe = ({ recipeShown }) => {
  // Custom components config for ReactMarkdown
  const components = {
    // Safely handle images by either not rendering them or using a placeholder
    img: ({ src, alt }) => {
      if (!src || src === "") {
        return null; // Don't render empty image tags
      }
      return <img src={src} alt={alt || "Recipe illustration"} />;
    },
  };

  return (
    <div className='min-h-full p-6 my-8 bg-white rounded-lg '>
      <h2 className='mb-4 text-2xl font-bold'>Your Recipe</h2>
      <div className='prose-sm prose sm:prose lg:prose-lg'>
        <ReactMarkdown components={components} className=''>
          {recipeShown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

Recipe.propTypes = {
  recipeShown: PropTypes.string.isRequired,
};

export default Recipe;
