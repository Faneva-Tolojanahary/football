import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import Loading from "./composants/Loading";

const App = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Submit = async (event) => {
    event.preventDefault();
    if (!search.trim()) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${search}`
      );
      const players = response.data.player;
      const soccerPlayers = players?.filter(
        (player) => player.strSport === "Soccer"
      );

      console.log(soccerPlayers);

      setTimeout(() => {
        if (soccerPlayers && soccerPlayers.length > 0) {
          navigate(`/${search}`);
        }
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div class="relative isolate h-screen overflow-hidden bg-gray-900">
        <div class="absolute inset-0 flex items-center justify-center px-6">
          <div class="max-w-xl text-center">
            <h2 class="text-4xl font-semibold tracking-tight text-white">
              Recherche de joueur de football
            </h2>
            <p class="mt-4 text-lg text-gray-300">
              Merci d’indiquer le nom du joueur que vous souhaitez rechercher.
            </p>
            <form
              onSubmit={Submit}
              class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
            >
              <input
                class="w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nom du joueur"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default App;
