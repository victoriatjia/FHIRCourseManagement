//Set table field
let field= {
	//field code	
	code: ["Username", "Password"],
	//field name
	desc: [],
	//field required or not
	isRequired: [1,1],		
	//field type e.g. text, number, password
	type: ["email", "password"],
	signUpPage: ""
};

if(web_language=="CH")
{
	field.desc= ["帳號 (Email)", "密碼"];
	info.pageName= "登入網頁";
	field.signUpPage= "報名請點我";
}
else if(web_language=="EN")
{
	field.desc= ["Email", "New Password"];
	info.pageName= "Forget Password";
}

let temp="";
//Show Login Form field
$(document).ready(function(){
	for(let i=0; i<field.desc.length;i++){
		temp += '<tr><td>' + field.desc[i];
		if(field.isRequired[i])			
			temp += '<font color="red"> *</font>';
		
		temp += '</td><td>:&nbsp;<input type="' + field.type[i] + '" id="p' + field.code[i] + '" ';
		
		if(field.code[i] == "Password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';
			
		if(field.isRequired[i])			
			temp += 'required';
			
		temp += '><br></td></tr>';
	}
	temp+= '<tr><td colspan="2" align="right"><input id="btnSubmit" type="button" value="Submit" onclick="dataValidation()"></td></tr>';
	document.getElementById('mainTable').innerHTML= temp;
});

//Show Page Title and Header (need to initialize info.pageName beforehand)
document.title= info.universityName + " - " + info.courseName + " - " + info.pageName;
document.getElementById("header").innerHTML= info.universityName + " - " + info.courseName + "<br>" + info.pageName;
document.getElementById("cp").innerHTML= message.signInFail + message.contactPerson;	

//Validate data input by user
function dataValidation(){
	if(checkRequiredField(field)){
		let id= $("#pUsername").val();
		getResource(FHIRURL, 'Person', '?identifier=' + id, FHIRResponseType, 'verifyUser');
	}
}

//Verify login account username and password
function verifyUser(obj){ 
	let encPassword= document.getElementById('SHA256PWD').value;
	let retID="", retName="", retUsername="", retPassword="", patientID="";
	let arrPatientID= new Array();
	
	if (obj.total == 0) alert(message.accountUnexist);
	else if (obj.total == 1){
		obj.entry[0].resource.identifier[1].value= encPassword;
		let personJSON = JSON.stringify(obj.entry[0].resource);
		retID = (obj.entry[0].resource.id) ? obj.entry[0].resource.id : '';
		putResource(FHIRURL, 'Person', '/' + retID, FHIRResponseType, "updatePasswordResult", personJSON)
	}
	else{
		alert(message.systemError + " " + message.contactPerson);
	}
}

function updatePasswordResult(obj){ 
	if (!isError(obj.resourceType, message.updatePasswordFail + message.contactPerson))
	{
		alert(message.updatePasswordOK);
		window.open('login.html',"_self");
	}
}


function isError(resourceType, msg){
	if(resourceType=="OperationOutcome")
	{
		document.getElementById("loadingPage").style.display = "none";
		alert(msg);
		return 1;
	}
	else
		return 0;
}