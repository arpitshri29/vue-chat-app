<template>
    <div class="w-100 mt-3">
        <h2>Edit Profile</h2>
        <div class="profile">
            <img class="br-06 dp" :src="photoURL" />
            <label class="avatar">
                <img src="../assets/editing.png" alt="">
                <input type="file"
                       accept=".jpg, .jpeg, .png"
                       name="upload"
                       class="w-0"
                       @change="changeAvatar" />
            </label>
        </div>
        <div class="form-group">
            <input
                    type="text"
                    name="name"
                    class="form-control"
                    v-model="name"
                    placeholder="Name"
            />
        </div>
        <div class="form-group">
            <input
                    type="text"
                    name="aboutMe"
                    class="form-control"
                    v-model="aboutMe"
                    placeholder="About me"
            />
        </div>
        <button type="button" class="btn btn-profile" v-on:click="uploadAvatar">Save</button>
        <button type="button" class="btn btn-profile" v-on:click="backToChat">Back</button>
    </div>
</template>

<script>
    import firebase from '../services/firebase';

    export default {
        name: 'Profile',
        data(){
            return{
                documentKey: localStorage.getItem('FirebaseDocumentId'),
                id: localStorage.getItem('id'),
                name: Object.prototype.hasOwnProperty.call(localStorage,'name') ? localStorage.getItem('name') : "",
                aboutMe: Object.prototype.hasOwnProperty.call(localStorage, 'desc') ? localStorage.getItem('desc') : "",
                photoURL: localStorage.getItem('photoURL'),
                newPhoto: null
            }
        },
        methods:{
            backToChat(){
                this.$router.push('/chat')
            },
            changeAvatar(event){
                if (event.target.files && event.target.files[0]){
                    const fileType = event.target.files[0].type.toString();

                    if (fileType.indexOf("image") !== 0){
                        alert('Please choose an image!');
                    }
                    this.newPhoto = event.target.files[0];
                    this.photoURL = URL.createObjectURL(event.target.files[0]);
                } else {
                    alert('Something went wrong!')
                }
            },
            uploadAvatar(){
                if (this.newPhoto){
                    const uploadPhoto = firebase
                        .storage()
                        .ref()
                        .child(this.id)
                        .put(this.newPhoto);
                    uploadPhoto.on(
                        'state_changed',
                        null,
                        err => {
                            console.log("Error: ", err.message)
                        },
                        () => {
                            uploadPhoto.snapshot.ref.getDownloadURL().then(url => {
                                console.log('url: ', url);
                                this.updateUserInfo(true, url);
                            })
                        }
                    )
                } else {
                    this.updateUserInfo(false, null)
                }
            },
            updateUserInfo(isUrlPresent, downloadURL){
                let newInfo = {};
                if (isUrlPresent){
                    newInfo = {
                        name: this.name,
                        description: this.aboutMe,
                        URL: downloadURL
                    }
                } else {
                    newInfo = {
                        name: this.name,
                        description: this.aboutMe
                    }
                }
                firebase
                    .firestore()
                    .collection('users')
                    .doc(this.documentKey)
                    .update(newInfo)
                    .then(() => {
                        localStorage.setItem("name", this.name);
                        localStorage.setItem("desc", this.aboutMe);
                        if (isUrlPresent) {
                            localStorage.setItem("photoURL", downloadURL);
                        }
                    })
            }
        },
        created(){
            if (!Object.prototype.hasOwnProperty.call(localStorage, "id")) {
                this.$router.push("/");
            }
        }
    }
</script>

<style scoped>
    input[type="text"],
    input[type="password"] {
        display: inline-block;
        box-sizing: border-box;
        padding: 4px;
        width: 220px;
        height: 32px;
        border: none;
        border-bottom: 1px solid #AAA;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 15px;
        transition: 0.2s ease;
        border-radius: 0;
        outline: none;
        box-shadow: none;
    }
    label {
        font-size: 18px;
        font-weight: 600;
    }

    h2{
        font-weight: 600;
    }
    .w-100 {
        width: 100vw;
    }
    .w-0 {
        width: 0;
    }
    .br-06 {
        border-radius: 0.6rem;
    }
    .profile {
        margin: 20px auto;
        width: 150px;
        height: 150px;
        background-color: royalblue;
        position: relative;
        border-radius: 0.6rem;
    }

    .dp{
        height: 100%;
        width: 100%;
    }

    .avatar {
        width: 35px;
        height: 35px;
        background: #6c13f4;
        border-radius: 0.6rem;
        position: absolute;
        top: 115px;
        right: 0;
    }

    .btn-profile{
        margin: 30px;
        width: 80px;
        height: 32px;
        background: #16a085;
        border: none;
        border-radius: 2px;
        color: #FFF;
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        text-transform: uppercase;
        transition: 0.1s ease;
    }

    .btn-profile:hover, .btn-profile:focus{
        opacity: 0.8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        transition: 0.1s ease;
    }

</style>