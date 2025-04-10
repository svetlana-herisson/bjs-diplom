"use strict"

const logout = new LogoutButton();

logout.action = function(){
    ApiConnector.logout(response => {
        if(response.success){
            location.reload();
        }
    });
}