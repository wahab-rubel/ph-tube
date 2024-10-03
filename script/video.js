console.log('vide js');

// 1- fetch, load and show categories on html
function getTimeString(time){
  // get Hour and rest seconds 
  const hour = parseInt(time / 3600);
  let remainingSecond = (time % 3600);
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ${minute }  ${remainingSecond} second ago`;
}

const removeActionClass = () => {
const buttons = document.getElementsByClassName("category-btn");
console.log(buttons);
for(let btn of buttons){
  btn.classList.remove("active");
}
}
// Create loadCategories
const loadCategories = () => {
 
 fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
 .then((res) => res.json())
 .then((data) => displayCategories(data.categories))
 .catch((error) => console.log(error));
};
const loadVideos = (searchText = "") => {
 
 fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
 .then((res) => res.json())
 .then((data) => displayVideos(data.videos))
 .catch((error) => console.log(error));
};

const loadCategoriesVideos = (id) => {
  // alert(id);
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
 .then((res) => res.json())
 .then((data) => {
  // all active class remove here
    removeActionClass();
  // do the active id class
  const activeBtn = document.getElementById(`btn-${id}`);
  activeBtn.classList.add('active');
  displayVideos(data.category)
 })
 .catch((error) => console.log(error));
}

const loadDetails = async (videoId) => {
console.log(videoId);
const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
const res = await fetch(uri);
const data = await res.json();
displayDetails(data.video);
}
const displayDetails = (video) => {
  console.log(video);
  const detailsContainer = document.getElementById("modal-content");

  detailsContainer.innerHTML = `
  <img src=${video.thumbnail} />
  <p>${video.description}</p>
  `


  //way 1
  // document.getElementById("showModal").click();
  document.getElementById("customModal").showModal();
};

// const cardDemo = {
  
//     "category_id": "1001",
//     "video_id": "aaab",
//     "thumbnail": "https://i.ibb.co/QPNzYVy/moonlight.jpg",
//     "title": "Midnight Serenade",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/fDbPv7h/Noha.jpg",
//             "profile_name": "Noah Walker",
//             "verified": false
//         }
//     ],
//     "others": {
//         "views": "543K",
//         "posted_date": ""
//     },
//     "description": "'Midnight Serenade' by Noah Walker is a soulful journey into the depths of the night, capturing the mystique and allure of a moonlit evening. With 543K views, this song brings together tender melodies and evocative lyrics, making it a favorite among listeners seeking a contemplative yet uplifting experience. Immerse yourself in this musical masterpiece and feel the calm embrace of the night."
// };


const displayVideos = (videos) => {
  const videosContainer = document.getElementById('videos');
  videosContainer.innerHTML = "";

  if(videos.length == 0) {
    videosContainer.classList.remove("grid");
    videosContainer.innerHTML = `
    <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
    <img src="icon.png" />
    <h2 class="font-bold text-xl text-center">
    Oops!! Sorry, There is no <br> content here
    </h2>
    </div>
    `;
    return;
  }else{
    videosContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    // console.log(video);
    const card = document.createElement('div');
    card.classList = 'card card-compact';
    card.innerHTML = `
    <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail}
      class="h-full w-full object-cover"
      alt="Shoes" />
      ${
        video.others.posted_date.length == 0 ? "" : `
        <span class="absolute text-xs right-8 bottom-8 bg-black text-white rounded p-2">${getTimeString(video.others.posted_date)}</span>
        `
      }
      
  </figure>
  <div class="px-0 py-2 flex gap-1">
    <div>
    <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
    </div>
    <div>
    <h2 class="font-bold">${video.title}</h2>
    <div class="flex items-center gap-2">
    <p class="text-gray-400">${video.authors[0].profile_name}</p>

    ${video.authors[0].verified === true ? '<img class="w-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png"/>' : " "}

    </div>
    <p><button onClick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">details</button></p>
    </div>
  </div>
    `;
    videosContainer.append(card);
  });
}

// category: "Music"
// category_id: "1001"


// Create displayCategories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById('categories');

  categories.forEach(item => {
    console.log(item);


    const buttonContainer = document.createElement('button');
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoriesVideos(${item.category_id})" class="btn category-btn">
    ${item.category}
    </button>
    `
    

    categoryContainer.append(buttonContainer);

  });
}


document.getElementById('search-input').addEventListener('keyup', (e) => {
  loadVideos(e.target.value);
});
loadCategories()
loadVideos()
