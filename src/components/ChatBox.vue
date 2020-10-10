<template>
    <div class="main">
        <header>
            <div class="header">
                <img :src="currentPeerUser.URL" class="br-50 w-40 header-image" />
                <div class="header-image">
                    <h6 class="header-name">{{currentPeerUser.name}}</h6>
                </div>
            </div>
        </header>
        <div class="chat-bg">
            <h2 class="welcome">Let's Chat</h2>
            <div class="text-outer">
                <div
                        :class="item.idFrom === currentUserId ? 'textFrom' : 'textTo'"
                        class="text-inner"
                        v-for="item in listMessage"
                        :key="item.id"
                >
                    <h6>{{item.content}}</h6>
                </div>
            </div>
        </div>
        <footer>
            <div class="footer" style="">
                <div style="display: flex; padding: 15px">
                    <input
                            type="text"
                            class="mr-3 input-box"
                            v-model="inputValue"
                            v-on:keyup.enter="sendMessage(inputValue)"
                    />
                    <img
                            class="mr-2 icons"
                            src="../assets/send.png"
                            alt="select sticker"
                            v-on:click="sendMessage(inputValue)"
                    />
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import firebase from "../services/firebase";
    import moment from 'moment';
    export default {
        name: 'ChatBox',
        props: ["currentPeerUser"],
        data(){
            return{
                currentUserName: localStorage.getItem("name"),
                currentUserId: localStorage.getItem("id"),
                currentUserPhoto: localStorage.getItem("photoURL"),
                photoURL: localStorage.getItem("photoURL"),
                inputValue: "",
                groupChatId: null,
                listMessage: [],
            }
        },
        watch: {
            currentPeerUser: function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.getMessages();
                }
            }
        },
        methods: {
            sendMessage(content) {
                if (content.trim() === "") {
                    return;
                }
                const timestamp = moment()
                    .valueOf()
                    .toString();
                const messageSent = {
                    id: timestamp,
                    idFrom: this.currentUserId,
                    idTo: this.currentPeerUser.id,
                    timestamp: timestamp,
                    content: content.trim(),
                };
                firebase
                    .firestore()
                    .collection("Messages")
                    .doc(this.groupChatId)
                    .collection(this.groupChatId)
                    .doc(timestamp)
                    .set(messageSent)
                    .then(() => {
                        this.inputValue = "";
                    });
            },
            getMessages() {
                this.listMessage = [];
                let groupChatId = `${this.currentPeerUser.id} + ${this.currentUserId}`;
                firebase
                    .firestore()
                    .collection("Messages")
                    .doc(groupChatId)
                    .collection(groupChatId)
                    .onSnapshot(Snapshot => {
                        if (Snapshot.docChanges().length > 0) {
                            this.groupChatId = groupChatId;
                            Snapshot.docChanges().forEach(change => {
                                this.listMessage.push(change.doc.data());
                            });
                        } else {
                            this.groupChatId = `${this.currentUserId} + ${this.currentPeerUser.id}`;
                            firebase
                                .firestore()
                                .collection("Messages")
                                .doc(this.groupChatId)
                                .collection(this.groupChatId)
                                .onSnapshot(Snapshot => {
                                    Snapshot.docChanges().forEach(res => {
                                        if (res.type === "added") {
                                            this.listMessage.push(res.doc.data());
                                        }
                                    });
                                });
                        }
                    });
            }
        },
        mounted() {
            this.getMessages();
        }
    }
</script>

<style scoped>
    .main{
        display: flex;
        flex-direction: column;
        height: 100vh
    }

    .header{
        height: 60px;
        background: lightgrey;
        align-items: center;
        display: flex;
        padding: 10px;
    }

    .w-40{
        width: 40px;
    }

    .welcome {
        color: #635a5a;
        font-weight: 600;
        margin: 10px 0px 32px;
    }
    .br-50 {
        border-radius: 50%;
    }
    .header-image {
        float: left;
    }
    .header-name{
        font-weight: 600;
        margin: 0 0 0 5px;
    }
    .chat-bg{
        background: #efe9e2;
        flex: 1;
        overflow-y: auto
    }
    .text-outer {
        display: flex;
        flex-direction: column;
    }
    .text-inner {
        padding: 10px 10px 2px;
        border-radius: 0.5rem;
        width: 20%;
    }
    .footer{
        min-height: 60px;
        background: lightgrey
    }
    .input-box{
        width: 95%;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 5px 10px;
    }
    .icons{
        width:24px;
        height:24px;
        align-self: center
    }
    .textFrom {
        background: #5bb8ef;
        color: #ffffff;
        margin: 0 0 20px 78%;
    }
    .textTo {
        background: #A7AEBA;
        color: #ffffff;
        margin: 0 0 20px 2%;
    }
</style>