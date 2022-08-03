const ErrorHandling = function(err) {
    if(typeof err === "object") {
        alert('(!)Error \n', JSON.stringify(err))
    }
    else{
        alert('(!)Error \n', err)
    }
}

// 현재 account 데이터베이스에 있는 모든 유저 return
const getAccountDataList = async function() {
    try{
       return await fetch("./account")
                .then(res => res.json())
                .then(res => res.data)
                .catch(err => {ErrorHandling(err); return []});
    }
    catch(err){
       ErrorHandling(err);
       return [];
    }
}

window.document.addEventListener("DOMContentLoaded", async function() {
     const accountDataList = await getAccountDataList();
     let addedAccounts = ""
     if(accountDataList && accountDataList.length > 0) {
        const accountListElem = document.getElementById("account_list");
        for(let i = 0; i<accountDataList.length; i++){
         addedAccounts = addedAccounts + `
            <div class='account_box'>
                <div class='account_uid'><span>uid</span> ${accountDataList[i].uid}</div>
                <div class='account_email'><span>email</span> ${accountDataList[i].email}</div>
                <div class='account_password'><span>password</span> ${accountDataList[i].password}</div>
                <button onClick='handleDeleteUser("${accountDataList[i].uid}")'>삭제</button>
            </div>
         `
        }
        accountListElem.innerHTML = addedAccounts;
     }
});

const accountEmailInputElem = document.getElementById("account_email");
const accountPasswordInputElem = document.getElementById("account_password");
const registButtonElem = document.getElementById("regist_button");

// 이메일 입력 변화 감지
accountEmailInputElem.addEventListener("keyup", function(e) {
    const inputValue = e.target.value;
    if(inputValue && inputValue.includes("@")){
        accountEmailInputElem.setAttribute("class", "valid")
    }else{
        accountEmailInputElem.removeAttribute("class")
    }
})

// 비밀번호 입력 변화 감지
accountPasswordInputElem.addEventListener("keyup", function(e) {
    const inputValue = e.target.value;
    if(inputValue && inputValue.length >= 4){
        accountPasswordInputElem.setAttribute("class", "valid")
    }else{
        accountPasswordInputElem.removeAttribute("class")
    }
})

// 사용자가 입력한 email, password 값 검사 결과 return
const getValidStatus = function(email, password) {
    if(!email || typeof email !== "string" || !email.includes("@")){
        alert("(!)아이디 입력 오류, @ 이가 반드시 들어가야합니다.")
        return false;
    }
    if(!password || typeof password !== "string" || password.length < 4){
        alert("(!)비밀번호 입력 오류, 4글자 이상이어야 합니다.")
        return false;
    }
    return true;
}

// 등록(회원가입) 결과 return
const getRegistStatus = async function(email, password) {
    try{
        return await fetch("./account/add", {
        method: "post",
        body: JSON.stringify({"email": email, "password": password}),
        headers: {"Content-Type": "application/json"}
        }).then(res => {return res.json()})
        .then(res => {console.log(res); return !res.isError})
        .catch(err => {console.log(err); return false})
    }
    catch(err){
        ErrorHandling(err);
        return false;
    }
}

// 등록 버튼 클릭 이벤트
registButtonElem.addEventListener("click", async function() {
    const email = accountEmailInputElem.value;
    const password = accountPasswordInputElem.value;
    const isValid = getValidStatus(email, password)
    if(!isValid) {
       return;
    };
    const result = await getRegistStatus(email, password)
    if(result){
        alert("회원가입 완료");
        location.href = '/'
    }
    else{
        alert("(!)회원가입 오류")
    }
})

const getDeleteStatus = async function(uid) {
   try{
      return await fetch("/account/delete", {
        method: "post",
        body: JSON.stringify({"uid": uid}),
        headers: {"Content-Type": "application/json"}
      }).then(res => {return res.json();})
      .then(res => {return !res.isError;})
      .catch(err => {console.log(err); return false;})
   }
   catch(err){
      ErrorHandling(err);
      return false;
   }
}

const handleDeleteUser = async function(uid) {
    console.log('delete uid :', uid)
    const result = await getDeleteStatus(uid)
    if(result){
        alert(uid, "\n회원 삭제 성공")
        location.href = "/";
    }
    else{
        alert("(!)회원 삭제 오류")
        location.href = "/";
    }
}