/**
 * [Function to detect page type]
 * @param  {[type]} ){}() [description]
 * @return {[type]}         [description]
 */
var page = (function(){
    return $('body').attr('page_type');
}());
/*
* Function to detect IE
*/
// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
//     ie === undefined
// If you're in IE (>=5) then you can determine which version:
//     ie === 7; // IE7
// Thus, to detect IE:
//     if (ie) {}
// And to detect the version:
//     ie === 6 // IE6
//     ie > 7 // IE8, IE9 ...
//     ie < 9 // Anything less than IE9
// ----------------------------------------------------------

// UPDATE: Now using Live NodeList idea from @jdalton

var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}());

/*
* Function to animate content details
*/
function animateContent() {
    // show the rest of the content
    $('#content-detail').css({'opacity':'0', 'top':'50px'}).stop().animate({'opacity':'1', 'top':'0px'}, 500, 'easeOutExpo');
    $('#footer').css({'opacity':'0', 'top':'50px'}).stop().animate({'opacity':'1', 'top':'0px'}, 500, 'easeOutExpo');
};

/*
* Function to switch face on browser resize
*/
$.fn.resizeFace = function() {

    $(window).resize(function() {

        // Show large face
        if($(window).width() >= 1140) {

            $('#virgo-img').css({'opacity':'1'});
            $('#coder-img').css({'opacity':'1'});
            $('#virgo-bg').css({'opacity':'1'});
            $('#coder-bg').css({'opacity':'1'});
            $('#virgo').css({'opacity':'1'});
            $('#coder').css({'opacity':'1'});

        } else { // Show smaller face image

            $('#face-img').css({'opacity':'1'});
            $('#virgo').css({'opacity':'1'});
            $('#coder').css({'opacity':'1'});
        }

    });
};

/*
* Function to animate home page
*/
$.fn.animateHome = function() {

    // only animate for large desktop browsers
    if($(window).width() >= 1140){

        $('#content').animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#virgo-img').css({'left':'-500px'}).stop().animate({'opacity':'1', 'left':'100px'}, 1000, 'easeOutExpo');
        $('#coder-img').css({'right':'-500px'}).stop().animate({'opacity':'1', 'right':'100px'}, 1000, 'easeOutExpo');
        $('#virgo-bg').css({'left':'-500px'}).stop().animate({'opacity':'1', 'left':'100px'}, 1500, 'easeOutBack');
        $('#coder-bg').css({'right':'-500px'}).stop().animate({'opacity':'1', 'right':'100px'}, 1500, 'easeOutBack');
        $('#virgo').delay(1500).animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#coder').delay(1500).animate({'opacity':'1'}, 500, 'easeOutExpo', function(){ animateFace(); });

    }else{

        $('#content').animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#face-img').animate({'opacity':'1'}, 2000, 'easeOutExpo');
        $('#virgo').delay(1000).animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#coder').delay(1000).animate({'opacity':'1'}, 500, 'easeOutExpo', function(){ animateContent(); });

    }
};

