let arrOfTenProfile = [];
let btnLike = document.getElementsByClassName("chooseContainer__like")[0];
let btnDislike = document.getElementsByClassName("chooseContainer__dislike")[0];
let btnPreviouse = document.getElementsByClassName(
  "chooseContainer__previouse"
)[0];
let name = document.getElementsByClassName("profileContainer__info--name")[0];
let age = document.getElementsByClassName("profileContainer__info--age")[0];
let locationPerson = document.getElementsByClassName(
  "profileContainer__info--location"
)[0];
let image = document.getElementsByClassName(
  "profileContainer__images--image"
)[0];
let profileContainer = document.getElementsByClassName("profileContainer")[0];
let clear = document.getElementsByClassName("clear")[0];

//profiles counter variable en initiated
let profileCounter = 1;
let nextGroupOfProfileCounter = 1;
let profileAddedCounter = 1;

//map
let long = "";
let lat = "";

//Choosing Gender In menu -------------------------- !!! MENU FEATURE WERK NIET !!!
let female = document.getElementsByClassName("menu__burger--female")[0];
let male = document.getElementsByClassName("menu__burger--male")[0];
let both = document.getElementsByClassName("menu__burger--X ")[0];
let url = "https://randomuser.me/api/?results=10";

female.addEventListener("click", function() {
  url = "https://randomuser.me/api/?gender=female";
  UpateProfilesByGenderChosen();

  console.log(url);
});
male.addEventListener("click", function() {
  url = "https://randomuser.me/api/?gender=male";
  UpateProfilesByGenderChosen();

  console.log(url);
});

both.addEventListener("click", function() {
  url = "https://randomuser.me/api/";
  UpateProfilesByGenderChosen();

  console.log(url);
});

//Update Profiles to Chosen Gender
function UpateProfilesByGenderChosen() {
  localStorage.clear();
  setTenProfilesInLocalStorage();
}
//Choosing Gender In menu ------------------------- !!! MENU FEATURE WERK NIET !!!\

//LOAD

//**---==================================================== MAPBOX  MAAAAP---------------------------------- */

let btnMap = document.getElementsByClassName("btn__map")[0];
let map_dom = document.getElementById("map");

btnMap.addEventListener("click", function() {
  if (map_dom.className == "map__show") {
    map_dom.setAttribute("class", "map__hide");
  } else {
    map_dom.setAttribute("class", "map__show");
  }

  console.log("btnMap clicked");
});

//

mapboxgl.accessToken =
  "pk.eyJ1IjoibmF3YW5ndGVuZCIsImEiOiJjam40aXZhN2EwcDNrM3FxeWR1cXpwNDQxIn0.QJHY3Gs8J2UaypqDj77NhA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v10",
  center: [long, lat], // starting position
  zoom: 10,
  minZoom: 5,
  maxZoom: 50
});

// 1 fetch, ipv van 10 fetches
function setTenProfilesInLocalStorage() {
  fetch(url, {
    method: "GET"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      //Binnen deze functie kan je de json data manipuleren
      //we need name, age, location, foto,
      for (let i = 0; i < 10; i++) {
        let profile = [
          data.results[i].name.first,
          data.results[i].dob.age,
          data.results[i].location.city,
          data.results[i].picture.large,
          data.results[i].location.coordinates.longitude,
          data.results[i].location.coordinates.latitude
        ];

        arrOfTenProfile.push(profile);

        localStorage.setItem(
          "profile" + profileAddedCounter.toString(),
          JSON.stringify(profile)
        );

        //console.log("Profile Add: " + profileAddedCounter);
        profileAddedCounter++;
      }
    });
}
setTenProfilesInLocalStorage();

// for (let i = 0; i < 10; i++) {
//   console.log(JSON.parse(localStorage.getItem("profile" + i)));
// }
//Liking en disliking btns
btnLike.addEventListener("click", function() {
  addLikeOfDislikeToProfile("liked");
  goToNextProfile();
});
btnPreviouse.addEventListener("click", function() {
  goToPreviouseProfile();
});
btnDislike.addEventListener("click", function() {
  addLikeOfDislikeToProfile("dis");
  goToNextProfile();
});

// profileContainer.addEventListener("load", function() {
//   console.log(
//     JSON.parse(localStorage.getItem("profile" + profileCounter.toString()))
//   );
//   console.log(profileCounter);
// });

clear.addEventListener("click", function() {
  console.log("Cleared Storage");
  localStorage.clear();
});

function addLikeOfDislikeToProfile(likeStatus) {
  let profileToUpdate = localStorage.getItem("profile" + profileCounter);
  console.log(profileToUpdate);
  let likeOrdislike;
  if (
    profileToUpdate.search("liked") !== -1 ||
    profileToUpdate.search("dis") !== -1
  ) {
    if (profileToUpdate.search("liked") !== -1) {
      profileToUpdate = profileToUpdate.replace("liked", likeStatus);
      console.log("Changed to Dis");
      localStorage.setItem("profile" + profileCounter, profileToUpdate);
    } else {
      profileToUpdate = profileToUpdate.replace("dis", likeStatus);
      localStorage.setItem("profile" + profileCounter, profileToUpdate);
    }
  } else {
    if (likeStatus === "liked") {
      likeOrdislike = '","liked"]';
    } else {
      likeOrdislike = '","dis"]';
    }

    let index = profileToUpdate.indexOf("]") - 1;

    profileToUpdate = profileToUpdate.slice(0, index) + likeOrdislike;
    localStorage.setItem("profile" + profileCounter, profileToUpdate);
    console.log("not likeds");
  }

  //console.log(profileToUpdate);

  //Change like or dislike -- search 4th ','
  let komma4thIndex = profileToUpdate.lastIndexOf(",");
  //console.log("komme:  " + komma4thIndex);
  // console.log(profileToUpdate.slice(komma4thIndex - 1, profileToUpdate.length));
  // console.log(index);
  // console.log(localStorage.getItem("profile" + profileCounter));
}
function goToNextProfile() {
  if (profileCounter < localStorage.length) {
    if (nextGroupOfProfileCounter === 9) {
      setTenProfilesInLocalStorage();

      nextGroupOfProfileCounter = 1;
    } else {
      nextGroupOfProfileCounter++;
    }

    profileCounter++;
    showProfile();
  }
}

