(function(){
    var url="https://api.themoviedb.org/3/list/126260?api_key=4bc1433e9566a0cf0705fc28fd7d1c91&language=ru-RU";
    
    var content=document.querySelector(".content");
    content.innerHTML="<h1>Loading...</h1>";
    var xtr = new XMLHttpRequest();
    xtr.open("GET",url);
    xtr.send();
   
    var arrs=[];
    xtr.addEventListener("readystatechange",function(){
        if(xtr.readyState!=this.DONE){
            return;
        }
        if(xtr.status!=200){
            console.log("Error: "+xtr.status);
        }

        var output= JSON.parse(xtr.responseText);
        // console.log(output);
        
        (output.items).forEach(el => {
            arrs.push(el.id);
            var movie_id=el.id;

            var urlDetails=`https://api.themoviedb.org/3/movie/${movie_id}?api_key=4bc1433e9566a0cf0705fc28fd7d1c91&language=ru-RU`;
            var xtr2 = new XMLHttpRequest();
            xtr2.open("GET",urlDetails);
            xtr2.send();
            content.innerHTML='';

            xtr2.addEventListener("readystatechange",function(){
                if(xtr2.readyState!=this.DONE){
                    return;
                }
                if(xtr2.status!=200){
                    console.log("Error: "+xtr2.status);
                }

                var output2= JSON.parse(xtr2.responseText);
                //console.log(output2);
                var movieHours=parseInt(output2.runtime/60);
                var movieMinutes=output2.runtime%(60*movieHours);
                if(movieMinutes/10<1)movieMinutes="0"+movieMinutes;
                movieTime=movieHours+":"+movieMinutes;
                var genres='';
                (output2.genres).forEach(el => {
                    genres+=el.name+", ";
                });

                content.innerHTML+=
                `<div class="col-xm-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="title">
                        <img src="https://image.tmdb.org/t/p/w500${el.poster_path}">
                        <div class="text">
                            <button class="accordion"><h2 title="${el.original_title || el.original_name}">${el.title}</h2></button>
                            <div class="panel">
                                <p>${el.overview}</p>
                            </div>
                            <P><b><i>Жанры:</i></b> ${genres}</P>
                            <P><b><i>Оценка:</i></b> <b style="color: tomato">${el.vote_average}</b>, ${el.vote_count}</P>
                            <P><b><i>Год:</i></b> ${el.release_date}</P>
                            <P><b><i>Время:</i></b> ${movieTime}</P>
                        </div>
                    
                    <img class="close-button" src="times-circle-solid.svg" alt=""></img>
                    </div>
                </div>`;

                accordion();
            });
            
        });


        var overlayButton=document.querySelector('.overlay-button');
        var k=new popup({
            overlay: '.overlay',
            windowOverlay: '.window-overlay'
        });
        overlayButton.addEventListener("click",k.open);
        overlayButton.addEventListener("click",function(){
            var title=document.querySelectorAll(".title");
            var windowOverlay=document.querySelector(".window-overlay");
            var rand=Math.random()*(title.length);
            //console.log(title.item(rand));
            //content.innerHTML+=(title.item(rand)).innerHTML;
            windowOverlay.innerHTML=`<div class="title window-overlay1 col-md-12 col-xm-12">${title.item(rand).innerHTML}</div>`;
            
            var closeButton=document.querySelector(".window-overlay1 .close-button");
            closeButton.classList.add('ovr-active');
            closeButton.addEventListener("click", k.close);
            
            accordion();
        });    
    });
    var searchForm=document.querySelector('.search-form');
    searchForm.addEventListener("submit",search);
    

    function search(event){
        event.preventDefault();
        var searchText=document.querySelector('.form-control').value;
        var urlSearch=`
        https://api.themoviedb.org/3/search/multi?api_key=4bc1433e9566a0cf0705fc28fd7d1c91&language=ru-RU&query=${searchText}&page=1&include_adult=false`;
        content.innerHTML="<h1>Loading...</h1>";

        fetch(urlSearch)
        .then(function(value){
            return value.json();
        })
        .then(function(output){
            var inner='';
            console.log(output.results);
            (output.results).forEach(el =>{
                var movieName=el.name || el.title;
                var releaseDate=el.release_date || el.first_air_date;
                inner+=`<div class="col-xm-12 col-sm-12 col-md-12 col-lg-6">
                            <div class="title">
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}">
                                <div class="text">
                                    <button class="accordion"><h2 title="${el.original_title || el.original_name}">${movieName}</h2></button>
                                    <div class="panel">
                                        <p>${el.overview}</p>
                                    </div>
                                    <P><b><i>Тип: </i></b>${el.media_type}</P>
                                    <P><b><i>Оценка:</i></b> <b style="color: tomato">${el.vote_average}</b>, ${el.vote_count}</P>
                                    <P><b><i>Год:</i></b> ${releaseDate}</P>
                                    
                                </div>
                                <img class="close-button" src="times-circle-solid.svg" alt=""></img>
                            </div>
                        </div>`;
            
            // <P><b><i>Время:</i></b> ${movieTime}</P>
            // <P><b><i>Жанры:</i></b> ${genres}</P>
        });
            content.innerHTML=inner;
            accordion();
        })
        .catch(function(reason){
            content.innerHTML="Ops, something did wrong!(";
            console.log("Error: "+reason.status);
        });

    }
    
    function popup(obj){
        this.overlay=document.querySelector(obj.overlay);
        this.windowOverlay=document.querySelector(obj.windowOverlay);
        
        var pop=this;

        this.open=function(){
            pop.overlay.classList.add('ovr-active');
            pop.windowOverlay.classList.add('ovr-active');
        }
        this.close=function(){
            
            pop.overlay.classList.remove('ovr-active');
            pop.windowOverlay.classList.remove('ovr-active');
            accordion();
        }
        
        
    }

    function accordion(){
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("active");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
            panel.style.display = "none";
            } else {
            panel.style.display = "block";
            }
        });
        }
    }

}(jQuery));