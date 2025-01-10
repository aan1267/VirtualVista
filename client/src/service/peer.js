const PeerService=()=>{
    let peer

    const createPeerConnection = () => {
        if(!peer){
            peer= new RTCPeerConnection({
                iceServers:[
                   { urls:["stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302"]}
                ]
        })
        }
        return peer
    }

    const getOffer=async()=>{
        if(peer){
         const offer =await peer.createOffer()
         await peer.setLocalDescription(new RTCSessionDescription(offer))
         return offer
        }
     }

    const getAnswer=async(offer)=>{
        if(peer){
            await peer.setRemoteDescription(offer)
            const ans=await peer.createAnswer()
            await peer.setLocalDescription(new RTCSessionDescription(ans))
            return ans
        }
    }


    const setLocalDescription=async(ans)=>{
        if(peer){
            await peer.setLocalDescription(new RTCSessionDescription(ans))
        }
    }

    return {
        createPeerConnection,
        getOffer,
        getAnswer,
        setLocalDescription
    }

}

export  default  PeerService