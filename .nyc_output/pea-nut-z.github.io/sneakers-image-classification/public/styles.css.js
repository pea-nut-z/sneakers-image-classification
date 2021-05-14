/* 
  --desktop: 1200px;
  --laptop: 1024px;
  --tablet: 768px;
  --phone: 480px;
   */

@media screen and (max-width: 1320px) {
  #title-msg-container {
    flex-direction: column !important;
  }
  #msg-bubble-container {
    margin-top: 20px !important;
  }
  #btns-input-container {
    justify-content: space-between !important;
    flex-direction: column !important;
    height: 85px !important;
  }
  #upload-btn-input-container {
    width: 100% !important;
  }
  #upload-btn {
    width: 30% !important;
  }
  #url-input {
    margin-left: 2% !important;
  }
  #submit-btns-container {
    width: 100% !important;
    justify-content: space-between;
    height: 100%;
    padding-top: 10px;
  }
  .btn {
    width: 49% !important;
    margin-left: 0 !important;
  }
  .subtitle {
    font-size: 18px !important;
  }
}

body {
  min-height: 50rem;
  min-width: 50rem;
  padding: 7rem;
  font-family: Monaco;
  background-color: RGB(252, 242, 212);
}

/* TITLE & BUBBLE */
#title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 30px;
  position: relative;
  top: 50%;
  font-family: Courier New;
  font-weight: bold;
}
#title {
  padding-left: 22px;
}
#results-container {
  display: flex;
  flex-direction: row;
}
.result-container {
  width: 50%;
  display: flex;
  flex-direction: column;
}
.subtitle {
  font-size: 22px;
  /* background-color: pink; */
  margin-top: 20px;
}
.hide {
  display: none;
}

#bag {
  width: 7%;
}
a,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: black;
}
#title-msg-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
#msg-bubble-container {
  position: relative;
  top: -7px;
  right: 7%;
}
#message-bubble {
  position: relative;
  z-index: -1;
  width: 250px;
  height: 250px;
}
#welcome-gif {
  position: absolute;
  height: 43%;
  width: 49%;
  top: 25px;
  left: 64px;
}
#res-container {
  position: absolute;
  display: flex;
  text-align: center;
  align-items: center;
  height: 84px;
  width: 188px;
  top: 20%;
  left: 11%;
}
#res-msg {
  width: 183px;
  font-size: 17px;
}

#progress-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 170px;
  height: 100px;
  top: 15%;
  left: 18%;
}

#progress-msg {
  font-size: 17px;
  padding-top: 20px;
}
/* UPLOAD BUTTON & INPUT */
#btns-input-container {
  display: flex;
  flex-direction: row;
  height: 35px;
  width: 100%;
  margin-bottom: 20px;
}
#upload-btn-input-container {
  display: flex;
  flex-direction: row;
  width: 75%;
}
#upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  border-radius: 5px;
  border: 1px solid black;
  background-color: rgb(196, 94, 255);
  color: white;
  font-size: 19px;
  cursor: pointer;
}
#url-input {
  line-height: 35px;
  margin-left: 10px;
  width: 100%;
  border: 1px solid black;
  border-radius: 5px;
  background-color: rgb(215, 250, 242);
  text-indent: 10px;
  font-size: 20px;
}
#url-input:focus {
  background-color: rgb(215, 250, 242);
  outline: none !important;
  box-shadow: 0 0 10px rgb(129, 212, 208);
}
::placeholder {
  padding-left: 10px;
  font-size: 15px;
}

/* ENTER & PREDICT BUTTONS */
#submit-btns-container {
  display: flex;
  flex-direction: row;
  width: 25%;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  width: 50%;
  height: 100%;
  margin-left: 10px;
  font-size: 20px;
}
.btn:focus {
  outline: none !important;
  box-shadow: 0 0 10px rgb(129, 212, 208);
}

#break {
  width: 100%;
  height: 1px;
  background-color: black;
}
#selected-image {
  margin-top: 20px;
  width: 50%;
  border: 1px solid black;
  border-radius: 5px;
}
#percentage-accuracy {
  margin-top: 10px;
}
.key {
  font-weight: bold;
  font-family: "Courier New";
}
#predicted-image {
  margin-top: 20px;
  margin-right: 20px;
  width: 44%;
  height: 44%;
  border: 1px solid black;
  border-radius: 5px;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 60px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: rgb(245, 186, 238);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
