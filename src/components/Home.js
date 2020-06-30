import React from "react";
import Image from "react-bootstrap/Image";
import "./Home.css";

// Home Component
const Home = (props) => {
  console.log(`rendering Home...`, props);
  return (
    <div className="container">
      <h1>Welcome!</h1>
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Universidade_Federal_do_Cear%C3%A1.png/1920px-Universidade_Federal_do_Cear%C3%A1.png"
        alt="School Picture"
        fluid
        className="splash"
      ></Image>
    </div>
  );
};

export default Home;
