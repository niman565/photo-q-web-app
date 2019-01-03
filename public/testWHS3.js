// Called when the user pushes the "submit" button
photos = [];
selectedTags = [];
useSelectedTags = false;

function photoByNumber() {
    console.log("Inside photoByNumber() function!");
    function makeResponse(){
        var oReq = new XMLHttpRequest();
        var urlMake = makeUrl();
        oReq.open("GET",urlMake);
        oReq.addEventListener("load",reqListener);
        oReq.send();

        function reqListener(){
            var jsonstr = this.responseText;
            var jsonobj = JSON.parse(jsonstr);
            const photoServer = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/";

            photos = jsonobj.objects;
            photos.map(function (obj) { obj.src = photoServer+obj.fileName; });
            const reactContainer = document.getElementById("react");

            ReactDOM.render(React.createElement(App),reactContainer);
        }

        function makeUrl(){
            var urlM = "query?keyList=";

            for(var i = 0; i < numArray.length; i++){
                if(i == 0){
                    urlM += numArray[i];
                }
                else{
                    urlM += "+" + numArray[i];
                }
            }
            return urlM;
        }
    }

	var numInput = document.getElementById("num").value;
    var num = numInput.replace(/\s/g, "");
    var numArray = [];
    if (useSelectedTags) {
      numArray = selectedTags;
      console.log("numArray (cond 1): " + numArray);
      useSelectedTags = false;
    }
    else {
      numArray = num.split(',');
      console.log("numArray (cond 2): " + numArray);
    }

    makeResponse();
    selectedTags = [];
    itemsInBar = 0;
    itemsCount = 0;
}

function removeDropdown() {
  console.log("Inside removeDropdown() function!");
  itemCount = 0;
  if (document.getElementById("topmostRow")) {
    var saveBar = document.getElementById("topmostRow").cloneNode(true);
    saveBar.id = "notTheSuggestionsBar";

    document.getElementById("main").insertBefore(saveBar, document.getElementById("main").childNodes[0]);
    document.getElementById("topmostRow").remove();
    var x = document.getElementById("suggestText")
    if (x)
    {
      x.remove();
    }
  }
  var huge_list = document.getElementById('huge_list');
  while(huge_list.hasChildNodes()) {
      huge_list.removeChild(huge_list.lastChild);
  }
}

function checkTagsBar() {
  console.log("Inside checkTagsBar() function!");
  if (selectedTags.length > 0) {
    useSelectedTags = true;
  }
}

function removeOnClick(button) {
    var name = button.id;
    name = name.replace("button", "");
    var i = selectedTags.indexOf(name);
    if (i !== 1) selectedTags.splice(i, 1);

    button.parentNode.remove();
}

function arrowOnClick (button) {
  console.log("Inside arrowOnClick() function!");
   selectedTags.push(button.id);
    if (itemsInBar == 0) {
      console.log("inside itemsInBar == 0 cond.");
      var tagsSoFar = document.createElement("div");  // overall container
      tagsSoFar.id = "topmostRow";
      tagsSoFar.className = "topRowClass";

      var t = document.createElement('div');  // outer d    huge_list.appendChild(t);iv
      t.className = "optionClass";
      t.id = button.id + "Search";

      var tag = document.createElement("div");
      tag.textContent = button.id;
      tag.className = "optionClassTag";


      var closeButtonSearch = document.createElement("button");
      closeButtonSearch.className = "optionClassArrowButton";
      closeButtonSearch.textContent = "X";
      closeButtonSearch.id = button.id + "button";
      closeButtonSearch.setAttribute("onClick", "removeOnClick(this)");
      tag.appendChild(closeButtonSearch);

      t.appendChild(tag);
      tagsSoFar.appendChild(t);
/*
      var tag = document.createElement("div");
      tag.textContent = button.id;
      tag.className = "optionClassTag";
      tagsSoFar.appendChild(tag);
*/

      var huge_list = document.getElementById('huge_list');
      if (huge_list.hasChildNodes()) {
        huge_list.insertBefore(tagsSoFar, huge_list.childNodes[0]);
      }
      else
      {
        huge_list.appendChild(tagsSoFar);
      }
      console.log("exiting itemsInBar == 0 cond.");
    }
    else if (itemsInBar > 0 && document.getElementById("topmostRow")) {
        console.log("inside the other cond.");
        var tagsSoFar = document.getElementById("topmostRow");
        var t = document.createElement('div');  // outer d    huge_list.appendChild(t);iv
        t.className = "optionClass";
        t.id = button.id + "Search";

        var tag = document.createElement("div");
        tag.textContent = button.id;
        tag.className = "optionClassTag";


        var closeButtonSearch = document.createElement("button");
        closeButtonSearch.className = "optionClassArrowButton";
        closeButtonSearch.textContent = "X";
        closeButtonSearch.id = button.id + "button";
        closeButtonSearch.setAttribute("onClick", "removeOnClick(this)");
        tag.appendChild(closeButtonSearch);

        t.appendChild(tag);
        tagsSoFar.appendChild(t);
        console.log("exiting other cond.")
    }

    itemsInBar++;
}


class Tag extends React.Component {

    constructor (props) {
	super(props);
	this.state = {color: "#6ae"};
	this.changeColor = this.changeColor.bind(this);
    }

    changeColor (e) {
	e.stopPropagation(); // don't call ancestor onClicks
	if (this.state.color == "#6ae") {
	    this.setState({color: "#6ea"});
	} else {
	    this.setState({color: "#6ae"});
	}
    }


    render () {
	return React.createElement('p',  // type
				   { className: 'tagText', style: {backgroundColor: this.state.color}, onClick: this.changeColor }, // properties
	   this.props.text);  // contents
    }
};


// A react component for controls on an image tile
class TileControl extends React.Component {

    render () {
	// remember input vars in closure
        var _selected = this.props.selected;
        var _src = this.props.src;
        // parse image src for photo name
	var photoName = _src.split("/").pop();
	photoName = photoName.split('%20').join(' ');

        return ( React.createElement('div',
 	 {className: _selected ? 'selectedControls' : 'normalControls'},
         // div contents - so far only one tag
              React.createElement(Tag,
				  { text: photoName, onClick: this.turnGreen })
				    )// createElement div
	)// return
    } // render
};


// A react component for an image tile
class ImageTile extends React.Component {

    constructor(props) {
	    super(props);
	    this.state = { selected: this.props.photo.selected };
	this.toggle = this.toggle.bind(this);
	console.log("ImageTile constructor");
    }

    toggle(e) {
	var opposite = !this.state.selected;
	this.setState( { selected: opposite } );
    }


    render() {
	var _photo = this.props.photo;
	var _selected = _photo.selected; // this one is just for readability

	return (
	    React.createElement('div',
	        {style: {margin: this.props.margin, width: _photo.width},
		 className: 'tile',
		 onClick: this.toggle },

		 // contents of div - the Controls and an Image
		React.createElement(TileControl,
		    {selected: this.state.selected,
		     src: _photo.src}),
		React.createElement('img',
		    {className: this.state.selected ? 'selected' : 'normal',
                     src: _photo.src,
		     width: _photo.width,
                     height: _photo.height
			    })
		)//createElement div
	); // return
    } // render
} // class



// The react component for the whole image gallery
// Most of the code for this is in the included library
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { photos: photos };
  }


  render() {
    return (
       React.createElement( Gallery, {photos: photos,
		   ImageComponent: ImageTile} )
	    );
  }

}

/* Finally, we actually run some code */

//const reactContainer = document.getElementById("react");

//ReactDOM.render(React.createElement(App),reactContainer);
