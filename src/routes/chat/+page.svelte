<script>
     import { goto } from "$app/navigation";
     import { Client, Account, Databases, ID } from "appwrite";
     
     import { browser } from "$app/environment";
     
     $:list = []
     let text = ""
     let num = 0
     let messages = []
     let current_name = ""
     let justsent = ""
     let theircolour = 0
     let date = new Date()
     let currentDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

     let account = null
     let databases = null
     let logged_in = null
     let client = null

     const PROJECT_ID = "65dcef70b264fce7d523"
     const DATABASE_ID = "65dcf15fcf3ad3efa311"
     const COLLECTION_MESSAGES = "65dcf1b8ae5a73103269"


     const getMessages = async () =>{
          const promise = await databases.listDocuments(DATABASE_ID, COLLECTION_MESSAGES)
          messages = promise.documents
          console.log(messages)
     }
     const sendMessages = async () =>{
          let payload = {
               body: text,
               username: (await logged_in).name,
               user_id: (await logged_in).$id,
               colour: num
          }
          const promise = await databases.createDocument(DATABASE_ID, COLLECTION_MESSAGES, ID.unique(), payload)
          console.log(promise)
     }

     if (browser){
          client = new Client();
          
          client
          .setEndpoint('https://cloud.appwrite.io/v1')
          .setProject(PROJECT_ID);
          
          account = new Account(client);
          databases = new Databases(client);
          
          
          logged_in = account.get()

          const ting = async () =>{
               num = (await logged_in).prefs.colour
               current_name = (await logged_in).name
               }
          ting()
          
          client.subscribe([`databases.${DATABASE_ID}.collections.${COLLECTION_MESSAGES}.documents`, 'files'], response => {
               if (response.events.includes("databases.*.collections.*.documents.*.create")){
                    console.log("response",response);
                    response.payload.$id= crypto.randomUUID()
                    justsent = response.payload.username
                    if (justsent != current_name){
                         theircolour = response.payload.colour
                    }
                    messages = messages.concat(response.payload)
                    console.log("messages",messages)
               }
          });
          
          getMessages()

     }

     const scrollToBottom = node => {
     const scroll = () => node.scroll({
          top: node.scrollHeight,
          behavior: 'smooth',
     });
     scroll();

     return { update: scroll }
     };

     const logoutUser = async () =>{
          const promise = account.deleteSession("current");
          goto("/")
     }

     const result = () =>{
          if (text != ""){
               list = list.concat(text)
               sendMessages()
          }
          
          text = ""
          
          console.log(logged_in)
     }
     
    
</script>
     
