<template>
    <div class="wrapper">
        <!-- Sidebar Start -->
        <nav style="color: white" id="sidebar">
            <div class="sidebar-header d-flex justify-content-around">
                <div
                        class="d-flex pointer profile-dp"
                        v-on:click="onProfileClick"
                >
                    <img
                            :src="photoURL"
                            alt="user"
                            style="width:auto;
                            height:50px;
                            border-radius: 50%;
                            background: white;"
                    />
                </div>
                <button type="button" class="btn btn-primary" v-on:click="logout">Logout</button>
            </div>
            <div style="height: 1px; border-bottom: 1px solid #00388b"></div>
            <ul class="list-unstyled components">
                <li
                        class="active mb-3"
                        v-on:click="letsChat(item)"
                        v-for="item in searchUsers"
                        :key="item.id"
                        v-show="item.id !== currentUserId"
                >

                    <div class="d-flex active-user">
                        <div style="width: 30%">
                            <img
                                    :src="item.URL"
                                    alt="user"
                                    width="50px"
                                    height="50px"
                                    style="width:auto;
                                    height:50px;
                                    border-radius: 50%;
                                    background: white;"
                            />
                        </div>
                        <div class="left-panel">
                            <h6 style="line-height: 2; font-weight: 600">{{item.name}}</h6>
                        </div>
                    </div>
                    <div style="height: 1px; border-bottom: 1px solid #00388b"></div>
                </li>
            </ul>
        </nav>
        <!-- Sidebar Ends -->

        <!-- Page Content Start -->
        <div id="content" v-if="currentPeerUser===null">
            <div class="my-4">
                <img :src="photoURL" style="width:auto; height:150px;" class="br-50" />
            </div>
            <div>
                <h2>Welcome {{currentUserName}},</h2>
                <h3>Let's start chat</h3>
            </div>
        </div>
        <div v-else class="header-width">
            <ChatBox v-bind:currentPeerUser="currentPeerUser" />
        </div>
        <!-- Page Content Ends -->
    </div>
</template>

<script>
    import firebase from '../services/firebase';
    import ChatBox from "./ChatBox";

    export default {
        name:'Chat',
        components:{
            ChatBox,
        },
        data(){
            return{
                currentUserName: localStorage.getItem("name"),
                currentPeerUser: null,
                currentUserId: localStorage.getItem("id"),
                currentUserPhoto: localStorage.getItem("photoURL"),
                searchUsers: [],
                photoURL: localStorage.getItem("photoURL"),
            }
        },
        methods:{
            logout() {
                firebase.auth().signOut();
                this.$router.push("/");
                localStorage.clear();
            },
            onProfileClick() {
                this.$router.push("/profile");
            },
            letsChat(item){
              this.currentPeerUser = item;
            },
            async getUsersList() {
                const result = await firebase
                    .firestore()
                    .collection("users")
                    .get();

                if (result.docs.length > 0) {
                    console.log("res: ", result.docs);
                    let listusers = [];
                    listusers = [...result.docs];
                    listusers.forEach((item, index) => {
                        this.searchUsers.push({
                            key: index,
                            documentKey: item.id, //db doc id
                            id: item.data().id, //uid
                            name: item.data().name,
                            messages: item.data().messages,
                            URL: item.data().URL,
                            description: item.data().description
                        });
                    });
                }
            },
        },
        created(){
            if (!Object.prototype.hasOwnProperty.call(localStorage, "id")) {
                this.$router.push("/");
            } else {
                this.getUsersList();
            }
        }
    }
</script>

<style scoped>
    .pointer {
        cursor: pointer;
    }
    .br-50 {
        border-radius: 50%;
    }
    .header-width {
        width: calc(100% - 350px);
        min-height: 100vh;
        transition: all 0.3s;
        position: absolute;
        top: 0;
        right: 0;
    }

    .profile-dp{
        margin-right: 25px;
        width: 160px
    }
    .active-user{
        cursor: pointer;
        padding-bottom: 15px;
        width: 100%
    }
    .left-panel{
        padding: 10px 0px 0px;
        width: 50%;
        display: flex;
        justify-content: space-between
    }
</style>