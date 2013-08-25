
// <!-- Author Jenlyn S. Labrador 
// 	 August 18, 2013
// 	 Advanced Web Computing
// 	 Module 7 - JQuery & AJAX-->


var apikey = "8xqmw9tqaxj2bzvgm7xvm7hb";
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";	
var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;
var movies;


$(document).ready(function() {		
	

		$.mobile.defaultPageTransition = 'none';
		
		$("#notfound").hide();
		$("#showAll").hide();
		$("#loader").hide();
		
		$("#search-basic").click(function() {
			$(this).val('');
		});
		
		$("#showAll").click(function() {
			showMore();
		});
		
	});


function movieSearch() {
	

	$("#results").empty();
	$("#showAll").hide();
	$("#notfound").hide();
	$("#loader").show();

	var query = $("input:first").val();
	
	$.ajax({
	    url: moviesSearchUrl + '&q=' + encodeURI(query) + '&page_limit=50',
	    dataType: "jsonp",
	    success: searchCallback
	});
	
}


function movieDetailSearch(id) {
	
	$("#postercell").empty();
	$("#infocell").empty();
	$("#back-button").hide();
	$("#detailpanel").hide();
	$("#detail-loader").show();
	
	$.ajax({
	    url: baseUrl + '/movies/' + id + '.json?apikey=' + apikey,
	    dataType: "jsonp",
	    success: detailCallback
	});
	
}

function searchCallback(data) {
	
	if (data.total == 0){
		$("#loader").hide();
		$("#notfound").show();
	}else{	
		
		$("#loader").hide();
		
		movies = data.movies;
		$.each(movies, function(index, movie) {
			
			var detailid = movie.id;
			
 			var posterimg = movie.posters.thumbnail;
			if(movie.posters.thumbnail.indexOf("poster_default.gif") != -1){
				posterimg = "img/notfound.png";
			}
			

			var year = movie.year;
			if (year != ""){year = '(' + movie.year + ')';}
			

			$("#results").append('<li><a onclick="javascript:setItem('+ detailid +');" href="#">'+
					'<img src="' + posterimg + '"/>' + 
					'<h3>' + movie.title + '</h3><p><strong>' + year + '</strong></p></a></li>');
			

			return (index != 2);
			
		});
		

		$("#results").listview("refresh");
		
		if (data.total > 3){ 
			$("#showAll").show();
		}	
	}

}

function detailCallback(data) {
			
	var posterimg = data.posters.profile;
	if(data.posters.profile.indexOf("poster_default.gif") != -1){
		posterimg = "img/notfound.png";
	}
	
	var imgmovie = data.posters.detailed;
	if(data.posters.detailed.indexOf("poster_default.gif") != -1){
		imgmovie = "img/notfound.png";
	}
	
	var year = data.year;
	if (year != ""){year = '(' + data.year + ')';}		
	
	$("#detail-loader").hide();
	
	$("#detailpanel").show();
	$("#back-button").show();
	
	$("#postercell").append('<img id="ipad" src="' + imgmovie + '"/>');
	$("#postercell").append('<img id= "mob" src="' + posterimg + '"/>');
	$("#infocell").append('<h2>'+ data.title +' ' + year + '</h2><p id="genre">'+ data.genres[0] + '</p>');
	$("#infocell").append('<p id="dir">Director: '+ data.abridged_directors[0].name +'</p>');
	$("#infocell").append('<p id="cast"> Casts: '+ data.abridged_cast[0].name + ', ' + data.abridged_cast[1].name+ ', ' + data.abridged_cast[2].name + ', ' + data.abridged_cast[3].name+ ' , ' + data.abridged_cast[4].name + '</p>');
	$("#infocell").append('<p id="runtime"> Runtime: ' + data.runtime +  " minutes" + '</p>');

    //synopsis available
    if (data.synopsis == "") {
    	$("#infocell").append('<p id="synopsis">' + data.synopsis + '</p>');
    } else {
    	$("#infocell").append('<p id="synopsis"> Synopsis: ' + data.synopsis + '</p>');
    }

	//font colour by score
	if(data.ratings.audience_score < 50){
		
		$("#ratingcell").append('<h2 class="failed">'+ data.ratings.audience_score +'%</h2><p id="rating-subtitle">(audience score)</p>');
		
	}else{
		
		$("#ratingcell").append('<h2 class="passed">'+ data.ratings.audience_score +'%</h2><p id="rating-subtitle">(audience score)</p>');
		
	}
}

function showMore() {
	
	$("#showAll").hide();
	
	$.each(movies, function(index, movie) {
		if(index < 3){return true;}
		
		var detailid = movie.id;
		
		var posterimg = movie.posters.thumbnail;
		if(movie.posters.thumbnail.indexOf("poster_default.gif") != -1){
			posterimg = "img/notfound.png";
		}
		
		var year = movie.year;
		if (year != ""){year = '(' + movie.year + ')';}
		
		$("#results").append('<li><a onclick="javascript:setItem('+ detailid +');" href="#">'+
				'<img src="' + posterimg + '"/>' + 
				'<h3>' + movie.title + '</h3><p><strong>' + year + '</strong></p></a></li>');
	});
	
	$("#results").listview("refresh");
	
}


function setItem(id) {
	
	sessionStorage.setItem('id',id);
	document.location.href='#detail'; 
	
}

$('div:jqmData(role="page"):last').live('pagebeforeshow',function(){
    
	movieDetailSearch(sessionStorage.getItem('id'));

});