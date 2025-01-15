import Logo from "../images/logo_4.png";

const Header = () => {
  return (
    <div className='flex items-center justify-center w-full gap-5 py-6 bg-white border-b shadow-sm'>
      <img src={Logo} alt='Dish Genie Logo' className='' width={80} />
      <h1 className='text-2xl font-semibold sm:text-4xl'>Dish Genie</h1>
    </div>
  );
};

export default Header;