/*
* Function to animate face
*/
function animateFace() {

    var virgoImg     = $('#virgo-img'),
        coderImg        = $('#coder-img'),
        virgoHover   = $('#virgo'),
        coderHover      = $('#coder'),
        virgoDesc    = $('#virgo-desc'),
        coderDesc       = $('#coder-desc'),
        virgoArrow   = $('#virgo-arrow'),
        coderArrow      = $('#coder-arrow'),
        virgoBg      = $('#virgo-bg'),
        coderBg         = $('#coder-bg'),
        face            = $('#face'),
        section         = $('#section'),
        duration        = 500,

        mouseX = 0,
        relMouseX = 520,
        xp = 520,
    frameRate =  30,
    timeInterval = Math.round( 1000 / frameRate ),
    loop = null;

    // Firstly animate the bottom content onto the page
    animateContent();

    section.mouseenter(function(e){

        // Get mouse position
        section.mousemove(function(e){

            // raw mouse position
            mouseX = e.pageX;

            // mouse position relative to face div
            relMouseX = mouseX - face.offset().left;

        });

        // Animate the face based on mouse movement
        loop = setInterval(function(){

            // zeno's paradox dampens the movement
            xp += (relMouseX - xp) / 12;

            virgoImg.css({width:420 + (520 - xp) * 0.5, left: 100 + (520 - xp) * 0.1});
            coderImg.css({width:420 + (xp - 520) * 0.5, right: 100 - (520 - xp) * 0.1});

            virgoBg.css({left: 100 + (520 - xp) * 0.05, opacity: ((1040 - xp)/520)});
            coderBg.css({right:  100 + (xp - 520) * 0.05, opacity: (xp/520)});

            virgoDesc.css({opacity: ((1040 - xp)/520)});
            coderDesc.css({opacity: (xp/520)});

        }, timeInterval );

    }).mouseleave(function(e){

        // reset the face to initial state

        if(loop){
            clearInterval(loop);
        }
        xp          = 520;
        mouseX      = 0;
        relMouseX   = 520;

        virgoImg.hoverFlow(e.type, {width: 420, left: 100}, duration, 'easeOutQuad');
        coderImg.hoverFlow(e.type, {width: 420, right: 100}, duration, 'easeOutQuad');
        coderDesc.hoverFlow(e.type, {opacity: 1}, duration, 'easeOutQuad');
        virgoDesc.hoverFlow(e.type, {opacity: 1}, duration, 'easeOutQuad');
        coderBg.hoverFlow(e.type, {right:100, opacity: 1}, duration, 'easeOutQuad');
        virgoBg.hoverFlow(e.type, {left:100, opacity: 1}, duration, 'easeOutQuad');

    });

};

/*
* Function to animate image thumbnail arrows on hover
*/
$.fn.hoverThumb = function() {

    // only animate for large desktop browsers
    if($(window).width() >= 1140){

        this.mouseenter(function(e){

            $(this).find('.arrow-r').hoverFlow(e.type, {opacity:1, right:15}, 500);
            //$(this).hoverFlow(e.type, {opacity:1}, 300).siblings().hoverFlow(e.type, {opacity:0.3}, 300);
            $(this).stop().animate({'opacity':'1'}, 300).siblings().stop().animate({'opacity':'0.4'}, 500);

        }).mouseleave(function(e){

            $(this).find('.arrow-r').hoverFlow(e.type, {opacity:0, right:0}, 500);

        });

        // once the mouse leaves the whole thumbs div
        $('#thumbs').mouseleave(function(e){

            // we reset the thumbs
            $('#thumbs li').stop().animate({'opacity':'1'}, 500);

        });

    }
};

/*
* Function to animate main section
*/
function animateMain() {

    $('#text-main').css({'visibility':'visible', 'right':'50%'}).stop().animate({'opacity':'1', 'right':'0%'}, 1000, 'easeOutExpo');
    $('#img-main').css({'visibility':'visible', 'left':'50%'}).stop().delay(100).animate({'opacity':'1', 'left':'0%'}, 1000, 'easeOutExpo');

    $('#snaps').css({'visibility':'visible', 'opacity':'1'});
    $('#snaps-1').css({'visibility':'visible', 'top':'50px'}).stop().delay(300).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack');
    $('#snaps-2').css({'visibility':'visible', 'top':'50px'}).stop().delay(500).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack');
    $('#snaps-3').css({'visibility':'visible', 'top':'50px'}).stop().delay(700).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack');
    $('#snaps-4').css({'visibility':'visible', 'top':'50px'}).stop().delay(900).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack');
    $('#snaps-5').css({'visibility':'visible', 'top':'50px'}).stop().delay(1100).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack');
    $('#snaps-6').css({'visibility':'visible', 'top':'50px'}).stop().delay(1300).animate({'opacity':'1', 'top':'0px'}, 200, 'easeOutBack',  function(){ animateContent(); });

};

