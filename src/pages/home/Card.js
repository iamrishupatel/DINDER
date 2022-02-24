import React, { useState, useMemo, useRef } from "react";
import h from "./styles.module.css";
// import TinderCard from '../react-tinder-card/index'
import TinderCard from "react-tinder-card";

const acceptedList=[];
const rejectedList=[];

const db = [
  {
    name: "Richard Hendricks",
    url: "./img/richard.jpg"
  },
  {
    name: "Erlich Bachman",
    url: "./img/erlich.jpg"
  },
  {
    name: "Monica Hall",
    url: "./img/monica.jpg"
  },
  {
    name: "Jared Dunn",
    url: "./img/jared.jpg"
  },
  {
    name: "Dinesh Chugtai",
    url: "./img/dinesh.jpg"
  }
];

const Card= ()=> {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        // eslint-disable-next-line no-unused-vars
        .map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, character, index) => {
    if(direction=="left"){
      rejectedList.push(character);
    }
    else{
      acceptedList.push(character);
    }
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  /**
    * Swipe the card manually.
    * takes direction.
  */
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  

  return (
    <div>
      
     
      <div className={h.cardContainer}>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={h.swipe}
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className={h.card}
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className={h.buttons}>
        <button style={{ backgroundColor: !canSwipe && "#c3c4d3" }} onClick={() => swipe("left")}>Swipe left!</button>
      
        <button style={{ backgroundColor: !canSwipe && "#c3c4d3" }} onClick={() => swipe("right")}>Swipe right!</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className={h.infoText}>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className={h.infoText}>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
};

export default Card;