var Client=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){},function(e,t,n){},function(e,t,n){"use strict";n.r(t),n.d(t,"addTrip",(function(){return f})),n.d(t,"checkInput",(function(){return v.checkInput}));const r=document.getElementById("result-box"),o=document.getElementById("button-trip"),a=(document.getElementById("save"),document.getElementById("delete"),document.querySelector('input[name="destination"]')),c=document.querySelector('input[name="start-date"]'),i=document.querySelector('input[name="end-date"]'),u=document.getElementById("remaining-days"),l=document.getElementById("trip-duration"),s=document.getElementById("city"),d=document.getElementById("date"),m=document.getElementById("temp");function f(e){e.preventDefault();const t=a.value,n=c.value,r=i.value;0===t.length||0===n||0===r||r-n<0?alert("Data is not inserted correctly.. Please try again"):y("http://api.geonames.org/searchJSON?q=",t,"travelling").then(e=>{const t=e.geonames[0].lat,n=e.geonames[0].lng,r=e.geonames[0].countryName;console.log(t,n,r);const o=g(t,n);return console.log(o),o}).then(e=>{const o=p("http://localhost:8000/add",{newDestination:t,departureDate:n,endingDate:r,temp:e.data[0].temp});return console.log(o),o}).then(e=>{h(e)})}o.addEventListener("click",f);const y=async(e,t,n)=>{const r=await fetch(e+t+"&maxRows=10&username="+n);try{return await r.json()}catch(e){console.log("There was an error with retrieving data from the Location",e)}},g=async(e,t)=>{const n=await fetch(`https://api.weatherbit.io/v2.0/current?&lat=${e}&lon=${t}&key=7468f7e0d79a4cf5ab5f70d3faf3b1ed`);try{const e=await n.json();return console.log("Ciao"),e}catch(e){console.log("There was an error with retrieving data from the Weather, error")}},p=async(e="",t={})=>{const n=await fetch(e,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({city:t.newDestination,startDate:t.departureDate,endDate:t.endingDate,temp:t.temp})});try{const e=await n.json();return console.log(e),e}catch(e){console.log("There was an error with your POST request",e)}},h=async e=>{try{r.classList.remove("hidden"),s.innerHTML=e.newDestination,d.innerHTML=e.startDate,u.innerHTML=(()=>{const e=new Date(c.value),t=new Date,n=Math.floor(e-t);return Math.floor(n/864e5+1)})(),l.innerHTML=(()=>{const e=new Date(c.value);return(new Date(i.value).getTime()-e.getTime())/864e5})(),m.innerHTML=e.temp}catch{console.log("error",error)}};var v=n(0);n(1)}]);