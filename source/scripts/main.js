window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
function init() {
  let events = getEventFromStorage();
  addEventsToDoc(events);
  if (document.querySelector('#event-form')) {
    initFormHandler();
  }
  let pageIdentifier = document.querySelector('title') //use to identify different pages?? 
  if(pageIdentifier.id == "home"){
    goToSpecificPage(); //viewPage
  }
  if(pageIdentifier.id == "specifc event"){
    addToSpecificPage(events);
  }
  if(pageIdentifier.id == "edit event"){
    addToEditPage(events);
  }
}


/**
 * Reads 'events' from localStorage and returns an array of
 * all of the events found (parsed, not in string form). If
 * nothing is found in localStorage for 'event', an empty array
 * is returned.
 * @returns {Array<Object>} An array of events found in localStorage
 */
function getEventFromStorage() {
  return JSON.parse(window.localStorage.getItem('events')) || [];
}


/**
 * Takes in an array of events, converts it to a string, and then
 * saves that string to 'events' in localStorage
 * @param {Array<Object>} events An array of events
 */
function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}


/**
 * Takes in an array of events and for each event creates a
 * new <event-card> element, adds the event data to that card
 * using element.data = {...}, and then appends that new event
 * to <main>
 * @param {Array<Object>} events An array of events
 */
function addEventsToDoc(events) {
  let main = document.querySelector('main');

  if (events == null || main == null) {
    return;
  }

  for (const event of events) {
    let eventCard = document.createElement('event-card');
    eventCard.data = event;
    main.append(eventCard);
  }
}


/**
 * Takes in a FormData object and uses all of its the key,value
 * pairs to create a JSON object to be stored onto LocalStorage
 * @param {Array<Object>} formData A FormData object 
 */
function convertForm2JSON(formData) {
  let eventObj = {};
  for (const [key, value] of formData.entries()) {
    eventObj[key] = value;
  }
  return eventObj;
}


/**
 * Adds the necessary event handlers to <form> 
 */
function initFormHandler() {
  let main = document.querySelector('main')
  let eventForm = document.querySelector('#event-form');
  let cancelbtn = document.querySelector('#cancelbtn');

  const imgFile = document.querySelector('#imgFile');
  const eImg = document.querySelector('#eImg');
  let dataURL;

  // Displays image file via dataurl and saves it to be stored locally when form is submitted
  imgFile.addEventListener('change', (event) => {
    const file = imgFile.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        eImg.src = reader.result;
        dataURL = reader.result;
    });
    reader.readAsDataURL(file);
  });

  // Creates event-card from form data and saves it locally
  eventForm.addEventListener('submit', e => {
    
    e.preventDefault();
    document.querySelector('.popWin').style.display = 'flex';
    
    const formData = new FormData(eventForm);
    let eventObj = convertForm2JSON(formData);

    eventObj.eImg = dataURL;

    let eventCard = document.createElement('event-card');
    eventCard.data = eventObj;
    main.append(eventCard);

    let localEvents = getEventFromStorage();
    localEvents.push(eventObj);
    saveEventsToStorage(localEvents);
    
    console.log('update log');
    //document.querySelector('.popWin').style.display = 'flex';
    
    //popup();
  });

  cancelbtn.addEventListener('click', f => {
    f.preventDefault();
    window.location.href ="../homePage.html";
  });
}

//document.getElementById()
// document.getElementById('added').addEventListener('click',function() {

//   
   
// })

//  function popup(){
//   document.querySelector('.popWin').style.display = 'flex';
//  }

// document.querySelector('#event-form').addEventListener('submit', function(){
//   document.querySelector('.popWin').style.display = 'flex';
// })

let okButton = document.getElementById('ok');
if(okButton != null){
  document.getElementById('ok').addEventListener('click',e => {
    e.preventDefault();
    //document.querySelector('.popWin').style.display = 'none';
    window.location.href = "../homePage.html";

  })
}

// goto a specific event page
function goToSpecificPage(){
  let main = document.querySelector('main');
  let eventList = main.querySelectorAll('event-card');
  for(let index = 0; index < eventList.length; index ++){
    let eRoot =  eventList[index].shadowRoot;
    let viewEventButton = eRoot.querySelector('button');
    viewEventButton.addEventListener("click", ()=>{
      window.sessionStorage.setItem('currentEvent', JSON.stringify(index));
      let eventImg = eRoot.querySelector("img");
      window.sessionStorage.setItem('currentEventImg', JSON.stringify(eventImg.src));
      window.location.href = "./reference/specificEventsPage.html";
    })
  }
}

function addToSpecificPage(events){
  let eventIndex = JSON.parse(window.sessionStorage.getItem('currentEvent'));
  let currentEvent = events[eventIndex];

  let title = document.querySelector('#title');
  title.innerText = "Event Title: " + currentEvent.eTitle;

  let start_date = document.querySelector('#start_date');
  start_date.innerText = "Start Time: " + currentEvent.startTime;

  let end_date = document.querySelector('#end_date');
  end_date.innerText = "End Time: " + currentEvent.endTime;

  let organization = document.querySelector('#organization');
  organization.innerText = "Organization: " + currentEvent.eOrg;

  let location = document.querySelector('#location');
  location.innerText = "Location: " + currentEvent.eMedium;

  let descrption = document.querySelector('#description');
  descrption.innerText = currentEvent.eDesc;

  document.querySelector('#edit_event').addEventListener('click', ()=>{
    window.location.href = "../reference/editEventPage.html";
  })
}