<class class="container">
     <header>
          <div class="heading">
               <div class="head-container">
                    <p class="title">Chatterbox</p>
                    <p class="currentDate">{currentDate}</p>
                    
                    <button on:click={logoutUser}><svg class="icon1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" height={58} width={58} id="Logout-2--Streamline-Plump" ><desc>{"Logout 2 Streamline Icon: https://streamlinehq.com"}</desc><g id="Logout-2--Streamline-Plump"><path id="Union" fill="#ffffff" fillRule="evenodd" d="M1.5 24c0 11.322 9.178 20.5 20.5 20.5 6.741 0 12.722 -3.254 16.458 -8.276a4.862 4.862 0 0 1 -3.335 -0.238c-1.814 -0.817 -2.836 -2.586 -2.946 -4.485l-0.017 -0.32 -16.69 -0.607c-2.402 -0.087 -5.01 -1.744 -5.363 -4.76a15.614 15.614 0 0 1 0 -3.626c0.352 -3.017 2.96 -4.674 5.363 -4.761l16.69 -0.607 0.017 -0.321c0.11 -1.9 1.132 -3.67 2.947 -4.486a4.862 4.862 0 0 1 3.334 -0.238C34.72 6.753 28.74 3.5 22 3.5 10.678 3.5 1.5 12.678 1.5 24Zm33.672 7.327c0.11 1.903 1.91 2.716 3.4 1.527a75.087 75.087 0 0 0 3.346 -2.855c2.127 -1.913 3.382 -3.369 4.112 -4.367 0.733 -1 0.733 -2.265 0 -3.266 -0.73 -0.998 -1.985 -2.454 -4.112 -4.367a75.167 75.167 0 0 0 -3.346 -2.853c-1.49 -1.19 -3.29 -0.377 -3.4 1.526a95.242 95.242 0 0 0 -0.122 3.045l-19.47 0.708c-1.251 0.045 -2.348 0.868 -2.494 2.111a12.654 12.654 0 0 0 0 2.929c0.146 1.243 1.243 2.066 2.493 2.111l19.471 0.708a95.4 95.4 0 0 0 0.122 3.043Z" clipRule="evenodd" strokeWidth={1} /></g></svg></button>
               </div>
          </div>
     </header>
     {#if justsent == current_name}
     <div class="messages" use:scrollToBottom={messages}>
          <div class="message-container">
          {#each messages as msg (msg.$id)}
               {#if msg.username == current_name}
               <div style="display:flex; justify-content:center; align-items:flex-end; margin-right:30px; width:93vw; flex-direction:column; align-items: right:0;">
                    <div class="name" style="color: hsla({num}, 77%, 45%, 1);">me</div>
                    <textarea readonly class="message" style="background: hsla({num}, 77%, 45%, 1);" cols="30" rows="10">{msg.body}</textarea>
                    <div class="date">{new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
               {:else}
                              <div class="name2" style="color: hsla({msg.colour}, 77%, 45%, 1);">{msg.username}</div>
                              <textarea readonly class="message2" style="background: hsla({msg.colour}, 77%, 45%, 1);" cols="30" rows="10">{msg.body}</textarea>
                              <div class="date2" style="color: white; width:10%; display:flex; align-items:left;">{new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               {/if}
          {/each}
          </div>
     </div>
     <form on:submit|preventDefault={result}>
          <input type="text" bind:value={text}>
          <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" height={48} width={48} id="Mail-Send-Email-Message-Circle--Streamline-Plump" ><desc>{"Mail Send Email Message Circle Streamline Icon: https://streamlinehq.com"}</desc><g id="Mail-Send-Email-Message-Circle--Streamline-Plump"><path class="icon2" id="Subtract" fill="#ffffff" fillRule="evenodd" d="M24 47.5C11.021 47.5 0.5 36.979 0.5 24S11.021 0.5 24 0.5 47.5 11.021 47.5 24 36.979 47.5 24 47.5Zm-8.42 -37.342c-1.514 -0.53 -2.878 0.89 -2.301 2.386a121.18 121.18 0 0 0 3.316 7.73 3.871 3.871 0 0 0 2.454 2.066L24.857 24l-5.808 1.66a3.872 3.872 0 0 0 -2.454 2.066 121.148 121.148 0 0 0 -3.316 7.73c-0.577 1.496 0.787 2.915 2.3 2.386 4.962 -1.735 14.328 -5.47 23.225 -11.54a2.774 2.774 0 0 0 0 -4.605c-8.898 -6.07 -18.263 -9.804 -23.225 -11.539Z" clipRule="evenodd" strokeWidth={1} /></g></svg></button>
     </form>
     {:else}
     <div class="messages" use:scrollToBottom={messages}>
          <div class="message-container">
          {#each messages as msg (msg.$id)}
               {#if msg.username == current_name}
               <div style="display:flex; justify-content:center; align-items:flex-end; width:93vw; flex-direction:column; align-items: right:0;">
                    <div class="name" style="color: hsla({num}, 77%, 45%, 1);">me</div>
                    <textarea readonly class="message" style="background: hsla({num}, 77%, 45%, 1);" cols="30" rows="10">{msg.body}</textarea>
                    <div class="date">{new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
               {:else}
               <div style="">
                              <div class="name2" style="color: hsla({msg.colour}, 77%, 45%, 1);">{msg.username}</div>
                              <textarea readonly class="message2" style="background: hsla({msg.colour}, 77%, 45%, 1);" cols="30" rows="10">{msg.body}</textarea>
                              <div class="date2" style="color: white; width:10%; display:flex; align-items:left;">{new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
               {/if}
          {/each}
          </div>
     </div>
     <form on:submit|preventDefault={result}>
          <input type="text" bind:value={text}>
          
          <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" height={48} width={48} id="Mail-Send-Email-Message-Circle--Streamline-Plump" ><desc>{"Mail Send Email Message Circle Streamline Icon: https://streamlinehq.com"}</desc><g id="Mail-Send-Email-Message-Circle--Streamline-Plump"><path class="icon2" id="Subtract" fill="#ffffff" fillRule="evenodd" d="M24 47.5C11.021 47.5 0.5 36.979 0.5 24S11.021 0.5 24 0.5 47.5 11.021 47.5 24 36.979 47.5 24 47.5Zm-8.42 -37.342c-1.514 -0.53 -2.878 0.89 -2.301 2.386a121.18 121.18 0 0 0 3.316 7.73 3.871 3.871 0 0 0 2.454 2.066L24.857 24l-5.808 1.66a3.872 3.872 0 0 0 -2.454 2.066 121.148 121.148 0 0 0 -3.316 7.73c-0.577 1.496 0.787 2.915 2.3 2.386 4.962 -1.735 14.328 -5.47 23.225 -11.54a2.774 2.774 0 0 0 0 -4.605c-8.898 -6.07 -18.263 -9.804 -23.225 -11.539Z" clipRule="evenodd" strokeWidth={1} /></g></svg></button>
     </form>
     {/if}
     
</class>
     
<style>
     textarea{
          resize: none;
          outline: none;
          border: none;
          pointer-events: none;
     }
     path:hover{
          fill: black;
     }
     path:hover{
          fill: black;
     }
     .icon2:hover{
          fill: #ff1947;
     }
     .icon2:focus{
          fill: #ff1947;
     }
     button{
          background: none;
          outline: none;
          cursor: pointer;
          border: none;
     }
     .send{
          width: 70px;
          height: 70px;
     }
     

     

     .head-container{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 95vw;
     }

     @media screen and (min-width: 882px){
          .heading{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100px;
          background: linear-gradient(90deg, rgba(154,43,245,1) 39%, rgba(255,63,79,1) 100%);
          color: white;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 30pt; 
          font-style: normal; 
          font-variant: normal; 
          font-weight: 700; 
          line-height: 26.4px;
          box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -webkit-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -moz-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
     }
          .container{
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 0px;
          background: #03071E;
          overflow: hidden;
          
     }
          .messages{
               width: 95%;
               height: 800px;
               margin-top: auto;
               gap: 10px;
               overflow: auto;
               display:flex;
               flex-direction: column;
               align-items: flex-end;
               scroll-behavior: smooth;
               padding-right: 10px;
               margin-right: 50px;
               padding-left: 100px;
               
          }
          .message{
          display: flex;
          align-items: center;
          height: 60px;
          width: 400px;
          max-width: 400px;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 20pt;
         
     }
     .message2{
          display: flex;
          align-items: center;
          height: 60px;
          width: 400px;
          max-width: 400px;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 20pt;
          padding-right: 100px;
          padding-left: 20px;
     }
     }

     @media screen and (max-width: 400px){
          .heading{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100px;
          background: linear-gradient(90deg, rgba(154,43,245,1) 39%, rgba(255,63,79,1) 100%);
          color: white;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 20pt; 
          font-style: normal; 
          font-variant: normal; 
          font-weight: 700; 
          line-height: 26.4px;
          box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -webkit-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -moz-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
     }
     .icon1{
          width: 40px;
          height: 40px;
     }
          .container{
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 0px;
          background: #03071E;
          overflow: hidden;
     }
          .message{
          display: flex;
          align-items: center;
          height: 60px;
          min-width: 60px;
          max-width: 200px;
          width: fit-content;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 15pt;
          padding-right: 10px;
          padding-left: 20px;
          
     }
     .message2{
          display: flex;
          align-items: center;
          height: 60px;
          min-width: 60px;
          max-width: 200px;
          width: fit-content;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 20pt;
          padding-right: 10px;
          margin-left: 8px;
          padding-left: 20px;
     }
     .name2{
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 20pt;
          text-align: left;
          margin-left: 8px;
     }
     .date2{
          margin-top: 3px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 15pt;
          margin-left: 8px;
          color: rgb(184, 184, 184);
          text-align: right;
     }

          .messages{
               width: 100vw;
               height: 800px;
               margin-top: auto;
               
               gap: 10px;
               overflow: auto;
               display:flex;
               flex-direction: column;
               align-items: flex-end;
               scroll-behavior: smooth;

          }
     }
     @media screen and (max-width: 882px){
          .heading{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100px;
          background: linear-gradient(90deg, rgba(154,43,245,1) 39%, rgba(255,63,79,1) 100%);
          color: white;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
          font-size: 20pt; 
          font-style: normal; 
          font-variant: normal; 
          font-weight: 700; 
          line-height: 26.4px;
          box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -webkit-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
          -moz-box-shadow: 10px 10px 15px 0px rgba(0,0,0,0.83);
     }
     .icon1{
          width: 40px;
          height: 40px;
     }
          .container{
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 0px;
          background: #03071E;
          overflow: hidden;
     }
          .messages{
               width: 100vw;
               height: 800px;
               margin-top: auto;
               gap: 10px;
               overflow: auto;
               display:flex;
               flex-direction: column;
               align-items: flex-end;
               scroll-behavior: smooth;
               padding-right: 10px;
               margin-right: 80px;
               padding-left: 50px;
               margin-left: 50px;
          }
          .message{
          display: flex;
          align-items: center;
          height: 60px;
          min-width: 60px;
          max-width: 200px;
          width: fit-content;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 15pt;
          padding-right: 10px;
          padding-left: 20px;
     }
     .message2{
          display: flex;
          align-items: center;
          height: 60px;
          min-width: 60px;
          max-width: 200px;
          width: fit-content;
          border-radius: 8px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          color: white;
          font-size: 20pt;
          padding-right: 10px;
          padding-left: 20px;
     }
     }
     .message-container{
          min-width: 50px;
          display: flex;
          flex-direction: column;
          
     }
     .name{
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 20pt;
          text-align: left;
     }
     .date{
          margin-top: 3px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 15pt;
          color: rgb(184, 184, 184);
          text-align: right;
     }
     

     .name2{
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 20pt;
          text-align: left;
     }
     .date2{
          margin-top: 3px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 15pt;
          color: rgb(184, 184, 184);
          text-align: right;
     }
     
     .ting{
          max-width: 20ch;
          word-wrap: break-word;
     }
     form{
          width: 95%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
     }
     input{
          width: 100%;
          padding: 10px;
          font-size: 30pt;
          border-radius: 15px;
          outline: none;
          background: none;
          color: white;
          border: 3px solid #ff1947;
     }
     ::-webkit-scrollbar {
     width: 10px;
     }
     ::-webkit-scrollbar-thumb {
     background: rgba(237, 156, 175, 0.42); 
     border-radius: 10px;
     }
</style>