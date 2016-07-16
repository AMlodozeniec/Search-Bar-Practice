var ref;
var index;
var http;
var store = {};

function initializeFirebase(){
	var config = {
	    apiKey: "AIzaSyD-Uiql_l72ItuA3St_euvZz8jWHEvhBDU",
	    authDomain: "crackling-heat-1887.firebaseapp.com",
	    databaseURL: "https://crackling-heat-1887.firebaseio.com",
	    storageBucket: "",
	 };
	 firebase.initializeApp(config);
}

function active(){
	var searchBar = document.getElementById("searchBar");

	if(searchBar.value == "Search..."){
		searchBar.value = "";
		searchBar.placeholder = "Search..."
	}
}


function inactive(){
	var searchBar = document.getElementById("searchBar");

	if(searchBar.value == "Search..."){
		searchBar.value = "Search...";
		searchBar.placeholder = "";
	}
}

function setup(){
	initializeFirebase();
	var database = firebase.database();
	var featuredRef = database.ref("Featured/");
	var featured_ul = document.getElementById("featured_links");
	//setupIndex(featuredRef, featured_ul);
}

function createServer(){
	http.createServer(function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query.q;
        console.log("search query: "+query)
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(index.search(query)));
    }).listen(1337, '127.0.0.1');
}

function setupIndex(ref, ul){
//	index = lunr(function (){
//		this.field('tag', 100);
//        this.field('priority', 1);
//		this.ref('url');
//        
//        //This is the id
//        this.ref('href');
//	});

	var post;

	ref.on("child_added", function(snapshot){
		var doc = {
			'tag': snapshot.val().tag,
			'url': snapshot.val().url,
            'priority': snapshot.val().priority
		};
//		index.add(doc);
        store[doc.url] = {priority: doc.priority, url: doc.url, tag: doc.tag};
        console.log(doc.url + " added to index");
	});

	//console.log("lunr is setup");
}

function search(){
//	for(post in store){
//        console.log(store[post].url + " is the url");
//		console.log(store[post].tag + " is the tag");
//        console.log(store[post].priority);
//	}
	var inputHandle = document.getElementById("searchBar");
	var tag = inputHandle.value;
    for(post in store){
        if(store[post].tag.indexOf(tag) > -1){
            displayElement(store, post);
            console.log(store[post].url + " is the url");
        }
        else{
            console.log("not found");
        }
    }
//	index.search(tag);
//	console.log(index.search(tag));
//	// console.log(inputHandle);

}

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
    li.appendChild(p);
	ul.appendChild(li);
}

