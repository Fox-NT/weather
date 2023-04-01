// window.addEventListener('load', () => { /* Страница загружена, включая все ресурсы */
//
//     preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
// })

const apiKey = '5672fd5d8aee9b72d8f3026061826f0f';
const lang = 'ru';
const units = 'metric';



const city = document.querySelector('.city');
const time = document.querySelector('.time__current');
const temp = document.querySelector('.temperature span');
const icon = document.querySelector('.icon img');
const cloud = document.querySelector('.weather');
const felt = document.querySelector('.felt__temp');
const winds = document.querySelector('.speed');
const windd = document.querySelector('.direct');
const water = document.querySelector('.water span');
const baro = document.querySelector('.baro span');
const degr = document.querySelector('.degr');
const bgr = document.querySelector('.app');
const preloader = document.querySelector('.preloader')

const list = document.querySelector('.history__wrapper');
const inputc = document.querySelector('.input input');

let wind;
let count = 0;
let width = 0;

inputc.value = '';
inputc.addEventListener('input',(e) => {
    e.preventDefault();
    input = inputc.value;
    list.innerHTML = '';

    getWeatherNow();
    getWeatherWeek();
})
function getWeatherNow() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=${units}&lang=${lang} `)
        .then(result => result.json())
        .then(function (weather) {

            if (weather.name == undefined || weather.name == null || weather.name == false || weather.name == '') {
                preloader.classList.remove('preloader_hidden');
                city.textContent = 'Не определён';
            } else {
                preloader.classList.add('preloader_hidden')
                city.textContent = `${weather.name}`;
            }
            let b = new Date(weather.dt*1000)
            let bH = b.getHours();
            let bM = b.getMinutes();

            bH < 10 ? bH = '0' + bH : bH
            bM < 10 ? bM = '0' + bM : bM;
            time.textContent = `${bH}:${bM}`
            temp.textContent = `${Math.round(weather.main.temp)}`;
            icon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`)
            let str = weather.weather[0].description;
            let newStr = str[0].toUpperCase() + str.slice(1);
            icon.setAttribute("title", newStr)

            cloud.textContent = newStr;
            bgr.style.background = `url(img/${weather.weather[0].main}.jpg)`;
            // wind10 = weather.wind.speed * 1.5;
            // felt.textContent = Math.round(13.12+(0.6215*(weather.main.temp))-(11.37*(Math.pow(wind10,0.16)))+(0.3965*(weather.main.temp)*(Math.pow(wind10,0.16))))
            felt.textContent = Math.round(weather.main.feels_like);
            if (20 < weather.wind.deg && weather.wind.deg < 70) {
                wind = 'СВ'
            } else if (110 <= weather.wind.deg && weather.wind.deg  < 160) {
                wind = 'ЮВ'
            } else if (200 <= weather.wind.deg && weather.wind.deg  < 250) {
                wind = 'ЮЗ'
            } else if (290 <= weather.wind.deg && weather.wind.deg  < 340) {
                wind = 'СЗ'
            } else if (0 <= weather.wind.deg && weather.wind.deg < 20) {
                wind = 'С'
            } else if (340 <= weather.wind.deg && weather.wind.deg <= 360) {
                wind = 'С'
            }
            else if (70 <= weather.wind.deg && weather.wind.deg  < 110) {
                wind = 'В'
            }
            else if (160 <= weather.wind.deg && weather.wind.deg  < 200) {
                wind = 'Ю'
            }
            else if (250 <= weather.wind.deg && weather.wind.deg  < 290) {
                wind = 'З'
            }
            degr.style.transform = `rotate(${weather.wind.deg}deg)`
            winds.textContent = `${Math.round(weather.wind.speed)}`
            windd.textContent = `${wind}`
            water.textContent = weather.main.humidity
            baro.textContent = Math.round(weather.main.pressure*0.7500637554192);
        })
        .catch(error => console.log(error));


}
function getWeatherWeek () {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${apiKey}&units=${units}&lang=${lang} `)
        .then(result => result.json())
        .then(function (week) {
            list.innerHTML = '';
                week.list.forEach((item) => {
                    let date = Date.parse(item.dt_txt);
                    let newDate = new Date(date);
                    let day = newDate.getDate();
                    let month = newDate.getMonth()+1;
                    let hours = newDate.getHours();
                    let minute = newDate.getMinutes();
                    minute < 10 ? minute = '0' + minute : minute
                    hours < 10 ? hours = '0' + hours : hours;
                    month < 10 ? month = '0' + month : month;
                    day < 10 ? day = '0' + day : day;
                    let div = document.createElement('div');
                    div.className = 'item';
                    div.innerHTML = `
                    <div class="item__date">${day}.${month}</div>
                        <div class="item__time">${hours}:${minute}</div>
                        <div class="item__icon"><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" title="${item.weather[0].description}" alt=""></div>
                        <div class="item__temp">${Math.round(item.main.temp)} °C</div>`;
                        list.append(div);
                })
        })
        .then(() => {
            const next = document.querySelector('.next');
            const prev = document.querySelector('.prev');
            const scroll = document.querySelector('.history__wrapper');
            const block = document.querySelectorAll('.item');
            width = ((block.length-4) * 90)
            if (count < width) {
                next.classList.remove('disable');
            }
            if (count-90 > 0) {
                prev.classList.remove('disable');
            }
            next.onclick = function(e) {
                e.preventDefault();
                if (width >= count+90) {
                    scroll.style.transform = `translateX(-${count+90}px)`;
                    count += 90;
                }
                if (width >= count && width <= count) {
                    next.classList.add('disable');
                    // i -= 90;
                } else if (count < width){
                    next.classList.remove('disable');
                }

                if (count > 0) {
                    prev.classList.remove('disable');
                }

            }
            prev.onclick = function(e) {
                e.preventDefault();
                if (count > 0) {
                    scroll.style.transform = `translateX(-${count-90}px)`;
                    count -= 90;
                }
                // if (width >= i-90 && width <= i) {
                //     prev.classList.add('disable');
                // }
                if (count < width){
                    next.classList.remove('disable');
                }
                if (count <= 0) {
                    prev.classList.add('disable');
                }
            }
        })

        .catch(error => console.log(error));
}




