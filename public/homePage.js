"use strict"


const logout = new LogoutButton();

logout.action = function(){
    ApiConnector.logout(response => {
        if(response.success){
            location.reload();
        }
    });
}

ApiConnector.current(response => {
    if(response.success){
        ProfileWidget.showProfile(response.data)
    }
})

const rates = new RatesBoard();


ApiConnector.getStocks(response => {
    if(response.success) {
        rates.clearTable();
        rates.fillTable(response.data)
    }
});

setInterval(ApiConnector.getStocks, 60000);

const maneyManager = new MoneyManager();

maneyManager.addMoneyCallback = function({ currency, amount }) {
    ApiConnector.addMoney({ currency, amount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            maneyManager.setMessage(true, "успешно");
        } else {
            maneyManager.setMessage(false, response.error);
        }
    })
}

maneyManager.conversionMoneyCallback = function({ fromCurrency, targetCurrency, fromAmount }) {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            maneyManager.setMessage(true, "успешно");
        } else {
            maneyManager.setMessage(false, response.error);
        }
    })
}

maneyManager.sendMoneyCallback = function({ to, currency, amount }) {
    ApiConnector.transferMoney({ to, currency, amount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            maneyManager.setMessage(true, "успешно");
        } else {
            maneyManager.setMessage(false, response.error);
        }
    });
}


const favoritesWidget = new FavoritesWidget;

ApiConnector.getFavorites(response => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        maneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = function({id, name}) {
    ApiConnector.addUserToFavorites({id, name}, response => {
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            maneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранное");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = function(id) {
    ApiConnector.removeUserFromFavorites(id, response => {
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            maneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранного");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}