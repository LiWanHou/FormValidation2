function Validator(options){
    var formElement = document.querySelector(options.form)
    if (formElement){
        options.rules.forEach((rule) => {
            
        })
     
    }
}

Validator.isRequiredFullname = function(selector){
    return {
        selector: selector,
        test : function(){

        }
    }
}
Validator.isRequiredEmail = function(selector){
    return {
        selector: selector,
        test : function(){

        }
    }
}