function goToPreviouseProfile() {
  console.log(profileCounter);
  if (profileCounter !== 1) {
    profileCounter--;
  }

  console.log(profileCounter);
  showProfile();
}

function showProfile() {
  map.flyTo({
    center: [
      -74.5 + (Math.random() - 0.5) * 10,
      40 + (Math.random() - 0.5) * 10
    ],
    zoom: 16,
    speed: 5 // make the flying fast
  });

  name.textContent = JSON.parse(
    localStorage.getItem("profile" + profileCounter)
  )[0];
  age.textContent = JSON.parse(
    localStorage.getItem("profile" + profileCounter)
  )[1];
  locationPerson.textContent = JSON.parse(
    localStorage.getItem("profile" + profileCounter)
  )[2];
  image.setAttribute(
    "src",
    JSON.parse(localStorage.getItem("profile" + profileCounter))[3]
  );

  long = JSON.parse(localStorage.getItem("profile" + profileCounter))[4];
  lat = JSON.parse(localStorage.getItem("profile" + profileCounter))[5];

  //console.log(profileCounter);
  //console.log(JSON.parse(localStorage.getItem("profile" + profileCounter)));
  // console.log("ProfileNr: " + profileCounter);
}
showProfile();

function removeProfile() {
  localStorage.removeItem("profile" + profileCounter);
}

//Everything with menu
let btnMenu = document.getElementsByClassName("headerContainer__burgermenu")[0];
let menu = document.getElementsByClassName("menu__burger")[0];

let menuItems = document.getElementsByClassName("menu__burger--items")[0];
btnMenu.addEventListener("click", function() {
  menu.classList.toggle("menu__expand");
  menuItems.classList.toggle("menu__show");
  btnMenu.style.color = "white";
});

/* ------------------------------------------List visited Profiles Liked-Dis change--------------*/

let listVisitedProfiles = document.getElementsByClassName(
  "list__visitedprofiles"
)[0];
let btnTinder = document.getElementsByClassName("fas fa-fire")[1];

btnTinder.addEventListener("click", function() {
  listVisitedProfiles.classList.toggle("list__visitedprofiles--show");
  showVisitedProfiles();
});

function showVisitedProfiles() {
  let n = 0;
  listVisitedProfiles.innerHTML = "";
  console.log(profileCounter);

  if (profileCounter === 1) {
    let div = document.createElement("div");
    div.innerText = "Like Or Dislike Profiles To See History";
    listVisitedProfiles.appendChild(div);
  } else {
    for (let i = 1; i < profileCounter; i++) {
      let profileToUpdate = JSON.parse(
        localStorage.getItem(localStorage.key(i))
      );

      //console.log(profileToUpdate[3]);

      let div = document.createElement("div");
      let img = document.createElement("img");
      let divName = document.createElement("div");

      div.setAttribute("class", "list__visitedprofiles--profile");
      img.setAttribute("class", "list__visitedprofiles--profile-image");
      img.setAttribute("src", profileToUpdate[3]);
      divName.setAttribute("class", "list__visitedprofiles--profile-name");

      divName.textContent = profileToUpdate[0];
      div.appendChild(img);
      div.appendChild(divName);

      listVisitedProfiles.appendChild(div);
      n++;

      profileToUpdate = JSON.stringify(profileToUpdate);
      if (profileToUpdate.search("liked") !== -1) {
        profileToUpdate = profileToUpdate.replace("liked", "dis");
        console.log("Changed to Dis: " + profileToUpdate);
        localStorage.setItem("profile" + i, profileToUpdate);
      } else {
        profileToUpdate = profileToUpdate.replace("dis", "liked");
        console.log("Changed to Liked: " + profileToUpdate);
        localStorage.setItem("profile" + i, profileToUpdate);
      }
    }
  }
}
// Change Your Mind with like or Dis

function changeMindLikeOrDis() {}

//some tests to run
let listLocalStorage = document.getElementsByClassName("list__localstorage")[0];
let btnShowList = document.getElementsByClassName("btn__showList")[0];

function showLocalStorageList() {
  for (let key in localStorage) {
    let p = document.createElement("p");

    p.textContent = key + " : " + JSON.parse(localStorage.getItem(key));
    listLocalStorage.appendChild(p);
  }
  console.log(localStorage.length);
}

btnShowList.addEventListener("click", function() {
  listLocalStorage.textContent = "";
  showLocalStorageList();
});

function drawCircleOnMap() {
  map.addSource("geomarker", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [long, lat]
      }
    }
  });
  map.addLayer({
    id: "geomarker",
    type: "circle",
    source: "geomarker",
    "source-layer": "geomarker",
    paint: {
      "circle-radius": 5,
      "circle-color": "#FFFFFF",
      "circle-opacity": 0.5
    }
  });
}
