import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import MemeDetails from './Components/MemeDetails';
import MemeList from './Components/MemeList';
import MyAvatar from './my-avatar.jpg';


interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
}

const URI_API = "https://memestorageapi.azurewebsites.net"
// const URI_API = "http://phase2apitest.azurewebsites.net"

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			memes: [],
			open: false,
			uploadFileList: null
		}     	
    this.selectNewMeme = this.selectNewMeme.bind(this)
    //
    this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")	
		//
		this.handleFileUpload = this.handleFileUpload.bind(this)
		//
		this.uploadMeme = this.uploadMeme.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header nav navbar">
					<img src={MyAvatar} height='40'/>&nbsp; My Meme Bank - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Meme</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<MemeDetails currentMeme={this.state.currentMeme} />
					</div>
					<div className="col-5">
						<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Meme Title</label>
						<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">You can edit any meme later</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used for search</small>
					</div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// private methodNotImplemented() {
	// 	alert("Method not implemented")
	// }

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	};
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
    }
  
    private fetchMemes(tag: any){
		// let url = URI_API + "/api/meme"
		let url = URI_API + "/api/MemeItem"
		
		if(tag !== ""){
		url += "/tag?=" + tag
		}
		console.log("L101 App.tsx url = " + url)
		fetch(url, {method: 'GET'})
		.then(res => res.json())
		.then(json => {
			let currentMeme = json[0]
			// console.log("L106 App.tsx json = " + JSON.stringify(json))
			if(currentMeme === undefined){
				currentMeme = {
				"height":"0",
				"id": 0, 
				"tags":"try a different tag",
				"title":"No memes (╯°□°）╯︵ ┻━┻",
				"uploaded":"",
				"url":"",
				"width":"0"
				}
			}
			this.setState({
				currentMeme,
				memes: json // was memes: json gave me an error.
			})
		})
	}// fetchMemes()
	
// Gets file from form input
	private handleFileUpload(fileList: any){
		console.log("L131 App.handleFileUpload = ", fileList.target.files)
		this.setState({
			uploadFileList: fileList.target.files
		})
	}// handleFileUpload()

// Uploads file to URI
	private uploadMeme(){
		console.log("L139 App.this.state.uploadFileList = ", this.state.uploadFileList)
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if(titleInput === null || tagInput === null || imageFile === null){
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		// const url = URI_API + "/api/meme/upload"
		const url = URI_API + "/api/MemeItem"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control':'no-cache'},
			method: 'POST'
		})
		.then((response: any) => {
			if(!response.ok){
				// Rise an error
				alert(response.statusText)
			}else{
				location.reload()
			}
		})


	}// uploadMeme
}

export default App;