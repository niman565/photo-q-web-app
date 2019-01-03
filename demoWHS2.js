

// Called when the user pushes the "submit" button 
function photoList () {

	var numList = document.getElementById("num").value;
	numList = numList.trim();
	if (numList != "") {
	    var oReq = new XMLHttpRequest();
	    var url = "query?numList="+numList;
	    oReq.open("GET", url);
	    oReq.addEventListener("load", gotJSONNowWhat);
	    oReq.send();

	    // pick up oReq in closure
	    function gotJSONNowWhat() {
		showPhotos(oReq);
	    }
	} 
}



function showPhotos(oReq) {
    const photoServer = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/";
	  
    if (oReq.status != 200) {
	tellUserError();
    } else {
	// set global photos variable
	photos = JSON.parse(oReq.responseText);
	// set src property of all elements, since that is what gallery expects
	photos.map(function (obj) { obj.src = photoServer+obj.fileName; });

	// render the photo gallery onto the page
	const reactContainer = document.getElementById("react");
	ReactDOM.render(React.createElement(App),reactContainer);
    }
}

function tellUserError() {
    inputBar = document.getElementById("num");
    inputBar.value = "";
    inputBar.placeholder = "Bad request try again";
}



// A react component for a tag
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


