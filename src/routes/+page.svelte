<script>
     import { Client, Account, ID } from "appwrite";
     import {goto} from "$app/navigation";
     import { random, randomInt } from "mathjs";

     import { browser } from "$app/environment";

     let email = ""
     let password = ""
     let username = ""
     let num = 0

     let account = null
     if (browser){
     
     const PROJECT_ID = "65dcef70b264fce7d523"
     const client = new Client()
         .setEndpoint('https://cloud.appwrite.io/v1')
         .setProject(PROJECT_ID)
     
     account = new Account(client)    
     
     const submitAccount = () =>{
          createAccount()
          goto("/chat")
     }
     }

     const createAccount = async () =>{
          const promise = await account.create(ID.unique(), email, password, username)

          const response = await account.createEmailSession(email, password);
          console.log(promise)
     }

     const loginAccount = async () =>{
          const promise = await account.createEmailSession(email, password);

          function getRandomNumber(min, max) {
          const randomNumber = Math.random();
          const scaledNumber = randomNumber * (max - min + 1);
          const result = Math.floor(scaledNumber) + min;
          return result;
          }
          const min = 0;
          const max = 359;
          num = getRandomNumber(min, max);

          const promise2 = await account.updatePrefs({colour: num});
          console.log(promise)
          goto("/chat")
     }

     
     </script>
     
     <div class="container">
          <h2>Bossmans</h2>
          <h1>Chatterbox</h1>
          <form>
               <input class="username" type="text" placeholder="Username" required bind:value={username}>
               <input class="email" type="email" placeholder="Email" required bind:value={email}>
               <input class="password" type="password" placeholder="Password" required bind:value={password}>
               <button on:click={createAccount}>Sign Up</button>
               <button on:click={loginAccount}>Login</button>
          </form>
     </div>
     
     <style>
     @media screen and (max-width: 882px){
          input{
          font-size: 18pt;
          height: 50px;
          width: 300px;
     }
     button{
          width: 200px;
          height: 60px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 20pt; 
     }
     form{
          width: 100vw;
     }
     .container{
          width: 100vw;
     }


     }

     @media screen and (min-width: 882px){
          input{
          font-size: 20pt;
          height: 70px;
          width: 500px;
     }
     button{
          width: 250px;
          height: 70px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 20pt; 
     }
     form{
          width: 100vw;
     }
     .container{
          width: 100vw;
     }


     }

     .container{
          box-sizing: border-box;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          background: #03071E;
     }

     h1{
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 60pt; 
          font-style: normal; 
          font-variant: normal; 
          font-weight: 700; 
          line-height: 26.4px;
          color: white;
     }
     h2{
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 30pt; 
          font-style: normal; 
          font-variant: normal; 
          font-weight: 700; 
          line-height: 26.4px;
          color: rgba(255, 255, 255, 0.216);
     }
     @keyframes anim{
          0% {content: "";}
          100% {content: "*";}
     }
     h1::after{
          content: "*";
          margin-left: 20px;
          height: 20px;
          width: 20px;
          background: white;
          color: white;
          animation-name: anim;
          animation-duration: 1s;
          animation-iteration-count: infinite;
     }
     
     form{
          margin: 0;
          gap: 20px;
          width: 500px;
          height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background: #9a2bf5;
          box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -webkit-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -moz-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          transition: .3s;
          border-radius: 25px;
     }
     input{
          font-size: 20pt;
          width: 400px;
          border-radius: 20px;
          outline: none;
          border: none;
          background: #03071e;
          color: #ff1c2f;
     }
     button{
          border-radius: 20px;
          outline: none;
          border: none;
          background: #ff1c2f;
          color: white;
     }

     button:hover{
          background: #ff1c2f;
     }
     button:focus{
          background: #03071e;
     }
     </style>