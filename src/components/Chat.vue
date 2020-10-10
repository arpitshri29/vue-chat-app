<template>
    <div class="wrapper">
        <!-- Sidebar Start -->
        <nav style="color: white" id="sidebar">
            <div class="sidebar-header d-flex justify-content-around align-items-center">
                <div
                        class="d-flex pointer profile-dp"
                        v-on:click="onProfileClick"
                >
                    <img
                            :src="photoURL"
                            alt="user"
                            class="user-dp"
                    />
                </div>
                <button type="button" class="btn logout-btn" v-on:click="logout">Logout</button>
            </div>
            <div style="height: 1px; border-bottom: 1px solid #586471"></div>
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
                                    style=""
                                    class="peer-dp"
                            />
                        </div>
                        <div class="left-panel">
                            <h6 style="line-height: 2; font-weight: 600">{{item.name}}</h6>
                        </div>
                    </div>
                    <div style="height: 1px; border-bottom: 1px solid #586471"></div>
                </li>
            </ul>
        </nav>
        <!-- Sidebar Ends -->

        <!-- Page Content Start -->
        <div id="content" v-if="currentPeerUser===null">
            <div class="my-4">
                <img :src="photoURL" class="br-50 main-dp" />
            </div>
            <div>
                <h2>Welcome {{currentUserName}},</h2>
                <h3>Shall we begin</h3>
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
    .logout-btn{
        color: #101820;
        background-color: #F2AA4C;
        border-color: #F2AA4C;
        font-weight: 600;
        height: 40px;
    }
    .profile-dp{
        margin-right: 25px;
        width: 160px;
        height: auto;
    }
    .user-dp{
        width:50px;
        max-height:55px;
        border-radius: 50%;
    }
    .peer-dp{
        width:50px;
        max-height:55px;
        border-radius: 50%;
    }

    .main-dp{
        width:auto;
        height:150px;
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