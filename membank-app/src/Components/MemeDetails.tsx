import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentMeme: any
}

interface IState {
    open: boolean
}

const URI_API = "https://memestorageapi.azurewebsites.net/api/MemeItem/"
// const URI_API = "http://phase2apitest.azurewebsites.net/api/meme/"

export default class MemeDetails extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }
        //
        this.updateMeme = this.updateMeme.bind(this)
    }

	public render() {
        const currentMeme = this.props.currentMeme
        const { open } = this.state;
		return (
			<div className="container meme-wrapper">
                <div className="row meme-heading">
                    <b>{currentMeme.title}</b>&nbsp; ({currentMeme.tags})
                </div>
                <div className="row meme-date">
                    {currentMeme.uploaded}
                </div>
                <div className="row meme-img">
                    <img src={currentMeme.url}/>
                </div>
                
                <div className="row meme-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadMeme.bind(this, currentMeme.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteMeme.bind(this, currentMeme.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Meme Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any meme later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateMeme}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };
    
    // private methodNotImplemented() {
	// 	alert("Method not implemented")
	// }

    // Open meme image in new tab
    private downloadMeme(url: any) {
        window.open(url);
    }

    // Updates meme details
    private updateMeme(){
        const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement

        if(titleInput === null || tagInput === null){
            return;
        }

        const currentMeme = this.props.currentMeme
        // const url = URI_API + currentMeme.id
        const url = URI_API + currentMeme.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        console.log("L93 MemeDetails updatedTitle = ", updatedTitle);
        console.log("L94 MemeDetails updatedTag = ", updatedTag);
        
        fetch(url, {
            body: JSON.stringify({
                "height": currentMeme.height,
                "id": currentMeme.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentMeme.uploaded,
                "url": currentMeme.url,
                "width": currentMeme.width
            }),
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            method: 'PUT'
        })
        .then((response: any) => {
            if(!response.ok){
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }// updateMeme

    private deleteMeme(id: any) {
        // const url = URI_API + id
        const url = URI_API + id

        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
}