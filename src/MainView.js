/* eslint-disable */

import React,{useState, useEffect} from "react"
import io from "socket.io-client"
//import "./App.css";
import { makeStyles } from '@material-ui/core/styles';
 
import Chip from '@material-ui/core/Chip';


let prod = true;

const useStyles = makeStyles((theme) => (


{
message: {
borderRaduis: theme.spacing(1),
backgroundColor: "#f8f8f8",
display:"inline-block"

},
textArea:

{
position:"absolute",
width:"100%",
bottom: 0,
left:0
},

root:{
width:"100vw"
,height:"100vh"
,

overflow:"hidden",

maxHeight:"100vh"



},
messageBox:{
width:"100%",
maxHeight:"70vh",
height:"70%",
overflowY:"scroll"



},
typingArea:{
border:"none",
width:"100%",
backgroundColor:"beige",
"& :focus":{

shadow:"none",
border:"none"
},
"&:hover":{
border: "none"

}
},
input:{
border:"none",
shadow:"none"
,
"& :focus":{

shadow:"none",
border:"none"
}


}

}


)

)



const MainView = ({user}) => {
const USE_AUDIO = true;
const USE_VIDEO = true;


const servers ={
iceServers: 
[
	{ urls: "stun:stun.l.google.com:19302" },
	{ urls: "stun:stun.stunprotocol.org:3478" },
	{ urls: "stun:stun.sipnet.net:3478" },
	{ urls: "stun:stun.ideasip.com:3478" },
	{ urls: "stun:stun.iptel.org:3478" },
	{ urls: "turn:numb.viagenie.ca", username: "imvasanthv@gmail.com", credential: "d0ntuseme" },
	{
		urls: [
			"turn:173.194.72.127:19305?transport=udp",
			"turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
			"turn:173.194.72.127:443?transport=tcp",
			"turn:[2404:6800:4008:C01::7F]:443?transport=tcp",
		],
		username: "CKjCuLwFEgahxNRjuTAYzc/s6OMT",
		credential: "u1SQDR/SQsPQIxXNWQT7czc/G4c=",
	},
]



};
const classes=useStyles();
                
                     
                                                                              
const [sock, setSock] = useState(io(prod ? "https://kosy.herokuapp.com": "http://192.168.43.1:8000"));



const ref = React.useRef(null)
const [message,setMessage] = useState("Unavailable");
const [connected, setConnected] = useState(true);
const [count, setCount] = useState(0);
const [view, sV] = useState("video")
const [text, setText] = useState("");
const [messages,setMessages] = useState([]);
const [messageObj,setMessageObj] = useState({user:null, userId:null, message:""});
const [myPeers, setPeers] = useState([]);
const remoteRef = React.useRef(null);



useEffect(()=>
{


if(messageObj.userId) setMessages(messages.concat([messageObj]));
},[messageObj])


const RenderMessages =()=>{

return messages.map((m,id)=> (<Message key={"message"+id} {...m} className={classes.message} />


)
)
}

useEffect(()=>{
if(!window.connections) window.connections = {count:0,peers:{}, dataChannels:{},streams:{}}

if(!window.sId) window.sId = Date.now().toString()
//alert(window.sId)
sock.on("connect",JoinChat);
sock.on("addPeer", AddPeer)
sock.on("data-rec", HandleData);


},[])


const AddPeer= (config)=>{




const {peers} = window.connections
const id = config.id || config.peer_id
const peer_id = id
if(peer_id in peers) return;
const peerConnection = new window.RTCPeerConnection(servers		);

window.connections.peers[peer_id] = peerConnection;

setText(JSON.stringify({s: window.connections.peers, peerConnection}))



peerConnection.onicecandidate = function(event){

if (event.candidate) {
let e = event;
const signalingSocket = sock



				signalingSocket.emit("data-tran-sock", {
type:"candid",room:"lion",
id:peer_id,		peer_id: sock.id,					data: {
	
	sdpMLineIndex: event.candidate.sdpMLineIndex,
						candidate: event.candidate.candidate,
}



				});
			}

}


peerConnection.onaddstream = function(event) {
                                                    // ;
			window.connections.streams[peer_id] = ( event.stream)		
                                      

//setPeers(Object.keys(window.connections.streams))
remoteRef.current.srcObject= event.stream
}

peerConnection.ondatachannel = onDataChannel

peerConnection.addStream(window.localMediaStream);

window.connections.dataChannels[peer_id] = peerConnection.createDataChannel("talk__data_channel");




if(config.createOffer)

{
//window.connections.dataChannels[peer_id] = peerConnection.createDataChannel("talk__data_channel");


const signalingSocket = sock;

peerConnection.createOffer(
				(localDescription) => {
					peerConnection.setLocalDescription(
						localDescription,
						() => {
							signalingSocket.emit("data-tran-sock",{

	room:"lion",peer_id: sock.id,

id:peer_id,

			type:"offer",

data: localDescription,
							});
						},
						() => alert("Offer setLocalDescription failed!")
					);
				},
				(error) => console.log("Error sending offer: ", error)
			);

}
setMessage(JSON.stringify(config))

}



const onDataChannel = event => {

const channel = event.channel;
channel.binaryType = "arraybuffer";
channel.addEventListener("message", onRemoteMessage);


}
const onRemoteMessage = (m) => {
try {
const mess = JSON.parse(m.data)
setMessageObj(mess);

}catch(err) {


alert(err.message)

}


}
const JoinChat= async ()=>{




if(!window.localMediaStream) {
              
try {
const stream = await  navigator.mediaDevices
		.getUserMedia({ audio: USE_AUDIO, video: USE_VIDEO })
       
ref.current.controls = false;
ref.current.srcObject = stream;
window.localMediaStream= stream;

}
catch(err){
alert(err.message)

}
}
sock.emit("join",{room:"lion"})


}

const AddIceCandidate = async config =>

{

const peer = window.connections.peers[config.peer_id]

if(peer) {
let ans = config

if (ans.data) {
try{
	
	
	let ice = new window.RTCIceCandidate(ans.data)

let b = await peer.addIceCandidate(ice);
	

return JSON.stringify(b) + "done ice"

}catch(err){

return "error "+ err.message;
}

}
return "no ice"

}

else return "No peer"


}


const HandleAnswer = async config => {
try{



const peer_id = config.peer_id;
const {peers} = window.connections;
const signalingSocket= sock;
const sessionDescription = config.data
		const peer = peers[peer_id];




//setMessage(JSON.stringify({peer,config,...window.connections}))
//if(!peer) alert("error")
// (!peer) return
//asetMessage("olay")
const desc = new window.RTCSessionDescription(config.data)

//setMessage(JSON.stringify(desc))



if(sessionDescription.type == "offer"){

try{
let ans = await peer.setRemoteDescription(desc);
}

catch(err)
{


alert("here#$")
setMessage("error 999"+ err.message)


}
//setMessage("offer")

let ld = await peer.createAnswer();
await (peer.setLocalDescription(ld));

signalingSocket.emit("data-tran-sock",
{
room:"lion", peer_id: sock.id, 
id:peer_id
,type: "answer", data: ld,									//

//	session_description: localDescription,
									});

}
else if(sessionDescription.type =="answer") {
let ans = await peer.setRemoteDescription(desc);
setMessage("Ans")
}
//let ans = await peer.setRemoteDescription(desc);

}
catch(err){
alert(err.message)
}
	
	

}
const HandleData = (config)=>
//alert("here");

{


//setMessage(config.type)

//alert("here")
const {peer_id, type} = config;
switch(type)

{

case "candid":

   AddIceCandidate(config).then(setText);
break;
case "offer":
//setMessage("typeoo");
HandleAnswer(config).then(setText);

break;

case "answer":
HandleAnswer(config).then(setText);
break;
default:
alert(type)
break;


}



}

const sendMessage = (event) => {
//ear()
let m= event

if(m==='') return;



let userId= sock.id;

setMessageObj({
message:m,

user,
userId
})
const {dataChannels} = window.connections
if(dataChannels){
for(let id in dataChannels){
try{


dataChannels[id].send(JSON.stringify({
message:m,

user,
userId
})
)}

catch(err)

{
setText(err.message)
}




}

//ref.current.value = ""
}
}

const selectPeer = peer_id => {


}
const RenderPeers = ()=>
                     
{
return myPeers.map((p, id) => (
     <Chip label={p}  key={"peer"+id} onClick={()=>


{
selectPeer(p)

}
}
/>
))
}


 return (


  <div className={classes.root}>
 
</div>  



);
}

export default MainView
