import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { capitalize, documentTitle, COLOR, formatId } from "../../utils/utils";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import Loader from "../Loader/Loader";
import { BioCard, SpeciesCard, TrainingCard } from "./Cards";
import { usePokemonState, usePokemonSetter } from "../../hooks";
import { ROUTES } from "../../constants/routepaths";
import { PreviousIcon, NextIcon, BackArrow } from "../../icons";
import "./PokemonDetails.scss";

const POKEMON_ID = {
  FIRST: 1,
  LAST: 898,
};

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemonData, pokemonSpeciesData } = usePokemonState();
  const { setPokemonId } = usePokemonSetter();
  const isFirstPokemon = id == POKEMON_ID.FIRST;
  const isLastPokemon = id == POKEMON_ID.LAST;

  useEffect(() => {
    setPokemonId(+id);
  }, [id]);

  useEffect(() => {
    documentTitle.set(pokemonData?.name);
  }, [pokemonData]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);
    return () => document.removeEventListener("keyup", onKeyUp);
  }, [id]);

  const onKeyUp = ({ key }) => {
    if (key === "ArrowLeft") onSelect(-1);
    if (key === "ArrowRight") onSelect(1);
  };

  const launchHomePage = () => {
    documentTitle.reset();
    navigate(ROUTES.HOME);
  };

  const onSelect = (direction) => {
    if (direction === -1 && isFirstPokemon) {
      launchHomePage();
      return;
    }

    if (direction === 1 && isLastPokemon) return;
    navigate(`${ROUTES.DETAILS}/${+id + direction}`);
  };

  const pokemonType = pokemonData?.types[0].type.name;
  const buttonStyles = {
    "--button-hover-bg-clr": COLOR.RGBA(pokemonType),
    "--button-border-clr": COLOR.TYPE(pokemonType),
  };

  return !pokemonData && !pokemonSpeciesData ? (
    <Loader />
  ) : (
    <main className="details">
      <Header
        style={{
          backgroundColor: COLOR.TYPE(pokemonType),
        }}
      >
        <button onClick={launchHomePage}>
          <BackArrow />
        </button>
        <div className="details-header">
          <p>#{formatId(+id)}</p>
          <p>{capitalize(pokemonData?.name)}</p>
        </div>
      </Header>

      <div className="button-container">
        <Button
          onClick={() => onSelect(-1)}
          style={{
            ...buttonStyles,
            visibility: !isFirstPokemon ? "visible" : "hidden",
          }}
        >
          <PreviousIcon />
        </Button>

        <Button
          onClick={() => onSelect(1)}
          style={{
            ...buttonStyles,
            visibility: !isLastPokemon ? "visible" : "hidden",
          }}
        >
          <NextIcon />
        </Button>
      </div>

      <div className="grid-row">
        <div className="card-wrapper">
          <PokemonCard pokemonData={pokemonData} disableClick />
        </div>
        <BioCard />
      </div>

      <div className="grid-row-2">
        <TrainingCard />
        <SpeciesCard />
      </div>
    </main>
  );
};

export default PokemonDetails;
