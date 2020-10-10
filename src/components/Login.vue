<template>
    <div class="mt-4">
        <h2>Vue Chat App</h2>
        <form class="detail-box my-5">
            <div class="form-group my-3">
                <h4>Log in</h4>
                <input
                        type="text"
                        v-model="email"
                        class="form-control mb-4 mt-4"
                        placeholder="Email"
                />
                <input
                        type="password"
                        v-model="password"
                        class="form-control mb-4"
                        placeholder="Password"
                        v-on:keyup.enter="login"
                />
                <router-link :to="{ path: 'signup'}">
                    <h6 class="mb-3"
                        style="color: #222;text-decoration: underline;">
                        Create an account
                    </h6>
                </router-link>

                <button
                        type="button"
                        v-on:click="login"
                        class="btn btn-submit">
                    Login
                </button>
            </div>
        </form>
        <div class="myname">Arpit Shrivastava</div>
    </div>
</template>

<script>
    import firebase from '../services/firebase'

    export default {
        name: 'Login',
        data(){
            return{
                email: '',
                password: '',

            }
        },
        methods:{
            login(){
                const auth = firebase.auth();
                const email = this.email;
                const password = this.password;

                auth
                    .signInWithEmailAndPassword(email, password)
                    .then(async res => {
                        let user = res.user
                        if (user){
                            await firebase
                                .firestore()
                                .collection('users')
                                .where('id', '==', user.uid)
                                .get()
                                .then(querySnapshot => {
                                    querySnapshot.forEach(doc => {
                                        let userData = doc.data();
                                        localStorage.setItem("id", userData.id);
                                        localStorage.setItem("name", userData.name);
                                        localStorage.setItem("email", userData.email);
                                        localStorage.setItem("password", userData.password);
                                        localStorage.setItem("photoURL", userData.URL);
                                        localStorage.setItem("desc", userData.description);
                                        localStorage.setItem("FirebaseDocumentId", doc.id);
                                    })
                                });
                            this.$router.push('/chat')
                        }
                    })
                    .catch(err => {
                        let errorCode = err.code;
                        let errorMessage = err.message;
                        alert(errorCode);
                        alert(errorMessage);
                        console.log(err);
                    })
            }
        },
        created(){
            if (localStorage.getItem('id')){
                this.$router.push('/chat')
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
    .detail-box {
        padding: 5px;
        width: 400px;
        min-height: 250px;
        margin: 0 auto;
    }

    .btn-submit{
        margin-top: 28px;
        width: 120px;
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

    .btn-submit:hover, .btn-submit:focus{
        opacity: 0.8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        transition: 0.1s ease;
    }

    .btn-submit:active{
        opacity: 1;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        transition: 0.1s ease;
    }

    h4{
        color: #222;
    }
    h4, h5, h6{
        font-weight: 600
    }
</style>