import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../composants/Loading";

const AllPlayers = () => {
  const { playerName } = useParams();
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`
        );
        const players = response.data.player;
        const soccerPlayers = players?.filter(
          (player) => player.strSport === "Soccer"
        );
        setAllPlayers(soccerPlayers);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlayerData();
  }, [playerName]); //

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gray-900 text-white p-10">
      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.9,
              },
            },
          }}
        >
          {allPlayers.map((item) => (
            <motion.div
              key={item.idPlayer}
              className="bg-white/10 p-4 rounded-xl shadow-md flex flex-col items-center hover:scale-110 transition-transform duration-300 ease-in-out"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <h1 className="text-xl font-bold mb-2 text-center">
                {item.strPlayer}
              </h1>

              {item.strThumb ? (
                <img
                  src={item.strThumb}
                  alt={item.strPlayer}
                  className="w-40 h-40 object-cover rounded-full"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center bg-gray-700 text-sm text-gray-300 rounded-full">
                  Pas d’image
                </div>
              )}
              <p className="my-2">{item.strTeam}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AllPlayers;
