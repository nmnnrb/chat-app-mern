import React from 'react';

const NotFound = () => {
  return (
    <div 
      className="flex flex-col text-black  items-center justify-center min-h-screen min-w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://img.freepik.com/free-vector/messages-light-colour-background_78370-2586.jpg?t=st=1734945177~exp=1734948777~hmac=d0b82d73e8d6e01d11a35fc0c6db65069678f5971ae5c551630160f31ce96d63&w=1800')" }}
    > 
      <h1 className="text-4xl md:text-7xl text-white px-6 py-3 rounded-md shadow-2xl bg-red-500  font-bold">404 - Page Not Found</h1>
      <p className="text-lg md:text-2xl bg-red-500 px-6 py-3 rounded-xl text-white mt-2">The page you are looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
