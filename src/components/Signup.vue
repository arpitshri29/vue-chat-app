<template>
    <div>
        <form class="detail-box my-5">
            <div class="form-group my-3">
                <h4>Sign up</h4>
                <input
                        type="text"
                        v-model="name"
                        class="form-control mb-4 mt-4"
                        placeholder="Username"
                />
                <input
                        type="text"
                        v-model="email"
                        class="form-control mb-4"
                        placeholder="Email"
                />
                <input
                        type="password"
                        v-model="password"
                        class="form-control mb-4"
                        placeholder="Password"
                />
                <router-link :to="{ path: '/'}">
                    <h6 class="mb-3"
                        style="color: #222;text-decoration: underline;">
                        Back to login
                    </h6>
                </router-link>
                <button
                        type="button"
                        v-on:click="signup"
                        class="btn btn-submit">
                    Sign me up
                </button>
            </div>
        </form>
        <div class="myname">Arpit Shrivastava</div>
    </div>
</template>

<script>
    import firebase from '../services/firebase';

    export default {
        name: 'Signup',
        data() {
          return {
              name: '',
              email: '',
              password: '',
          }
        },
        methods:{
            signup(){
                const auth = firebase.auth();
                const name = this.name;
                const email = this.email;
                const password = this.password;

                auth
                    .createUserWithEmailAndPassword(email, password)
                    .then(async res => {
                        await firebase.
                        firestore()
                            .collection('users')
                            .add({
                            name,
                            id: res.user.uid,
                            email,
                            password,
                            URL:"",
                            description:"",
                            })
                            .then( ref => {
                                localStorage.setItem('id', res.user.uid);
                                localStorage.setItem("name", name);
                                localStorage.setItem("email", email);
                                localStorage.setItem("password", password);
                                localStorage.setItem("photoURL", "");
                                // localStorage.setItem("uploadChanged", "state_changed");
                                localStorage.setItem("desc", "");
                                localStorage.setItem("FirebaseDocumentId", ref.id);
                                this.name = "";
                                this.email = "";
                                this.password = "";
                                this.$router.push("/chat");
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(function(error) {
                            let errorCode = error.code;
                            let errorMessage = error.message;
                            if (errorCode === "auth/weak-password") {
                                alert("The password is too weak.");
                            } else {
                                alert(errorMessage);
                            }
                        });

                    }
        }
    }
</script>

<style scoped>
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