﻿/*
    getResource(URL, ResourceName, Parameter, ResponseType, AfterFun)
    說明：向Server取資料
    參數：
        URL：Server 路徑
        ResourceName：Resource名稱
        Parameter：向Server要求的參數
        ReponseType：要求Server 回傳的資料型態
        AfterFun：資料取得後欲執行的函式
*/
function getResource(URL, ResourceName, Parameter, ResponseType, AfterFun){
    //組欲向FHIR Server索取資料的路徑
    var url = URL + ResourceName + Parameter;
    //建立與伺服器互動元件
    var xhttp = new XMLHttpRequest();
    /*
        xhttp.open(method, url, async)
        說明：初始化元件
        參數：
            method：HTTP方法。分別有"GET、"POST"、"PUT"、"DELETE"
            url：要求路徑
            async：是否同步執行操作
    */
    xhttp.open("GET", url, true);
    /*
        xhttp.setRequestHeader(header, value)
        說明：設置HTTP標頭的值
        參數：
            header：標頭名稱
            value：標頭的值
    */
    xhttp.setRequestHeader("Content-type", 'text/' + ResponseType);
    /*
        xhttp.onreadystatechange = callback;
        說明：建立當readyState狀態改變時執行的部分
    */
    xhttp.onreadystatechange = function () {
        /*
            this.readyState
            說明：回傳XMLHttpRequest 客戶端物件目前的狀態
            值：
                0：UNSENT，物件已建立，但open()尚未被呼叫
                1：OPENED，open()已被呼叫
                2：HEADERS_RECEIVED，send()已被呼叫，並可取得header與status。
                3：LOADING，回應資料取得中
                4：DONE，完成
        */
        /*
            this.status
            說明：根據XMLHttpRequest的回應傳回的狀況編碼
            值：
                0：UNSENT or OPENED
                200：LOADING or DONE
        */
        if (this.readyState == 4 && this.status == 200) {
            var str = this.response;
			let obj = JSON.parse(str);
			if(obj.hasOwnProperty('total') && url.match(/_count/) == null){
				if(obj.total>20){
					let newParameter;
					if(Parameter=='')	
						newParameter= '?';
					else 
						newParameter= '&';
					
					newParameter += '_count=' + obj.total;
					getResource(URL, ResourceName, newParameter, ResponseType, AfterFun);	
				}
			}
            /*
                eval(string)
                說明：將字串轉為JavaScript Code執行
            */
			// let temp= AfterFun.split('-');
			// if(temp[0] == "setOrganizationListData")
				// eval(temp[0])(str, temp[1]);
			// else 
				eval(AfterFun)(str);
            return str;
        }else{
            if(this.readyState == 4 && this.status != 200)
                alert('資料取得錯誤。錯誤原因：'+this.readyState+':'+this.status)
        }
    };
    /*
        xhttp.send()
        說明：向指定Sever路徑發送請求
    */
    xhttp.send();
}