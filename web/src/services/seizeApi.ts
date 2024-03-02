import axios from "axios";

const raceHistory = [
  {
    name: "Race 1, Round 1",
    id: 1,
    startsAt: 1709067758,
    endsAt: 1709154000,
    minRep: 0,
    maxRep: 100,
    pebbles: [
      { id: 882, name: "Dive School", seizer: "chrisroc", rep: 0 },
      { id: 3, name: "Ghost of Nazcar", seizer: "chrisroc", rep: 0 },
      { id: 23, name: "Indigenous Journeys", seizer: "ryan", rep: 0 },
      { id: 289, name: "Three Amigos", seizer: "lotsofreasons", rep: 0 },
      { id: 269, name: "Eye of Sauron", seizer: "maybe", rep: 0 },
      { id: 457, name: "Woman with Orange Hat", seizer: "MoMO", rep: 0 },
      { id: 94, name: "Currents of Cobalt Calm", seizer: "Paul", rep: 0 },
      { id: 423, name: "Blue Epoch", seizer: "blocknoob", rep: 0 },
      { id: 250, name: "Concert Hallucinations", seizer: "spritey", rep: 0 },
      { id: 155, name: "Carbon Copy", seizer: "RegularDad", rep: 0 },
      { id: 141, name: "Talking with God", seizer: "ricodemus", rep: 0 },
      { id: 962, name: "Night Journeys", seizer: "4lteredBeast", rep: 0 },
      { id: 41, name: "Pathway to Disorder", seizer: "AnimatedNFT", rep: 0 },
      { id: 563, name: "The Penguin", seizer: "boredsurgeon", rep: 0 },
      { id: 81, name: "Shadow of Satoshi", seizer: "OMdegen", rep: 0 },
      { id: 660, name: "Black Rock|Blackrock", seizer: "eddiejpegs", rep: 0 },
    ],
    races: [
      [1, 16],
      [8, 9],
      [4, 13],
      [5, 12],
      [2, 15],
      [7, 10],
      [3, 14],
      [6, 11],
    ],
    data: [{"id":882,"name":"Dive School","seizer":"chrisroc","rep":1151,"reppers":["DeyvisMalta","arsonic","Moonfront","seizar","fertilejim","HugoFaz","web3at50","4lteredBeast","RegularDad","ricodemus","blocknoob","maybe","spritey","brookr"],"repGiven":[50,100,100,69,100,69,69,100,100,86,40,99,100,69]},{"id":3,"name":"Ghost of Nazcar","seizer":"chrisroc","rep":1018,"reppers":["riverofethereum","arsonic","crunch","seizar","fertilejim","Sert","HugoFaz","web3at50","4lteredBeast","Jahcobo","ricodemus","maybe"],"repGiven":[100,100,100,42,100,100,69,69,100,69,69,100]},{"id":23,"name":"Indigenous Journeys","seizer":"ryan","rep":724,"reppers":["arsonic","chrisroc","4lteredBeast","RegularDad","ricodemus","brookr","spritey","blocknoob"],"repGiven":[100,69,100,100,85,100,100,70]},{"id":289,"name":"Three Amigos","seizer":"lotsofreasons","rep":808,"reppers":["arsonic","RegularDad","ricodemus","SBY","jyppy","resmerj","blocknoob","mememaxis","maybe"],"repGiven":[100,100,79,100,100,100,30,100,99]},{"id":269,"name":"Eye of Sauron","seizer":"maybe","rep":1224,"reppers":["EzMonet","MBStuart","arsonic","Sert","Eitzi","MoMO","RegularDad","ricodemus","geumat","lotsofreasons","justanother","spritey","100series","MintFace"],"repGiven":[75,26,100,100,69,100,100,85,100,100,100,100,100,69]},{"id":457,"name":"Woman with Orange Hat","seizer":"MoMO","rep":774,"reppers":["arsonic","RegularDad","ricodemus","brookr","justanother","mememaxis","maybe","MintFace"],"repGiven":[100,100,74,100,100,100,100,100]},{"id":94,"name":"Currents of Cobalt Calm","seizer":"Paul","rep":679,"reppers":["arsonic","crunch","4lteredBeast","ricodemus","justanother","maybe","100series"],"repGiven":[100,100,100,79,100,100,100]},{"id":423,"name":"Blue Epoch","seizer":"blocknoob","rep":1089,"reppers":["DeyvisMalta","mememaxis","arsonic","crunch","seizar","onegweitoday","4lteredBeast","RegularDad","ricodemus","geumat","maybe","priyanka","100series"],"repGiven":[50,100,100,100,100,1,100,100,89,80,69,100,100]},{"id":250,"name":"Concert Hallucinations","seizer":"spritey","rep":1052,"reppers":["EzMonet","arsonic","seizar","chrisroc","MoMO","RegularDad","ricodemus","blocknoob","maybe","justanother","brookr"],"repGiven":[100,100,100,69,100,100,83,100,100,100,100]},{"id":155,"name":"Carbon Copy","seizer":"RegularDad","rep":1097,"reppers":["EzMonet","arsonic","seizar","chrisroc","MoMO","lotsofreasons","ricodemus","blocknoob","spritey","maybe","vanto","MintFace"],"repGiven":[100,100,100,69,100,100,86,100,100,100,100,42]},{"id":141,"name":"Talking with God","seizer":"ricodemus","rep":1213,"reppers":["EzMonet","arsonic","crunch","seizar","chrisroc","vanto","4lteredBeast","RegularDad","blocknoob","mememaxis","spritey","maybe","100series"],"repGiven":[100,100,100,100,69,44,100,100,100,100,100,100,100]},{"id":962,"name":"Night Journeys","seizer":"4lteredBeast","rep":1231,"reppers":["vanto","arsonic","seizar","chrisroc","Maria","crunch","fairo","NachoWeb3","RegularDad","ricodemus","blocknoob","mememaxis","maybe","MintFace"],"repGiven":[7,100,100,99,100,100,100,100,100,83,100,100,100,42]},{"id":41,"name":"Pathway to Disorder","seizer":"AnimatedNFT","rep":1461,"reppers":["EzMonet","arsonic","crunch","seizar","chrisroc","4lteredBeast","MoMO","RegularDad","ricodemus","blocknoob","justanother","maybe","spritey","brookr","100series","MintFace"],"repGiven":[100,100,100,100,69,100,100,100,84,70,100,100,100,69,100,69]},{"id":563,"name":"The Penguin","seizer":"boredsurgeon","rep":961,"reppers":["EzMonet","arsonic","seizar","MoMO","RegularDad","ricodemus","blocknoob","maybe","justanother","mememaxis","100series"],"repGiven":[50,100,100,100,100,82,30,99,100,100,100]},{"id":81,"name":"Shadow of Satoshi","seizer":"OMdegen","rep":1121,"reppers":["EzMonet","arsonic","seizar","MoMO","RegularDad","ricodemus","blocknoob","Maria","justanother","spritey","mememaxis","100series"],"repGiven":[100,100,100,100,100,81,40,100,100,100,100,100]},{"id":660,"name":"Black Rock|Blackrock","seizer":"eddiejpegs","rep":1086,"reppers":["EzMonet","arsonic","crunch","onegweitoday","MoMO","RegularDad","ricodemus","brookr","blocknoob","justanother","100series","MintFace"],"repGiven":[100,100,100,100,100,100,76,100,60,100,100,50]}], // prettier-ignore
  },
  {
    name: "Race 1, Round 2",
    id: 2,
    startsAt: 1709154000,
    endsAt: 1709228000,
    minRep: 100,
    maxRep: 1000,
    pebbles: [
      { id: 882, name: "Dive School", seizer: "chrisroc", rep: 0 },
      { id: 423, name: "Blue Epoch", seizer: "blocknoob", rep: 0 },
      { id: 41, name: "Pathway to Disorder", seizer: "AnimatedNFT", rep: 0 },
      { id: 962, name: "Night Journeys", seizer: "4lteredBeast", rep: 0 },
      { id: 81, name: "Shadow of Satoshi", seizer: "OMdegen", rep: 0 },
      { id: 155, name: "Carbon Copy", seizer: "RegularDad", rep: 0 },
      { id: 563, name: "The Penguin", seizer: "boredsurgeon", rep: 0 },
      { id: 141, name: "Talking with God", seizer: "ricodemus", rep: 0 },
    ],
    races: [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    data: [{"id":882,"name":"Dive School","seizer":"chrisroc","rep":8258,"reppers":["crunch","blocknoob","fertilejim","ricodemus","RegularDad","MintFace","boredsurgeon","justanother","100series"],"repGiven":[1000,969,1000,869,1000,420,1000,1000,1000]},{"id":423,"name":"Blue Epoch","seizer":"blocknoob","rep":3398,"reppers":["AnimatedNFT","chrisroc","ricodemus","RegularDad"],"repGiven":[1000,929,469,1000]},{"id":41,"name":"Pathway to Disorder","seizer":"AnimatedNFT","rep":5489,"reppers":["blocknoob","ricodemus","RegularDad","MintFace","boredsurgeon","justanother","100series"],"repGiven":[300,769,1000,420,1000,1000,1000]},{"id":962,"name":"Night Journeys","seizer":"4lteredBeast","rep":5238,"reppers":["crunch","blocknoob","ricodemus","RegularDad","brookr","mememaxis"],"repGiven":[1000,700,569,1000,969,1000]},{"id":81,"name":"Shadow of Satoshi","seizer":"OMdegen","rep":5589,"reppers":["spritey","blocknoob","ricodemus","MintFace","mememaxis","justanother","100series"],"repGiven":[1000,200,969,420,1000,1000,1000]},{"id":155,"name":"Carbon Copy","seizer":"RegularDad","rep":5669,"reppers":["crunch","AnimatedNFT","blocknoob","ricodemus","vanto","boredsurgeon"],"repGiven":[1000,1000,800,869,1000,1000]},{"id":563,"name":"The Penguin","seizer":"boredsurgeon","rep":4369,"reppers":["mememaxis","blocknoob","ricodemus","RegularDad","100series"],"repGiven":[1000,800,569,1000,1000]},{"id":141,"name":"Talking with God","seizer":"ricodemus","rep":5589,"reppers":["crunch","mememaxis","blocknoob","chrisroc","RegularDad","MintFace","justanother"],"repGiven":[1000,1000,200,969,1000,420,1000]}], // prettier-ignore
  },
  {
    name: "Race 1, Round 3",
    id: 2,
    startsAt: 1709228731,
    endsAt: 1709354000,
    minRep: 1000,
    maxRep: 10000,
    pebbles: [
      { id: 882, name: "Dive School", seizer: "chrisroc", rep: 0 },
      { id: 41, name: "Pathway to Disorder", seizer: "AnimatedNFT", rep: 0 },
      { id: 81, name: "Shadow of Satoshi", seizer: "OMdegen", rep: 0 },
      { id: 141, name: "Talking with God", seizer: "ricodemus", rep: 0 },
    ],
    races: [
      [1, 2],
      [3, 4],
    ],
    data: [{"id":882,"name":"Dive School","seizer":"chrisroc","rep":49903,"reppers":["maybe","fertilejim","blocknoob","agnimax","ricodemus","brookr"],"repGiven":[10000,10000,10000,9634,6000,4269]},{"id":41,"name":"Pathway to Disorder","seizer":"AnimatedNFT","rep":56969,"reppers":["boredsurgeon","4lteredBeast","ricodemus","dsanchesGM","100series","justanother"],"repGiven":[10000,10000,6969,10000,10000,10000]},{"id":81,"name":"Shadow of Satoshi","seizer":"OMdegen","rep":61677,"reppers":["blocknoob","chrisroc","GhostPepper","ricodemus","vanto","100series","spritey","justanother"],"repGiven":[10000,10000,3000,6900,1777,10000,10000,10000]},{"id":141,"name":"Talking with God","seizer":"ricodemus","rep":25069,"reppers":["agnimax","4lteredBeast","NotRealFranc","mememaxis"],"repGiven":[3000,10000,2069,10000]}], // prettier-ignore
  },
  {
    name: "Race 1, Round 4",
    id: 2,
    startsAt: 1709330000,
    endsAt: 1709432846,
    minRep: 10000,
    maxRep: 100000,
    pebbles: [
      { id: 41, name: "Pathway to Disorder", seizer: "AnimatedNFT", rep: 0 },
      { id: 81, name: "Shadow of Satoshi", seizer: "OMdegen", rep: 0 },
    ],
    races: [
      [1, 2],
    ],
    data: []
  }
];

const fetchPebbleReps = async (seizer: string, currentRace: { name: string; id: number; startsAt: number; endsAt: number; minRep: number; maxRep: number; pebbles: { id: number; name: string; seizer: string; rep: number; }[]; races: number[][]; data: { id: number; name: string; seizer: string; rep: number; reppers: string[]; repGiven: number[]; }[]; }) => {
  try {
    const response = await axios.get("https://api.seize.io/api/profile-logs", {
      params: {
        page: 1,
        page_size: 100,
        include_incoming: true,
        rating_matter: "REP",
        profile: seizer,
      },
    });
    const items = response.data.data;

    // Filter items based on 'new_rating' within 'contents'
    const vaildReps = items.filter(
      (item: {
        contents: { new_rating: number };
        created_at: number;
        target_profile_handle: string;
      }) => {
        const newRating = item.contents.new_rating;
        const timestamp = new Date(item.created_at).getTime() / 1000;
        return (
          newRating > currentRace.minRep &&
          newRating <= currentRace.maxRep &&
          timestamp > currentRace.startsAt &&
          timestamp < currentRace.endsAt &&
          item.target_profile_handle === seizer
        );
      }
    );
    return vaildReps;
  } catch (error) {
    console.error("Error fetching pebble reps:", error);
    return [];
  }
};

export { fetchPebbleReps, raceHistory };
