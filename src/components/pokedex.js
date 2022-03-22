import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Modal, Spinner } from "react-bootstrap";

function Pokedex() {
  // Dataset of Shown Pokemon
  const [pokemon, setPokemon] = useState(null);

  // get first set of Pokemon on Page load
  useEffect(() => {
    let PokemonArry = [];
    const GetPokemon = async () => {
      for (let i = 1; i <= 151; i++) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        PokemonArry.push(response.data);
      }
      setPokemon([...PokemonArry]);
    };
    GetPokemon();
  }, []);

  //for Lazy Loading
  useEffect(() => {
    function handleScrollEvent() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log("you're at the bottom of the page");
        if (pokemon) {
          let currentpokis = [...pokemon];
          let lastPokemon = currentpokis.length + 1;
          let PokemonArry = [];
          const getnewPokemon = async () => {
            for (let i = lastPokemon; i <= lastPokemon + 150; i++) {
              const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
              PokemonArry.push(response.data);
            }
            setPokemon([...currentpokis, ...PokemonArry]);
          };
          getnewPokemon();
        }

        // here add more items in the 'filteredData' state from the 'allData' state source.
      }
    }

    window.addEventListener("scroll", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [pokemon]);

  // get typefunction ( switch that return color code)
  const getType = (type) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case "normal":
        return "#A8A77A";
      case "fire":
        return "#EE8130";
      case "water":
        return "#6390F0";

      case "electric":
        return "#F7D02C";

      case "grass":
        return "#7AC74C";

      case "ice":
        return "#96D9D6";

      case "fighting":
        return "#C22E28";

      case "poison":
        return "#A33EA1";

      case "ground":
        return "#E2BF65";

      case "flying":
        return "#A98FF3";

      case "psychic":
        return "#F95587";

      case "bug":
        return "#A6B91A";

      case "rock":
        return "#B6A136";

      case "ghost":
        return "#735797";

      case "dragon":
        return "#6F35FC";

      case "dark":
        return "#705746";

      case "steel":
        return "#B7B7CE";

      case "fairy":
        return "#D685AD";
    }
  };

  // to get a single color for one type or color gradiant for 2 types
  const backGroundColor = (e) => {
    if (e.e.types.length > 1) {
      return `linear-gradient(${getType(e.e.types[0].type.name)},${getType(e.e.types[1].type.name)})`;
    } else {
      return getType(e.e.types[0].type.name);
    }
  };

  // model View Controller
  // modal function for Detailed View
  function SinglePokemonModal(param) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // console.log(param.data);
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          {param.data.name.toUpperCase()}
        </Button>

        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>{param.data.name.toUpperCase()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Details</h6>
            <hr />
            <p>ID: {param.data.id}</p>
            <p>Height: {param.data.height} inches</p>
            <p>Weight: {param.data.weight} lbs</p>
            <br />
            <h6>Types</h6>
            <hr />
            {param.data.types.map((e) => {
              return <p>{e.type.name.toUpperCase()}</p>;
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <Container className="justify-content-center" fluid>
      <h1>Pokedex</h1>
      <Row className="justify-content-center">
        {!pokemon && (
          <>
            <Spinner animation="grow" />
            <h1>im Looking for Pokemon!</h1>
            <Spinner animation="grow" />
          </>
        )}
        {pokemon &&
          pokemon.map((e) => {
            return (
              <Card
                key={e.id}
                style={{
                  width: "18rem",
                  background: backGroundColor({ e }),
                }}
              >
                <Card.Img variant="top" src={e.sprites.front_default} />
                <Card.Body>
                  <SinglePokemonModal data={e} />
                </Card.Body>
              </Card>
            );
          })}
      </Row>
    </Container>
  );
}

export default Pokedex;
