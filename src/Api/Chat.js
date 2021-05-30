import io from "socket.io-client";

const url = "http://127.0.0.1:8000";

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

class Chat {
  constructor(user, audio = true, video = true) {
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
  }

  initialize(url) {
    this.sock = io(url);
  }

  async addPeer(config) {
    const ChatObject = this;
    const signalingSocket = this.sock;
    let streams = this.streams;
    let peers = this.peers,
      id = config.id || config.peer_id,
      peer_id = id;

    if (peer_id in peers) return;
    const peerConnection = new window.RTCPeerConnection(Servers);
    peers[peer_id] = peerConnection;

    peerConnection.onicecandidate = function (event) {
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
    };

    peerConnection.onaddstream = function (event) {
      // ;
      streams[peer_id] = event.stream;
    };

    peerConnection.ondatachannel = function (event) {
      ChatObject.onDataChannel(event, peer_id);
    };

    peerConnection.addStream(this.localMediaStream);

    this.dataChannels[peer_id] = peerConnection.createDataChannel("talk__data_channel");
    
  }

  async joinChat(room) {
    if (!this.localMediaStream) {
      this.localMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: this.USE_AUDIO,
        video: this.USE_VIDEO,
      });
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

    const channel = event.channel;
    channel.binaryType = "arraybuffer";
    this.remoteDataChannels[peer_id] = channel;
    channel.onopen = function (ev) {
        ChatObject.onRemoteDataChannelOpen(peer_id)
    };
  }

  onRemoteDataChannelOpen(peer_id) {
      console.log("Data channel: " + peer_id + " is open")
  }
}
