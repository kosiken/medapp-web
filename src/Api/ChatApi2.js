import { connect, createLocalTracks } from "twilio-video";
import axios from "axios" 


class ChatApi2{
    constructor(user, config={
        onParticipantAdded: ()=> {},
        onMediaLoaded: () => {}
        

    }) {
        this.user = user;
        this.onParticipantAdded = config.onParticipantAdded;
        this.onMediaLoaded = config.onMediaLoaded

    }

    async initialize(url) {

     let response = await axios.get(url+ "/create-token/" + this.user.room + "/" + this.user.name)

      response = response.data
      const _token = response.token
        const tracks = await createLocalTracks({
            audio: true,
            video: true
          });


          tracks.forEach(publication => {
            
        
                
        let node = (publication.attach());
        node.style.width = "120px";
        node.style.height = "200px";
        node.style.position = "absolute";
        node.style.left = "0";
        node.style.top = "0";

        document.getElementById("media-div").appendChild(node)

    
          })



          const room = await connect(_token, {
            name: 'lion',
            tracks
          })

          
console.log(room.participants)

        room.participants.forEach(participant => {
            this.onParticipantAdded(participant.identity)
            participant.tracks.forEach(publication => {
              if (publication.track) {
                let node = (publication.attach());
                node.style.width = "100%";
                node.style.height = "100%";
                
                document.getElementById("media-div").appendChild(node);
                this.onMediaLoaded()
               // document.getElementById('remote-media-div').appendChild(publication.track.attach());
              }
            });
          
           participant.on('trackSubscribed', track => {
            let node = (track.attach());
            node.style.width = "100%";
            node.style.height = "100%";
            
            document.getElementById("media-div").appendChild(node)
            this.onMediaLoaded()
           // document.getElementById('re
  //       document.getElementById('remote-media-div').appendChild(track.attach());
            });
          });


          room.on('participantConnected', participant => {
            console.log(`Participant "${participant.identity}" connected`);
            this.onParticipantAdded(participant.identity);
          
            participant.tracks.forEach(publication => {
              if (publication.isSubscribed) {
                const track = publication.track;
                let node = (track.attach());
                node.style.width = "100%";
                node.style.height = "100%";
                
                document.getElementById("media-div").appendChild(node)
                this.onMediaLoaded()
               // document.getElementById('re



            }
            });
          
            participant.on('trackSubscribed', track => {
                let node = (track.attach());
                node.style.width = "100%";
                node.style.height = "100%";
                
                document.getElementById("media-div").appendChild(node)
                this.onMediaLoaded()

            });
          });

 
    }
}

export default ChatApi2;