function addToEditPage(events){
  let eventIndex = JSON.parse(window.sessionStorage.getItem('currentEvent'));
  let currentEvent = events[eventIndex];

  let title = document.querySelector('#title');
  title.innerText = "Event Title: " + currentEvent.eTitle;

  let start_date = document.querySelector('#start_date');
  start_date.innerText = "Start Time: " + currentEvent.startTime;

  let end_date = document.querySelector('#end_date');
  end_date.innerText = "End Time: " + currentEvent.endTime;

  let organization = document.querySelector('#organization');
  organization.innerText = "Organization: " + currentEvent.eOrg;

  let location = document.querySelector('#location');
  location.innerText = "Location: " + currentEvent.eMedium;

  let descrption = document.querySelector('#description');
  descrption.innerText = "Description: " + currentEvent.eDesc;

  document.querySelector('#edit').addEventListener('click', ()=>{
    console.log("edit event")
  })

  document.querySelector('#delete').addEventListener('click', ()=>{
    console.log("delete event")    
  })
}

/**
 * Gives a dynamic searching functionality to the search bar. When
 * an input is detected, gets rid of all the results without the input.
 */
 function dynamicSearch(e) {
  let input = document.querySelector('input').value;
  input = input.toLowerCase();
  let card = document.getElementsByTagName('event-card');


  for (let i = 0; i < card.length; i++) {
    let eventShadow = card[i].shadowRoot;
    let x = eventShadow.querySelector('style');
    let y = eventShadow.querySelector('.title');
    if (!(y.textContent.toLowerCase().includes(input))) {
      x.innerHTML = 
      `
      * {
          font-family: sans-serif;
          margin: 0;
          padding: 0;
      }

      article {
          align-items: center;
          border: 1px solid #000;
          border-radius: 8px;
          display: none;
          grid-template-rows: 80px 50px 15px 18px 15px 36px;
          height: 400px;
          padding: 5px 20px 20px 20px;
          float: left;
          column-gap: 10%;
          row-gap: 10%;
          margin-right: 40px;
          margin-bottom: 20px;
      }

      article p{
        color: #000;
        font-size: 20px;
        text-align: center;
        margin-top: 50px;
        margin-bottom: -3.5cm;
      }

      article p+p {
          color: #000;
          font-size: 20px;
          padding-bottom: 40px;
          text-align: center;
          margin-bottom: -3.5cm;
        }

        
      article h1 {
          color: #000;
          text-align: center;
          margin-bottom: -7cm;
        }

        article img {
          border: 5px solid black;
          border-radius: 8px;
          margin-top:auto;
          margin-bttom: auto;
          margin-left: auto;
          margin-right: auto;
          width: 400px;
          height: 250px;
         
        }

        article button {
          align_items:bottom;
          border: 1px solid #414BB2;
          background-color: #414BB2;
          border-radius: 14px;
          color: white;
          cursor: pointer;
          font-size: 20px;
          padding: 5px 20px;
          top:50%;
          margin-bottom: -3.5cm;
        }`;
    }
    else {
      x.innerHTML = `
      * {
          font-family: sans-serif;
          margin: 0;
          padding: 0;
      }

      article {
          align-items: center;
          border: 1px solid #000;
          border-radius: 8px;
          display: grid;
          grid-template-rows: 80px 50px 15px 18px 15px 36px;
          height: 400px;
          padding: 5px 20px 20px 20px;
          float: left;
          column-gap: 10%;
          row-gap: 10%;
          margin-right: 40px;
          margin-bottom: 20px;
      }

      article p{
        color: #000;
        font-size: 20px;
        text-align: center;
        margin-top: 50px;
        margin-bottom: -3.5cm;
      }

      article p+p {
          color: #000;
          font-size: 20px;
          padding-bottom: 40px;
          text-align: center;
          margin-bottom: -3.5cm;
        }

        
      article h1 {
          color: #000;
          text-align: center;
          margin-bottom: -7cm;
        }

        article img {
          border: 5px solid black;
          border-radius: 8px;
          margin-top:auto;
          margin-bttom: auto;
          margin-left: auto;
          margin-right: auto;
          width: 400px;
          height: 250px;
         
        }

        article button {
          align_items:bottom;
          border: 1px solid #414BB2;
          background-color: #414BB2;
          border-radius: 14px;
          color: white;
          cursor: pointer;
          font-size: 20px;
          padding: 5px 20px;
          top:50%;
          margin-bottom: -3.5cm;
        }
      
      `;
    }
  }
}

if (document.getElementsByClassName('search-bar')[0]) {
  document.getElementsByClassName('search-bar')[0].addEventListener('input', dynamicSearch);
}
