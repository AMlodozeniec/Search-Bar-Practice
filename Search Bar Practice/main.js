/*
    To test this out for your own Firebase and html site, change the following
    1. The various apiKeys, authDomain, databaseURL inside 'function initializeFirebase()'
    2. Replace "searchBar" in functions 'active()' and 'inactive()', with your own 
    html element id for searchBar. Same with all 'document.getELementById(YOUR_ID_HERE)' 
    lines
    3. Replace your database reference with your proper Parent node name 
    inside 'function setup()'
    4. Inside function 'setupIndex()', change the doc key values to your 
    child node's value. Same with inside function 'displayElement()'
*/

var ref;
var http;
var store = {};

/* Initialize Firebase */
function initializeFirebase(){
	var config = {
	    apiKey: "AIzaSyD-Uiql_l72ItuA3St_euvZz8jWHEvhBDU",
	    authDomain: "crackling-heat-1887.firebaseapp.com",
	    databaseURL: "https://crackling-heat-1887.firebaseio.com",
	    storageBucket: "",
	 };
	 firebase.initializeApp(config);
}

/* Is called when user clicks on searchbar. 
Makes searchbar get rid of value of "Search..." */
function active(){
	var searchBar = document.getElementById("searchBar");

	if(searchBar.value == "Search..."){
		searchBar.value = "";
		searchBar.placeholder = "Search..."
	}
}

/* Is called when searchbar is not clicked or has been clicked and clicked off (ie, "lost focus").
Has value of "Search..." inside searchBar when page is loaded */
function inactive(){
	var searchBar = document.getElementById("searchBar");

	if(searchBar.value == "Search..."){
		searchBar.value = "Search...";
		searchBar.placeholder = "";
	}
}

/* To be loaded and completed when page is loaded; Sets up Firebase and
allows users to search for posts */
function setup(){
	initializeFirebase();
	var database = firebase.database();
	var featuredRef = database.ref("Featured/");
	setupIndex(featuredRef);
}

/* Takes in the corresponding reference of posts, goes through each initial
child inside the reference and whenever one is added, creates a copy of the JSON object, and stores it inside a global dictionary 'store' */
function setupIndex(ref){
    
//Old lunr stuff that didn't make sense
//	index = lunr(function (){
//		this.field('tag', 100);
//        this.field('priority', 1);
//		this.ref('url');
//        
//        //This is the id
//        this.ref('href');
//	});

    
	ref.on("child_added", function(snapshot){
		var doc = {
			'tag': snapshot.val().tag,
			'url': snapshot.val().url,
            'priority': snapshot.val().priority
		};
        store[doc.url] = {priority: doc.priority, url: doc.url, tag: doc.tag};
        console.log(doc.url + " added to index");
	});
}

/* Is called when the user clicks the 'Go' button. Will take the value
inside the searchBar, and check the dictionary index for the tag.
If the typedValue is contained inside the post's tag node, it will 
display it. Otherwise, it'll return a "not found" message and continue */
function search(){
	var inputHandle = document.getElementById("searchBar");
	var typedValue = inputHandle.value;
    for(post in store){
        if(store[post].tag.indexOf(typedValue) > -1){
            displayElement(store, post);
            console.log(store[post].url + " is the url");
        }
        else{
            console.log("not found");
        }
    }
}

/* Takes in the dictionary elements, and creates the subsequent
elements, in order to add the images to the existing page's 
links page */
function displayElement(store, post){
    var ul = document.getElementById("featured_links");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var img = document.createElement("img");
    var p = document.createElement("p");
    
	a.setAttribute("href", store[post].url); //Makes picture clickable to link that 'links' is
	img.setAttribute("src" , store[post].url);
	img.setAttribute("id", "item");
    p.innerHTML = "Tags: " + store[post].tag;
    p.setAttribute("id", "description");      
    
	a.appendChild(img);
	li.appendChild(a);
    li.appendChild(p); //Makes the p element under the image
	ul.appendChild(li);
}

