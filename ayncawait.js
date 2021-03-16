import { response } from "express";

function loadJson(url) {
    return fetch(url)
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      });
  }
  
  loadJson('no-such-user.json')
    .catch(alert); // Error: 404

async function loadJson(url) {
    let data = await fetch(url);

    if(data.status == 200) {
        return data.json();
    } else {
        throw new Error(data.status);
    }
}


loadJson('no-such-user.json')
  .catch(alert); // Error: 404