/*
* Function to animate about page
*/
function animateAbout() {

    // Animate section 0 (if window height is small enough)
    if($(window).height() <= 880){

        $('#img-0').waypoint(function(event, direction) {

           $('#img-0').css({'visibility':'visible', 'top': '500px'}).stop().animate({'opacity':'1', 'top':'0px'}, 1000, 'easeOutExpo');

        }, {
           offset: '80%',
           triggerOnce: true
        });

    }else{

        $('#img-0').css({'visibility':'visible', 'opacity':'1'});
    }

    // Animate Section 1
    $('#img-1').waypoint(function(event, direction) {

        $('#img-1').css({'visibility':'visible', 'right': '50%'}).stop().animate({'opacity':'1', 'right':'0%'}, 1000, 'easeOutExpo');

    }, {
       offset: '80%',
       triggerOnce: true
    });

    // Animate Chart
    $('.bar-chart').waypoint(function(event, direction) {

       $('#aqua').css({'visibility':'visible', 'height': '0%'}).stop().delay(200).animate({'opacity':'1', 'height':'95%'}, 1000, 'easeOutExpo');
       $('#pink').css({'visibility':'visible', 'height': '0%'}).stop().delay(400).animate({'opacity':'1', 'height':'90%'}, 1000, 'easeOutExpo');
       $('#yellow').css({'visibility':'visible', 'height': '0%'}).stop().delay(600).animate({'opacity':'1', 'height':'80%'}, 1000, 'easeOutExpo');
       $('#brown').css({'visibility':'visible', 'height': '0%'}).stop().delay(800).animate({'opacity':'1', 'height':'75%'}, 1000, 'easeOutExpo');
       $('#red').css({'visibility':'visible', 'height': '0%'}).stop().delay(1000).animate({'opacity':'1', 'height':'40%'}, 1000, 'easeOutExpo');

    }, {
       offset: '80%',
       triggerOnce: true
    });

    // Animate Featured in
    $('#img-2').waypoint(function(event, direction) {

        $('#img-2').css({'visibility':'visible', 'left': '50%'}).stop().animate({'opacity':'1', 'left':'0%'}, 1000, 'easeOutExpo');

    }, {
       offset: '80%',
       triggerOnce: true
    });
};

/*
* Function to animate contact page
*/
function animateContact() {

    var navi = $('#navi');

    navi.stop().delay(2000).animate({'opacity':'1'}, 1000, 'easeOutQuad', function(){

        if($(window).width() >= 1140){

            navi.imageLens({ imageSrc: "/img/normal_small.png" });
        }
    });

};

/*
* Function to animate pages (e.g. single-portfolio.php)
*/
function animatePage() {

    $('#text-main').css({'visibility':'visible', 'right':'50%'}).stop().animate({'opacity':'1', 'right':'0%'}, 1000, 'easeOutExpo');
    $('#img-main').css({'visibility':'visible', 'left':'50%'}).stop().delay(100).animate({'opacity':'1', 'left':'0%'}, 1000, 'easeOutExpo', function(){ animateContent(); });

};

/*
* Function to animate leaving a page
*/
$.fn.leavePage = function() {

    this.click(function(event){

        event.preventDefault();
        linkLocation = this.href;

        $('#header').animate({'opacity':'0', 'top':'-92px'}, 500, 'easeOutExpo');
        $('body').fadeOut(500, function(){
            window.location = linkLocation;
        });
    });
};

/*
* Function to print IE page
*/
function ieMessage() {

    // define the HTML of the page
    var page  = "<div id='ie' class='clearfix'>";
    page     += "<section class='main nopad-b'>";
    page     += "<div class='row'>";
    page     += "<div class='col-5'>";
    page     += "<h1>Ummm ...</h1>";
    page     += "<p class='intro'>Well this is awkward. It looks like you're using an old browser.</p>";
    page     += "<p>Old browsers including Internet Explorer 6, 7 and 8 can't handle some of the new stuff I've packed into this website. If you'd like to see the full website you'll need to download one of the nice new browsers below. It will also make your life much easier when browsing the net later on.</p>";
    page     += "<p>";
    page     += "<a href='http://www.google.com/chrome' target='_blank' class='icon-browser chrome'></a>";
    page     += "<a href='http://www.mozilla.org/en-US/firefox/new/' target='_blank' class='icon-browser firefox'></a>";
    page     += "<a href='http://www.apple.com/au/safari/'' target='_blank' class='icon-browser safari'></a>";
    page     += "</p>";
    page     += "</div>";
    page     += "<div class='col-7 last'>";
    page     += "<img class='major' src='http://v2.adhamdannaway.com/wp-content/themes/ad/images/about-adham-dannaway.jpg' alt='adham dannaway ui designer'>";
    page     += "</div>";
    page     += "</div>";
    page     += "</section>";
    page     += "</div>";

    // Print the page
    $('.content').replaceWith(page);

}