import Vue from "vue";
import firebase from "firebase/app";
//import * as firebase from "firebase/app"; => is not working

import "firebase/auth";
import "firebase/firebase-database";
import "firebase/firestore";
import firebaseConfig from "../../firebaseConfig";

firebase.initializeApp(firebaseConfig);

Vue.prototype.$firebase = firebase;
