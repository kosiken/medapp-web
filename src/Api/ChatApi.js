import io from "socket.io-client";

const Servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.sipnet.net:3478" },
    { urls: "stun:stun.ideasip.com:3478" },
    { urls: "stun:stun.iptel.org:3478" },
    //   { urls: "turn:numb.viagenie.ca", username: "imvasanthv@gmail.com", credential: "d0ntuseme" },
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
  ],
};

class ChatApi {
  constructor(
    user,
    onAddPeer,
    audio = true,
    video = true,
    OnMessage = () => {},
    onAddStream = () => {},
    OnDisconnect= () => {},
    config = {
      addLocalStream: true,
      maxPeers: 2,
      servers: Servers,
    }
  ) {
    if (!user) {
      throw new TypeError("user must be specified");
    }
    this.user = user;
    this.peerCount = 0;
    this.peers = {};
    this.dataChannels = {};
    this.remoteDataChannels = {};
    this.streams = {};
    this.localMediaStream = null;
    this.USE_AUDIO = audio;
    this.USE_VIDEO = video;
    this.OnMessage = OnMessage;
    this.onAddStream = onAddStream;
    this.config = config;
    this.onAddPeer = onAddPeer;
    this.OnDisconnect = OnDisconnect;
  }

  initialize(url) {
    this.sock = io(url);
    if (!window.sId) window.sId = Date.now().toString();
    //alert(window.sId)
    this.sock.on("connect", (config) => this.joinChat(config));
    this.sock.on("addPeer", (config) => this.addPeer(config));
    this.sock.on("data-rec", (config) => this.handleData(config));
    this.sock.on("disconnect", (reason) => this.onDisconnect(reason))
  }

  async addPeer(config) {
    const ChatObject = this;
    const signalingSocket = this.sock;
    let streams = this.streams;
    let peers = this.peers,
      id = config.id || config.peer_id,
      peer_id = id;

    if (peer_id in peers) return;
    const peerConnection = new window.RTCPeerConnection(
      this.config.Servers || Servers
    );
    peers[peer_id] = peerConnection;

    peerConnection.onicecandidate = function (event) {
      ChatObject.onIceCandidate(event, peer_id);
    };

    peerConnection.onaddstream = function (event) {
      // ;
      streams[peer_id] = event.stream;
      ChatObject.onAddStream("remote", event.stream, peer_id);
    };

    peerConnection.ondatachannel = function (event) {
      ChatObject.onDataChannel(event, peer_id);
    };

    if (this.localMediaStream) peerConnection.addStream(this.localMediaStream);

    this.dataChannels[peer_id] =
      peerConnection.createDataChannel("talk__data_channel");




    if (config.createOffer) {
      let localDescription = await peerConnection.createOffer();
      try {
        await peerConnection.setLocalDescription(localDescription);
      } catch (err) {
        alert("Failed to set local description");
      }
      signalingSocket.emit("data-tran-sock", {
        room: "lion",
        peer_id: signalingSocket.id,

        id: peer_id,

        type: "offer",

        data: localDescription,
      });
    }
    console.log(config, peerConnection, this);
    this.onAddPeer(config);
  }

  async joinChat(room) {
    console.log(this);
    if (!this.localMediaStream && this.config.addLocalStream) {
      try {
        this.localMediaStream = await navigator.mediaDevices.getUserMedia({
          audio: this.USE_AUDIO,
          video: this.USE_VIDEO,
        });
      } catch (err) {
        console.log(err);
        return;
      }
      this.onAddStream("local", this.localMediaStream, null);
    }
    this.sock.emit("join", {
      room,
      Name: this.user.FirstName + " " + this.user.LastName,
      Role: this.user.Role,
      id: this.user.id,
    });
  }

  /**
   *
   * @param {RTCDataChannelEvent} event;
   * @param {string} peer_id;
   */

  onDataChannel(event, peer_id) {
    const ChatObject = this;
    console.log("Data Channel", event.channel);

    const channel = event.channel;
    channel.binaryType = "arraybuffer";
    this.remoteDataChannels[peer_id] = channel;
    channel.onopen = function (ev) {
      ChatObject.onRemoteDataChannelOpen(peer_id);
    };
    channel.onmessage = function (event) {
      ChatObject.OnMessage(event.data);
    };

    //(ChatObject.OnMessage)
  }

  onRemoteDataChannelOpen(peer_id) {
    console.log("Data channel: " + peer_id + " is open");
  }

  /**
   *
   * @param {RTCPeerConnectionIceEvent} event
   * @param {string} peer_id
   */
  onIceCandidate(event, peer_id) {
    const signalingSocket = this.sock;
    if (event.candidate) {
      signalingSocket.emit("data-tran-sock", {
        type: "candid",
        room: "lion",
        id: peer_id,
        peer_id: this.sock.id,
        data: {
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        },
      });
    }
  }

  async AddIceCandidate(config) {
    const peer = this.peers[config.peer_id];
    if (!peer) {
      console.log("No peer found with id ", config.peer_id);
    }

    if (config.data) {
      try {
        let iceCandidate = new window.RTCIceCandidate(config.data);
        let _ = await peer.addIceCandidate(iceCandidate);
        console.log(_);
      } catch (err) {
        console.log("Failed to set iceCandidate " + err.message);
        console.log(err);
      }

      return;
    }
    console.log("No data");
    console.log(config);
  }

  async handleAnswer(config) {
    try {
      const peer_id = config.peer_id;
      const peers = this.peers;
      const signalingSocket = this.sock;
      const sessionDescription = config.data;
      const peer = peers[peer_id];
      const desc = new window.RTCSessionDescription(config.data);
      // let ans;
      if (sessionDescription.type === "answer")
       await peer.setRemoteDescription(desc);
      else if (desc.type === "offer") {
         await peer.setRemoteDescription(desc);

        let ld = await peer.createAnswer();

        await peer.setLocalDescription(ld);

        signalingSocket.emit("data-tran-sock", {
          room: "lion",
          peer_id: signalingSocket.id,
          id: peer_id,
          type: "answer",
          data: ld, //

          //	session_description: localDescription,
        });
      }
    } catch (err) {
      console.log("Error occured " + err.message);
      console.log(err);
    }
  }

  async handleData(config) {
    const { type } = config;

    switch (type) {
      case "candid":
        await this.AddIceCandidate(config);

        break;
      case "offer":
        await this.handleAnswer(config);
        break;

      case "answer":
        await this.handleAnswer(config);
        break;

      case "message":
        this.OnMessage(config.data);

        break;

      default:
        alert(type);
        break;
    }
  }

  message(peer_id, message) {
    /**
     *
     */
    let dataChannel = this.dataChannels[peer_id];
    try {
      dataChannel.send(message);
    } catch (err) {
      this.sock.emit("data-tran-sock", {
        room: "lion",
        peer_id: this.sock.id,
        id: peer_id,
        type: "message",
        data: message,
      });
    }
  }

  onDisconnect(reason) {
    console.log(reason);
    for (let peer_id in this.peers) {
      this.peers[peer_id].close();
    }
    this.peers = {}
    this.OnDisconnect()
  }
}

export default ChatApi;
